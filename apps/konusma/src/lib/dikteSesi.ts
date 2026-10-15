/* DİKTE SESİ — İKİ AYRI KAYIT, HIZ OYNAMASI YOK
 * ============================================================================
 * BU DOSYANIN VAR OLMA SEBEBİ TEK CÜMLE: dikte uygulamalarının çoğu "yavaş"
 * düğmesinde sesin oynatma hızını düşürüyor (`audio.playbackRate = 0.6`).
 * O zaman ses esniyor, tınısı bozuluyor ve yavaşlatmak konuşmayı daha
 * anlaşılır değil DAHA ANLAŞILMAZ yapıyor.
 *
 * Gerçek dikte kayıtlarında yavaş sürüm ayrı okunur. Kullanıcının örnek
 * olarak verdiği iki dosyada ölçülen de bu:
 *     normal : 15,2 sn toplam /  8,3 sn konuşma
 *     yavaş  : 116,2 sn toplam / 25,8 sn konuşma
 * Yavaş sürümde konuşma süresi ÜÇ KAT — yani hız düşürülmemiş, yeniden
 * okunmuş. Kalan 77 saniye de yazmak için bırakılan duraklamalar.
 *
 * Burada da aynısı: aynı metin için İKİ AYRI seslendirme isteği
 * (`dikte` ve `dikteYavas` profilleri, server.ts). Duraklamalar sesin
 * içine gömülmüyor, oynatıcı bekliyor — böylece süresi ayarlanabiliyor.
 *
 * Bu dosyada `playbackRate` geçmiyor ve geçmemeli.
 */

import { apiFetch } from '../../../../shared/vocab/userKeys';

export type DikteHizi = 'normal' | 'yavas';

/** `${hiz}|${metin}` -> objectURL. Aynı birim defalarca dinleniyor. */
const onbellek = new Map<string, string>();

let calan: HTMLAudioElement | null = null;
/** Çalan sesin bitmesini bekleyen söz; durdurulunca da çözülüyor. */
let bekleyenCozum: (() => void) | null = null;

/** Çalan sesi durdurur ve bekleyen çağrıyı serbest bırakır. */
export function dikteyiDurdur(): void {
  if (calan) {
    calan.pause();
    calan.currentTime = 0;
    calan = null;
  }
  if (bekleyenCozum) {
    const c = bekleyenCozum;
    bekleyenCozum = null;
    c();
  }
}

const anahtar = (metin: string, hiz: DikteHizi) => `${hiz}|${metin}`;

/** Bir dikte birimini seslendirir; sonuç objectURL olarak önbelleğe girer. */
export async function dikteSesiUret(metin: string, hiz: DikteHizi): Promise<string> {
  const k = anahtar(metin, hiz);
  const varsa = onbellek.get(k);
  if (varsa) return varsa;

  const res = await apiFetch('/api/speak', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    /* Hızı belirleyen şey PROFİL, yani metnin nasıl okunacağı.
       İstemci tarafında bir hız çarpanı yok. */
    body: JSON.stringify({ text: metin, profil: hiz === 'yavas' ? 'dikteYavas' : 'dikte' }),
  });

  /* /api/speak HAM SES DEGIL, base64 gomulu JSON donuyor
     ({ audio, mimeType }). res.blob() dogrudan kullanilsaydi JSON
     metninden bir blob uretilir ve hicbir sey calmazdi - sessizce.
     Depodaki sesCalma.ts de ayni cozumlemeyi yapiyor. */
  const govde = await res.json().catch(() => null);

  if (!res.ok) throw new Error(govde?.error || 'Ses üretilemedi.');
  if (!govde?.audio) throw new Error('Seslendirme boş döndü.');

  const ikili = atob(govde.audio);
  const bayt = new Uint8Array(ikili.length);
  for (let i = 0; i < ikili.length; i++) bayt[i] = ikili.charCodeAt(i);

  const url = URL.createObjectURL(
    new Blob([bayt], { type: govde.mimeType || 'audio/mpeg' })
  );
  onbellek.set(k, url);
  return url;
}

/**
 * Bir birimi çalar ve bitince döner.
 *
 * Söz, sesin SONUNDA çözülüyor; çağıran taraf duraklamayı ondan sonra
 * başlatabilsin diye. Durdurulursa da çözülüyor, yoksa akış kilitlenirdi.
 */
export function dikteyiCal(url: string): Promise<void> {
  dikteyiDurdur();
  return new Promise<void>((cozumle) => {
    const ses = new Audio(url);
    calan = ses;
    bekleyenCozum = cozumle;

    const bitir = () => {
      if (calan === ses) calan = null;
      if (bekleyenCozum === cozumle) {
        bekleyenCozum = null;
        cozumle();
      }
    };

    ses.addEventListener('ended', bitir, { once: true });
    /* Ses açılamazsa akış durmamalı: hata da "bitti" sayılıyor. */
    ses.addEventListener('error', bitir, { once: true });
    void ses.play().catch(bitir);
  });
}

/** Bekleme; durdurulduğunda erken dönebilsin diye iptal edilebilir. */
export function bekle(saniye: number, iptal: { durduruldu: boolean }): Promise<void> {
  return new Promise((cozumle) => {
    const basla = Date.now();
    const sayac = setInterval(() => {
      if (iptal.durduruldu || Date.now() - basla >= saniye * 1000) {
        clearInterval(sayac);
        cozumle();
      }
    }, 100);
  });
}

/** Sekme kapanırken objectURL'leri bırak. */
export function dikteOnbelleginiBosalt(): void {
  for (const url of onbellek.values()) URL.revokeObjectURL(url);
  onbellek.clear();
}
