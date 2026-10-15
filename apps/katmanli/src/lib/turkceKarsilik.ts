/* TÜRKÇE KARŞILIĞI METİNDE BULMA
 * ============================================================================
 * Raporda İngilizce kelime sarı vurgulanınca, sağdaki Türkçe çeviride de
 * karşılığının vurgulanması gerekiyor. İngilizce tarafta bu kolay: kartın ön
 * yüzü metinde aynen (ya da basit bir çekimle) geçiyor. Türkçede değil.
 *
 * NİYE AYRI BİR EŞLEŞTİRİCİ GEREKTİ:
 *
 *   EKLEMELİ DİL. Kart "ertelemek" yazıyor, cümlede "erteledim" geçiyor.
 *     İngilizce tarafın çekim listesi (cardTerms/inflections) burada
 *     işe yaramıyor — orada sonek sayısı bir avuç, Türkçede uçsuz.
 *
 *   MASTAR EKİ. Kart karşılıkları hemen her zaman mastar: "-mak/-mek".
 *     Cümlede o ek yok. Eki atıp GÖVDEYLE ÖN EK eşleşmesi aramak,
 *     tam bir biçimbilim çözümlemesi yazmadan işin %90'ını görüyor.
 *
 *   ÇOK KARŞILIKLI KARTLAR. "ana dal, bölüm" gibi. Virgülle ayrılmış her
 *     seçenek ayrı ayrı deneniyor; ilk tutan vurgulanıyor.
 *
 * KASITLI OLARAK KABA. Çeviri kelimesi kelimesine olmak zorunda değil:
 * çevirmen "ertelemek" yerine "savsaklamak" demişse hiçbir şey vurgulanmaz.
 * Bu bir kusur değil — yanlış yeri vurgulamaktansa vurgulamamak iyidir.
 */

/** Türkçeye duyarlı küçük harf: I→ı, İ→i. */
export function kucult(s: string): string {
  return s.replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase();
}

const HARF = "a-zA-ZçğıöşüÇĞİIÖŞÜ";
const KELIME_RE = new RegExp(`[${HARF}][${HARF}'’-]*`, 'g');

/**
 * Tek başına hedef sayılmayan kelimeler.
 *
 * Gövde eşleşmesi ön ek tabanlı olduğu için "bir" gibi kısa ve çok geçen
 * bir kelime "birkaç", "birlikte", "biraz"ı da tutardı. Çok kelimeli bir
 * karşılığın İÇİNDE geçmeleri sorun değil: orada komşu kelimeler de
 * tutmak zorunda.
 */
const TEK_BASINA_OLMAZ = new Set([
  'bir', 've', 'ile', 'için', 'bu', 'şu', 'o', 'da', 'de', 'ki', 'mi',
  'çok', 'az', 'ama', 'veya', 'gibi', 'daha', 'en', 'her', 'ne', 'kadar',
  'olarak', 'olan', 'olmak', 'etmek', 'yapmak', 'şey',
]);

/** Mastar ekini atar: "ertelemek" → "ertele", "yaymak" → "yay". */
export function govde(kelime: string): string {
  const k = kucult(kelime);
  if (k.length > 5 && (k.endsWith('mak') || k.endsWith('mek'))) {
    return k.slice(0, -3);
  }
  return k;
}

/** Ön ek eşleşmesi için gereken en kısa gövde. */
const EN_KISA_GOVDE = 4;

/**
 * Metindeki bir kelime, hedef kelimenin bir biçimi mi?
 *
 * Ön ek eşleşmesi: biri diğeriyle başlıyorsa aynı gövdedendirler.
 *
 * DÖRT HARF EŞİĞİ ÖLÇÜLDÜ, SEÇİLMEDİ. Üç harfle "bakmak" kartı
 * "Bakır"ı tutuyordu (gövde "bak", kelime "bakır" ile başlıyor) —
 * tamamen alakasız bir kelime sarıya boyanıyordu. Üç harflik bir
 * gövdeyi gerçek bir çekimden ("bakar") ayırmak tam bir biçimbilim
 * çözümlemesi ister.
 *
 * BEDELİ: "yaymak" gibi kısa gövdeli fiiller artık çekimli hâlleriyle
 * eşleşmiyor, yani karşılık vurgusuz kalıyor. Bilerek bu yönde: eksik
 * vurgu yalnızca bir şey eksik bırakır, yanlış vurgu ise raporu
 * güvenilmez yapar.
 */
