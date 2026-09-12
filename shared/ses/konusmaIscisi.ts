/// <reference lib="webworker" />

/* KONUŞMA ÇÖZÜMLEME — AYRI İŞ PARÇACIĞINDA
 * ============================================================================
 * Kullanıcının kendi kaydını Whisper ile yazıya çeviriyor. Model tarayıcıda
 * çalışıyor; kayıt cihazdan HİÇ ÇIKMIYOR. Ekrandaki "kayıt tarayıcıda kalır,
 * hiçbir yere gönderilmez" sözü bu yüzden bozulmuyor — sunucuya gönderen bir
 * çözüm o cümleyi yalan yapardı.
 *
 * NEDEN WORKER: bir cümlenin çözümü birkaç saniye sürüyor ve bu süre boyunca
 * ana iş parçacığı dursaydı arayüz donardı. Kullanıcı tam o sırada kaydını
 * dinliyor olabiliyor.
 *
 * NEDEN Xenova/whisper-base.en:
 *
 *   - Kelime zaman damgası. Akıcılık ölçmek için duraklamanın NEREDE olduğu
 *     lazım. Ölçtüm: onnx-community dışa aktarımları "cross attention yok"
 *     diyip reddediyor, Xenova dışa aktarımları kelime kelime damga veriyor.
 *
 *   - base, tiny değil. İkisi de test cümlesindeki üç yanlış kelimeyi (3/3)
 *     yakaladı, ama o test Kokoro'nun ürettiği tertemiz sesti. Gerçek kullanıcı
 *     aksanlı ve mikrofonu gürültülü konuşuyor; orada tiny daha çok yanılıyor.
 *     Yanılma yönü de kötü: DOĞRU söylenmiş bir kelimeyi yanlış duyup
 *     kullanıcıya "bunu yanlış söyledin" demek, bu özelliğin en zarar verici
 *     hatası. 34 MB fazladan indirme buna değer.
 *
 *   - .en (yalnızca İngilizce). Çok dilli sürüm daha büyük ve burada okunan
 *     metin her zaman İngilizce.
 *
 * Ölçülen: base.en q8 = 76 MB, gerçek zamanın ~5 katı hızda çözüyor (Node,
 * CPU). Tarayıcıda WASM ile daha yavaş; 10 saniyelik bir kayıt birkaç saniye.
 */

import type { Pipeline } from '@huggingface/transformers';

const MODEL = 'Xenova/whisper-base.en';

type Istek =
  | { tip: 'hazirla' }
  | { tip: 'coz'; anahtar: string; pcm: Float32Array }
  | { tip: 'iptal' };

export interface CozumKelimesi {
  metin: string;
  bas: number;
  son: number;
}

type Yanit =
  | { tip: 'hazir' }
  | { tip: 'yukleniyor'; yuzde: number }
  | { tip: 'cozum'; anahtar: string; metin: string; kelimeler: CozumKelimesi[] }
  | { tip: 'hata'; anahtar?: string; mesaj: string };

const gonder = (y: Yanit) => (self as unknown as DedicatedWorkerGlobalScope).postMessage(y);

let boru: Pipeline | null = null;
let yukleniyor: Promise<Pipeline> | null = null;

/** Sıraya alınan işler; teker teker işleniyor (model tek örnek). */
const kuyruk: { anahtar: string; pcm: Float32Array }[] = [];
let calisiyor = false;

async function modeliYukle(): Promise<Pipeline> {
  if (boru) return boru;
  if (yukleniyor) return yukleniyor;

  yukleniyor = (async () => {
    /* Dinamik import: transformers.js büyük bir paket ve bu kod yalnızca
       kullanıcı kaydını çözümlemek istediğinde gerekiyor. Statik olsaydı
       katmanlı uygulamanın ana paketine binerdi. */
    const { pipeline } = await import('@huggingface/transformers');
    const p = await pipeline('automatic-speech-recognition', MODEL, {
      dtype: 'q8',
      device: 'wasm',
      progress_callback: (o: any) => {
        if (o?.status === 'progress' && typeof o.progress === 'number') {
          gonder({ tip: 'yukleniyor', yuzde: Math.round(o.progress) });
        }
      },
    } as any);
    boru = p as unknown as Pipeline;
    return boru;
  })();

  return yukleniyor;
}

async function kuyruguIsle(): Promise<void> {
  if (calisiyor) return;
  calisiyor = true;
  try {
    const model = await modeliYukle();
    gonder({ tip: 'hazir' });

    while (kuyruk.length) {
      const is = kuyruk.shift()!;
      try {
        const r: any = await (model as any)(is.pcm, { return_timestamps: 'word' });
        const kelimeler: CozumKelimesi[] = Array.isArray(r?.chunks)
          ? r.chunks
              .map((c: any) => ({
                metin: String(c.text || '').trim(),
                bas: Number(c.timestamp?.[0] ?? 0),
                son: Number(c.timestamp?.[1] ?? 0),
              }))
              .filter((k: CozumKelimesi) => k.metin)
          : [];
        gonder({ tip: 'cozum', anahtar: is.anahtar, metin: String(r?.text || '').trim(), kelimeler });
      } catch (e: any) {
        gonder({ tip: 'hata', anahtar: is.anahtar, mesaj: e?.message || 'çözümlenemedi' });
      }
    }
  } catch (e: any) {
    gonder({ tip: 'hata', mesaj: e?.message || 'Model yüklenemedi' });
  } finally {
    calisiyor = false;
  }
}

self.onmessage = (e: MessageEvent<Istek>) => {
  const m = e.data;
  if (m.tip === 'hazirla') {
    void modeliYukle().then(
      () => gonder({ tip: 'hazir' }),
      (err) => gonder({ tip: 'hata', mesaj: err?.message || 'yüklenemedi' })
    );
    return;
  }
  if (m.tip === 'iptal') {
    kuyruk.length = 0;
    return;
  }
  if (m.tip === 'coz') {
    kuyruk.push({ anahtar: m.anahtar, pcm: m.pcm });
    void kuyruguIsle();
  }
};
