import type { Akicilik } from '../../../shared/ses/konusmaCozumleme';

export type Cefr = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export const CEFR_SIRASI: Cefr[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

/** Grafikte ve karşılaştırmada kullanılan sayısal karşılık. */
export function cefrPuani(s: string): number {
  const i = CEFR_SIRASI.indexOf(String(s).toUpperCase() as Cefr);
  return i < 0 ? 0 : i + 1;
}

export interface GramerHatasi {
  hatali: string;
  dogrusu: string;
  /** Kuralın adı — "Present Continuous", "Sayılamayan isimler" gibi. */
  kuralTr: string;
  aciklamaTr: string;
}

export interface KelimeSecimi {
  kullanilan: string;
  oneri: string;
  nedenTr: string;
}

export interface IfadeOnerisi {
  ifade: string;
  anlamTr: string;
}

export interface BetimlemeAnalizi {
  cefr: Cefr;
  seviyeGerekcesiTr: string;
  gucluYanlarTr: string[];
  gramerHatalari: GramerHatasi[];
  kelimeSecimi: KelimeSecimi[];
  /** Görselde olup betimlemede hiç geçmeyen ayrıntılar. */
  kacirilanlarTr: string[];
  /** Bir üst seviyede yazılmış örnek betimleme (İngilizce). */
  ustSeviyeOrnek: string;
  ustSeviyeNotuTr: string;
  iseYararKelimeler: IfadeOnerisi[];
  /** Örneğin hangi seviyede yazıldığı. */
  hedefSeviye: Cefr;
  /**
   * Modelin görseli GERÇEKTEN görüp görmediği.
   *
   * Görselli çözümleme başarısız olursa sunucu metin üzerinden devam ediyor;
   * o durumda "görselde şunu kaçırdın" demek yanlış olurdu ve ekran bu
   * bayrağa bakıp o bölümü hiç göstermiyor.
   */
  gorselGorulduMu: boolean;
  model?: string;
  uretildi: number;
}

export type GorselKaynagi = 'fotograf' | 'yukleme';

/**
 * Fotoğraf künyesi — CC lisansı atıf istiyorsa GÖSTERİLMEK ZORUNDA.
 *
 * Openverse'ten gelen kareler Flickr ve benzeri kaynaklardan geliyor ve
 * çoğu CC BY türevi: fotoğrafçının adı ve lisans gösterilmezse lisans
 * ihlal edilmiş olur. Bu yüzden kayda da yazılıyor; geçmişe bakarken de
 * künye duruyor.
 */
export interface GorselKunyesi {
  lisans: string;
  atif: string;
  kaynakSayfa: string;
}

/**
 * SAKLANAN BİR BETİMLEME.
 *
 * SES YOK — bilerek. Kayıt tarayıcıda Whisper'a veriliyor, metne
 * dönüştükten sonra bellekten bırakılıyor; hiçbir yere yazılmıyor ve
 * hiçbir yere gönderilmiyor. Burada duran tek konuşma izi `metin`.
 */
export interface BetimlemeKaydi {
  id: string;
  olusturuldu: number;
  /** Küçültülmüş görsel (data URL). Geçmişte neyi anlattığın görünsün diye. */
  gorselKucuk: string;
  gorselKaynagi: GorselKaynagi;
  gorselBaslik?: string;
  /** Fotoğraf kaynaklıysa künye; üretilen ya da yüklenen görselde yok. */
  gorselKunyesi?: GorselKunyesi;
  /** Konuşmanın yazıya dönüşmüş hali. */
  metin: string;
  kelimeSayisi: number;
  akicilik: Akicilik;
  akicilikPuani: number;
  analiz: BetimlemeAnalizi;
}
