/* TELAFFUZ KARŞILAŞTIRMASI İÇİN SES ÇALMA
 * ============================================================================
 * İki ses var ve ikisi ayrı yerden geliyor:
 *
 *   DOĞRU OKUNUŞ  -> /api/speak, "kelime" profili. Depoda zaten çalışan bir
 *     seslendirme var (ElevenLabs, düşerse Gemini); telaffuz için ikinci bir
 *     servis eklemeye gerek yok. "kelime" profili tek kelimeyi yavaş ve net
 *     okuyor — hikaye profilinin akıcı temposu burada işe yaramaz.
 *
 *   SENİN SÖYLEYİŞİN -> o anki kaydın kendisi, bellekteki blob üzerinden.
 *     Yalnızca alıştırmadan hemen sonra var; geçmişe bakarken yok, çünkü
 *     kayıt saklanmıyor.
 *
 * ÖNBELLEK: aynı kelimenin doğru okunuşu bir oturumda defalarca isteniyor
 * (karşılaştır düğmesi üst üste basılan bir düğme). İkinci kez ağa çıkmak
 * hem yavaş hem de seslendirme kotasını boşa harcar.
 */

import { apiFetch } from '../../../../shared/vocab/userKeys';

/** kelime -> objectURL. Sekme kapanınca zaten gidiyor. */
const onbellek = new Map<string, string>();

/** Aynı anda tek ses: üst üste basınca sesler çakışmasın. */
let calan: HTMLAudioElement | null = null;

export function sesiDurdur(): void {
  if (calan) {
    calan.pause();
    calan = null;
  }
}

function cal(url: string, bas = 0, son?: number): Promise<void> {
  return new Promise((coz) => {
    sesiDurdur();
    const ses = new Audio(url);
    calan = ses;

    const bitir = () => {
      ses.onended = null;
      ses.ontimeupdate = null;
      if (calan === ses) calan = null;
      coz();
    };

    ses.onended = bitir;
    ses.onerror = bitir;
    if (typeof son === 'number') {
      /* Kesitin sonunda durdurmak için timeupdate yeterli: tarayıcılar
         bunu ~250 ms'de bir tetikliyor ve kesit sınırındaki bu kadarlık
         taşma kulakla fark edilmiyor. */
      ses.ontimeupdate = () => {
        if (ses.currentTime >= son) {
          ses.pause();
          bitir();
        }
      };
    }

    const basla = () => {
      if (bas > 0) ses.currentTime = bas;
      void ses.play().catch(bitir);
    };

    /* currentTime, meta veri yüklenmeden atanamıyor. */
    if (ses.readyState >= 1) basla();
    else ses.onloadedmetadata = basla;
  });
}

/** Kelimenin doğru okunuşunu seslendirip çalar. */
export async function dogruOkunusuCal(kelime: string): Promise<void> {
  const anahtar = kelime.trim().toLowerCase();
  if (!anahtar) return;

  let url = onbellek.get(anahtar);
  if (!url) {
    const yanit = await apiFetch('/api/speak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: kelime, profil: 'kelime' }),
    });
    if (!yanit.ok) throw new Error('Doğru okunuş seslendirilemedi.');
    const govde = await yanit.json();
    if (!govde?.audio) throw new Error('Seslendirme boş döndü.');

    const ikili = atob(govde.audio);
    const bayt = new Uint8Array(ikili.length);
    for (let i = 0; i < ikili.length; i++) bayt[i] = ikili.charCodeAt(i);
    url = URL.createObjectURL(new Blob([bayt], { type: govde.mimeType || 'audio/mpeg' }));
    onbellek.set(anahtar, url);
  }

  await cal(url);
}

/** Kendi kaydının bir kesitini çalar. */
export function kendiKesitiniCal(sesUrl: string, bas: number, son: number): Promise<void> {
  /* Kesitin iki ucuna küçük pay: modelin verdiği zaman damgaları kesin
     değil (ölçüldü) ve tam sınırdan başlayan bir kesit kelimenin ilk
     sesini yutuyor. */
  const pay = 0.15;
  return cal(sesUrl, Math.max(0, bas - pay), son + pay);
}

/**
 * KARŞILAŞTIR: önce senin söyleyişin, sonra doğrusu.
 *
 * Aradaki 450 ms bilerek: iki ses arka arkaya bitişik çalınca kulak
 * ikisini tek bir akış sanıyor ve fark kayboluyor. Kısa bir sessizlik
 * onları iki ayrı örnek yapıyor. (Değer AI Studio sürümünden geliyor,
 * orada da aynı gerekçeyle seçilmişti.)
 */
export async function karsilastir(
  kelime: string,
  sesUrl: string | null | undefined,
  bas?: number,
  son?: number
): Promise<void> {
  if (sesUrl && typeof bas === 'number' && typeof son === 'number') {
    await kendiKesitiniCal(sesUrl, bas, son);
    await new Promise((r) => setTimeout(r, 450));
  }
  await dogruOkunusuCal(kelime);
}