function kelimeEslesiyor(metinKelimesi: string, hedef: string): boolean {
  const a = kucult(metinKelimesi);
  if (!a) return false;

  /* BIREBIR ESITLIK GOVDEDEN ONCE. Kisa govdeli bir fiilin mastari
     cumlede aynen gecebiliyor ("yaymak gerekiyordu"); yalnizca govdeye
     bakilsaydi dort harf esigine takilip kacirilirdi. */
  if (a === kucult(hedef)) return true;

  const b = govde(hedef);
  if (!b) return false;
  if (a === b) return true;
  if (a.startsWith(b)) return b.length >= EN_KISA_GOVDE;
  if (b.startsWith(a)) return a.length >= EN_KISA_GOVDE;
  return false;
}

export interface KarsilikAraligi {
  start: number;
  end: number;
}

/** Kart karşılığındaki seçenekler: "ana dal, bölüm" → ["ana dal", "bölüm"]. */
export function karsilikSecenekleri(karsilik: string): string[][] {
  return karsilik
    /* Parantez içi açıklama hedef değil: "ertelemek (bir işi)". */
    .replace(/\([^)]*\)/g, ' ')
    .split(/[,;/]|\bveya\b|\bya da\b/)
    .map((p) => [...p.matchAll(KELIME_RE)].map((m) => m[0]))
    .filter((kelimeler) => kelimeler.length > 0);
}

/**
 * Türkçe cümlede, verilen karşılıkların geçtiği karakter aralıkları.
 *
 * `karsiliklar` = o cümlede İngilizce tarafta vurgulanan kartların Türkçe
 * karşılıkları. Hiçbiri bulunamazsa boş dizi döner ve cümle vurgusuz kalır.
 */
export function turkceKarsilikAraliklari(
  turkce: string,
  karsiliklar: string[]
): KarsilikAraligi[] {
  if (!turkce || karsiliklar.length === 0) return [];

  const belirtecler = [...turkce.matchAll(KELIME_RE)];
  if (belirtecler.length === 0) return [];

  const bulunan: KarsilikAraligi[] = [];

  for (const karsilik of karsiliklar) {
    for (const secenek of karsilikSecenekleri(karsilik)) {
      /* Tek kelimelik karşılık çok geçen bir kelimeyse atlanıyor. */
      if (secenek.length === 1 && TEK_BASINA_OLMAZ.has(kucult(secenek[0]))) continue;

      for (let i = 0; i + secenek.length <= belirtecler.length; i++) {
        let tuttu = true;
        for (let j = 0; j < secenek.length; j++) {
          if (!kelimeEslesiyor(belirtecler[i + j][0], secenek[j])) {
            tuttu = false;
            break;
          }
        }
        if (!tuttu) continue;

        const ilk = belirtecler[i];
        const son = belirtecler[i + secenek.length - 1];
        bulunan.push({ start: ilk.index!, end: son.index! + son[0].length });
        /* Aynı seçeneği cümlenin geri kalanında aramıyoruz: bir kelimenin
           ilk geçişini işaretlemek yetiyor, tekrarları boyamak satırı
           okunmaz hale getirir. */
        break;
      }
    }
  }

  return birlestir(bulunan);
}

/** Çakışan aralıkları birleştirip sıraya koyar. */
function birlestir(araliklar: KarsilikAraligi[]): KarsilikAraligi[] {
  if (araliklar.length === 0) return [];
  const sirali = [...araliklar].sort((a, b) => a.start - b.start);
  const out: KarsilikAraligi[] = [sirali[0]];
  for (const r of sirali.slice(1)) {
    const son = out[out.length - 1];
    if (r.start <= son.end) son.end = Math.max(son.end, r.end);
    else out.push(r);
  }
  return out;
}
