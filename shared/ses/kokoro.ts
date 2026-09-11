import { onbellegeYaz, onbellektenAl } from './sesOnbellegi';

/* KOKORO — ARKA PLANDA HAZIRLAMA
 * ============================================================================
 * Fikir kullanıcıdan geldi ve doğru yeri buluyor: okuma parçasını açmakla
 * "oynat"a basmak arasında dakikalar var. Kişi önce metni okuyor, kelimelere
 * bakıyor, soruları çözüyor. Kokoro tam o boşlukta bütün paragrafları
 * üretebilir.
 *
 * Kazanç iki taraflı:
 *   - Oynat'a basıldığında ses HAZIR, hiç beklenmiyor.
 *   - ElevenLabs kotasından tek karakter yenmiyor.
 *
 * NASIL BAĞLANIYOR: Kokoro üretilen sesi, çalma yolunun zaten baktığı
 * önbelleğe AYNI ANAHTARLA yazıyor. Yani narration tarafında çalma mantığı
 * hiç değişmiyor — sadece "parça açıldı" anında burayı tetikliyor.
 *
 * SES EŞLEŞMESİ: Kokoro'nun kendi ses adları var ve kalite notları da
 * kendisinden geliyor. Arayüzdeki altı seçenek, aynı karakterdeki EN İYİ
 * Kokoro sesine bağlandı — ad benzerliğine değil. (af_kore C+, af_heart A;
 * "Kore" seçeni körlemesine af_kore'ye bağlamak daha kötü ses verirdi.)
 */

export type KokoroDurum = 'kapali' | 'yukleniyor' | 'uretiliyor' | 'hazir' | 'hata';

/** Arayüzdeki ses adı → Kokoro sesi (her kategoride en yüksek notlu). */
const SES_ESLESME: Record<string, string> = {
  Kore: 'af_heart',     // A    — sakin kadın
  Aoede: 'af_bella',    // A-   — yumuşak kadın
  Leda: 'af_nicole',    // B-   — genç kadın
  Puck: 'am_puck',      // C+   — canlı erkek
  Charon: 'am_michael', // C+   — derin erkek
  Orus: 'am_fenrir',    // C+   — sıcak erkek
};

/* Kokoro'nun erkek seslerinin hepsi C+ ve altı; en iyi sesler kadın
   (Heart A, Bella A-) ve İngiliz aksanlı Emma (B-). */

/* OKUMA HIZI
 *
 * Tahminle degil olcumle secildi. Ayni paragrafi alti hizda urettim ve
 * dakikada kac kelime okundugunu saydim (canli sitede ve yerelde ayni
 * sayilar cikti):
 *
 *     1.00 -> 207 wpm      0.85 -> 186 wpm      0.75 -> 151 wpm
 *     0.90 -> 193 wpm      0.80 -> 169 wpm      0.70 -> 141 wpm
 *
 * Sesli kitap anlatimi ~150 wpm; dil calisan biri icin rahat takip araligi
 * 130-150. Kokoro'nun varsayilani (207) bu araligin epey uzerinde kaliyordu
 * ve kullanici da dinleyince "biraz hizli" dedi. 0.75 tam anlatim temposuna
 * denk geliyor.
 *
 * Arayuzdeki 0,75x-1,5x dugmeleri bunun uzerine CALMA hizi olarak biniyor,
 * yani hizli dinlemek isteyen yine hizlandirabiliyor.
 */
const OKUMA_HIZI = 0.75;

let isci: Worker | null = null;

let bekleyen = new Map<string, (blob: Blob | null) => void>();
let dinleyiciler = new Set<(d: KokoroDurum, ayrinti?: { yuzde?: number; kalan?: number }) => void>();
let kalanIs = 0;
let sonDurum: KokoroDurum = 'kapali';

function durumBildir(d: KokoroDurum, ayrinti?: { yuzde?: number; kalan?: number }) {
  sonDurum = d;
  for (const f of dinleyiciler) f(d, ayrinti);
}

export function kokoroDurumunuIzle(
  f: (d: KokoroDurum, ayrinti?: { yuzde?: number; kalan?: number }) => void
): () => void {
  dinleyiciler.add(f);
  f(sonDurum);
  return () => dinleyiciler.delete(f);
}

/**
 * Arka plan uretimi bu baglantida makul mu?
 *
 * Ilk kullanimda ~94 MB iniyor (2,2 MB kutuphane + 92 MB model). Masaustunde
 * ve wifi de sorun degil; mobil veride ya da "veri tasarrufu" acikken
 * kullaniciya sormadan bunu indirmek kabalik olur. Tarayici boyle bir
 * baglanti bildiriyorsa arka plan uretimi hic baslamiyor ve ses normal
 * yoldan (ElevenLabs) geliyor.
 */
