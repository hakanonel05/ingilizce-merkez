/* DİKTE — METNİ BÖLME ve YAZILANI DENETLEME
 * ============================================================================
 * İki saf iş var, ikisi de tarayıcı API'si istemiyor, ikisi de sınanabilir:
 *
 *   BÖLME. Dikte birimi paragraf değil, bir solukta yazılabilecek bir parça.
 *     Önce cümlelere, uzun cümleler de virgül/bağlaç sınırlarından alt
 *     parçalara bölünüyor.
 *
 *   DENETLEME. Yazılan metin hedefle kelime kelime hizalanıyor. Hizalama
 *     shared/ses/konusmaCozumleme'den geliyor — konuşma çözümlemesinde
 *     "duyulan"ı hedefle karşılaştıran aynı Needleman-Wunsch. İkinci bir
 *     kopya yazmak iki ölçütün zamanla ayrışması demekti.
 */

import { hizala, sadeles, cumleyiBol } from '../../../../shared/ses/konusmaCozumleme';

/**
 * Dikte karşılaştırması için sadeleştirme.
 *
 * sadeles kesme işaretini KORUYOR ve konuşma çözümlemesinde bu doğru:
 * Whisper "don't" duyduysa "don't" yazar, "dont" yazmaz — aradaki fark
 * gerçek bir fark olur. Diktede ise kullanıcı klavyede yazıyor;
 * "dont" yazmış olması duymadığını değil kesme işaretini atladığını
 * gösterir. Dikte dinlemeyi ölçüyor, yazım işaretlerini değil.
 */