function baglantiUygun(): boolean {
  const c = (navigator as any)?.connection;
  if (!c) return true;                       // bilgi yoksa engelleme
  if (c.saveData) return false;              // kullanici acikca tasarruf istiyor
  const t = String(c.effectiveType || '');
  return !(t === 'slow-2g' || t === '2g' || t === '3g');
}

function isciyiAl(): Worker | null {
  if (isci) return isci;
  if (typeof Worker === 'undefined') return null;
  if (!baglantiUygun()) return null;
  try {
    isci = new Worker(new URL('./kokoroIsci.ts', import.meta.url), { type: 'module' });
    isci.onmessage = async (e: MessageEvent<any>) => {
      const m = e.data;
      if (m.tip === 'yukleniyor') {
        durumBildir('yukleniyor', { yuzde: m.yuzde });
        return;
      }
      if (m.tip === 'hata') {
        /* Tek bir paragraf basarisizsa isi bitmis say: bekleyen taraf
           null alip normal yoluna (ElevenLabs) donsun. */
        if (m.anahtar) {
          bekleyen.get(m.anahtar)?.(null);
          bekleyen.delete(m.anahtar);
          kalanIs = Math.max(0, kalanIs - 1);
        } else {
          durumBildir('hata');
        }
        return;
      }
      if (m.tip === 'ses') {
        const blob = new Blob([m.wav], { type: 'audio/wav' });
        await onbellegeYaz(m.anahtar, blob);
        bekleyen.get(m.anahtar)?.(blob);
        bekleyen.delete(m.anahtar);
        kalanIs = Math.max(0, kalanIs - 1);
        durumBildir(kalanIs > 0 ? 'uretiliyor' : 'hazir', { kalan: kalanIs });
      }
    };
    isci.onerror = () => durumBildir('hata');
  } catch {
    isci = null;
  }
  return isci;
}

/**
 * Bir parçanın bütün paragraflarını arka planda hazırlar.
 *
 * Önbellekte olan paragraflar atlanıyor — ikinci kez açılan bir parça hiç
 * iş üretmiyor.
 */
export function kokoroylaHazirla(
  anahtarUret: (index: number) => string,
  paragraflar: string[],
  sesAdi: string
): void {
  const w = isciyiAl();
  if (!w) return;

  const ses = SES_ESLESME[sesAdi] || 'af_heart';

  void (async () => {
    const yapilacak: { anahtar: string; metin: string }[] = [];
    for (let i = 0; i < paragraflar.length; i++) {
      const anahtar = anahtarUret(i);
      const hazir = await onbellektenAl(anahtar);
      if (!hazir) yapilacak.push({ anahtar, metin: paragraflar[i] });
    }
    if (!yapilacak.length) {
      durumBildir('hazir', { kalan: 0 });
      return;
    }
    kalanIs += yapilacak.length;
    durumBildir('uretiliyor', { kalan: kalanIs });
    for (const is of yapilacak) {
      w.postMessage({ tip: 'uret', anahtar: is.anahtar, metin: is.metin, ses, hiz: OKUMA_HIZI });
    }
  })();
}

/**
 * Bir paragrafın Kokoro'dan çıkmasını sınırlı süre bekler.
 *
 * NEDEN GEREKLİ: çalma yolu, bir paragraf çalarken sıradakini önden
 * indiriyor ki paragraf arası sessiz kalmasın. Ama Kokoro tam o sırada aynı
 * paragrafı üretiyor olabiliyor — ölçtüm, canlıda oluyor da. O anda
 * ElevenLabs'e gitmek hem gereksiz hem de kullanıcının kotasından yiyor.
 *
 * Burada kuyruktaki iş bitene kadar (en fazla verilen süre) bekleniyor.
 * Kokoro yetişmezse null dönüyor ve çalma yolu normal şekilde ağa gidiyor,
 * yani paragraf arasında bekleme riski yok.
 *
 * Kokoro hiç çalışmıyorsa (desteklenmiyor, kapalı, sıra boş) anında null
 * dönüyor — boşuna bekletmiyor.
 */
export function kokorodanBekle(anahtar: string, enFazlaMs: number): Promise<Blob | null> {
  if (!isci || kalanIs === 0) return Promise.resolve(null);
  return new Promise((coz) => {
    const sayac = setTimeout(() => {
      bekleyen.delete(anahtar);
      coz(null);
    }, enFazlaMs);
    bekleyen.set(anahtar, (blob) => {
      clearTimeout(sayac);
      coz(blob);
    });
  });
}

/** Başka bir parçaya geçilince bekleyen işleri bırak. */
export function kokoroyuDurdur(): void {
  isci?.postMessage({ tip: 'iptal' });
  kalanIs = 0;
  bekleyen.clear();
  durumBildir('kapali');
}