const dikteSadeles = (k: string): string => sadeles(k).replace(/'/g, '');

/** Bir dikte birimi: tek seferde dinlenip yazılan parça. */
export interface DikteBirimi {
  sira: number;
  metin: string;
  kelimeSayisi: number;
}

/** Hedefteki bir kelimenin denetim sonucu. */
export type DikteKelimeDurumu = 'dogru' | 'yanlis' | 'eksik';

export interface DikteKelimesi {
  hedef: string;
  yazilan: string | null;
  durum: DikteKelimeDurumu;
}

export interface DikteSonucu {
  kelimeler: DikteKelimesi[];
  /** Hedefte olmayıp fazladan yazılanlar. */
  fazladan: string[];
  dogru: number;
  toplam: number;
  /** Doğru kelime oranı, 0-100. */
  puan: number;
  /** Noktalama ve büyük harf dışında birebir mi. */
  tamMi: boolean;
}

/* Bir birime sığdırılacak en fazla kelime. Üstüne çıkınca virgül ve
   bağlaç sınırlarından bölünüyor. Ölçü kulaktan değil elden geliyor:
   ~12 kelime, bir kez dinleyip yazabileceğin uzunluk. */
const EN_FAZLA_KELIME = 12;
/* Bundan kısa bir parça tek başına birim olmaz, öncekine ekleniyor:
   "Yes." tek başına bir dikte birimi değildir. */
const EN_AZ_KELIME = 3;

const kelimeSay = (s: string) => (s.trim().match(/\S+/g) || []).length;

/** Uzun bir cümleyi virgül / noktalı virgül / bağlaç sınırlarından böler. */
function cumleyiParcala(cumle: string): string[] {
  if (kelimeSay(cumle) <= EN_FAZLA_KELIME) return [cumle];

  /* Sınırı KORUYARAK bölüyoruz: virgül parçanın sonunda kalmalı,
     yoksa yeniden birleştirildiğinde metin bozulurdu. */
  const parcalar = cumle
    .split(/(?<=[,;:])\s+|\s+(?=(?:and|but|or|because|so|which|that|when|while|if)\s)/i)
    .map((p) => p.trim())
    .filter(Boolean);

  if (parcalar.length <= 1) return [cumle];

  /* Bölme sonrası çok kısa kalan parçalar komşusuna yapıştırılıyor. */
  const birlesik: string[] = [];
  for (const p of parcalar) {
    const son = birlesik[birlesik.length - 1];
    if (son && (kelimeSay(son) < EN_AZ_KELIME || kelimeSay(p) < EN_AZ_KELIME)) {
      birlesik[birlesik.length - 1] = `${son} ${p}`;
    } else {
      birlesik.push(p);
    }
  }
  return birlesik;
}

/** Metni dikte birimlerine böler. */
export function dikteBirimleri(metin: string): DikteBirimi[] {
  const temiz = String(metin || '').replace(/\s+/g, ' ').trim();
  if (!temiz) return [];

  /* Cümle sonu noktalamasını koruyarak böl. */
  const cumleler = temiz
    .split(/(?<=[.!?])\s+/)
    .map((c) => c.trim())
    .filter(Boolean);

  const ham: string[] = [];
  for (const c of cumleler) ham.push(...cumleyiParcala(c));

  /* Son geçiş: tek başına kalan çok kısa parçayı komşusuna ekle.
     İKİ YÖNLÜ olmak zorunda. Yalnızca "öncekine ekle" denseydi metnin
     BAŞINDAKİ kısa parçanın öncesi olmadığı için tek başına kalırdı —
     "Yes. I will be there at nine." ilk birimi "Yes." oluyordu ve o,
     bir dikte birimi değil. */
  const birimler: string[] = [];
  for (const p of ham) {
    const son = birimler[birimler.length - 1];
    if (son && kelimeSay(p) < EN_AZ_KELIME) birimler[birimler.length - 1] = `${son} ${p}`;
    else birimler.push(p);
  }
  while (birimler.length > 1 && kelimeSay(birimler[0]) < EN_AZ_KELIME) {
    birimler[1] = `${birimler[0]} ${birimler[1]}`;
    birimler.shift();
  }

  return birimler.map((m, i) => ({ sira: i + 1, metin: m, kelimeSayisi: kelimeSay(m) }));
}

/**
 * Yazılanı hedefle karşılaştırır.
 *
 * NOKTALAMA ve BÜYÜK HARF SAYILMIYOR. Dikte dinleme alıştırmasıdır:
 * "dont" ile "don't" arasındaki fark kulağın değil klavyenin işi, ve
 * yanlış sayılması kullanıcıyı asıl ölçülen şeyden uzaklaştırır.
 * `tamMi` yine de birebir olup olmadığını söylüyor.
 */
export function dikteyiDenetle(hedef: string, yazilan: string): DikteSonucu {
  const hedefHam = cumleyiBol(hedef);
  const yazilanHam = cumleyiBol(yazilan);

  const hedefSade = hedefHam.map(dikteSadeles);
  const yazilanSade = yazilanHam.map(dikteSadeles);

  const adimlar = hizala(hedefSade, yazilanSade);

  const kelimeler: DikteKelimesi[] = [];
  const fazladan: string[] = [];

  for (const adim of adimlar) {
    if (adim.hedefIndeks === null) {
      if (adim.duyulanIndeks !== null && yazilanSade[adim.duyulanIndeks]) {
        fazladan.push(yazilanHam[adim.duyulanIndeks]);
      }
      continue;
    }
    const h = hedefHam[adim.hedefIndeks];
    if (adim.duyulanIndeks === null) {
      kelimeler.push({ hedef: h, yazilan: null, durum: 'eksik' });
      continue;
    }
    const y = yazilanHam[adim.duyulanIndeks];
    const esit = hedefSade[adim.hedefIndeks] === yazilanSade[adim.duyulanIndeks];
    kelimeler.push({ hedef: h, yazilan: y, durum: esit ? 'dogru' : 'yanlis' });
  }

  const toplam = kelimeler.length;
  const dogru = kelimeler.filter((k) => k.durum === 'dogru').length;

  return {
    kelimeler,
    fazladan,
    dogru,
    toplam,
    puan: toplam === 0 ? 0 : Math.round((dogru / toplam) * 100),
    tamMi: toplam > 0 && dogru === toplam && fazladan.length === 0,
  };
}

/**
 * Bir birimden sonra yazmak için bırakılacak duraklama (saniye).
 *
 * SESİN İÇİNE GÖMÜLMÜYOR, oynatıcı bekliyor. Örnek kayıtta duraklamalar
 * dosyanın içindeydi (116 saniyenin 77'si sessizlik) ve bu, hızını
 * değiştiremediğin sabit bir süre demek. Burada ayarlanabilir: hızlı
 * yazan beklemiyor, yavaş yazan sıkışmıyor.
 */
export function duraklamaSuresi(kelimeSayisi: number, carpan = 1): number {
  /* Elle yazmak kelime başına ~0,8 sn; altına 2 saniyelik taban. */
  return Math.round(Math.max(2, kelimeSayisi * 0.8) * carpan * 10) / 10;
}
