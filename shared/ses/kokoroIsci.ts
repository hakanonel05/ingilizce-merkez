/// <reference lib="webworker" />

/* KOKORO — AYRI İŞ PARÇACIĞINDA
 * ============================================================================
 * NEDEN WORKER: Kokoro tarayıcıda gerçek zamanın ~1 katı hızda çalışıyor
 * (ölçüldü: 29 saniyelik paragraf 30 saniyede üretiliyor). Bunu ana iş
 * parçacığında yapmak sayfayı o süre boyunca DONDURUR — oysa kullanıcı tam o
 * sırada parçayı okuyor, kelime çalışıyor, soru çözüyor. Worker'da çalışınca
 * arayüz hiç etkilenmiyor.
 *
 * NEDEN q8 / WASM: WebGPU üç kat hızlı ama indirilen model 92 MB yerine
 * 314 MB oluyor (ikisi de ölçüldü). Arka planda üretim için hız kritik
 * değil — kullanıcı zaten okuyor — indirme boyutu ise her ziyaretçiyi
 * doğrudan etkiliyor. 92 MB seçildi.
 *
 * Model bir kez yükleniyor ve worker yaşadığı sürece bellekte kalıyor.
 */

import type { KokoroTTS as KokoroTip } from 'kokoro-js';

type Istek =
  | { tip: 'hazirla' }
  | { tip: 'uret'; anahtar: string; metin: string; ses: string; hiz?: number }
  | { tip: 'iptal' };

type Yanit =
  | { tip: 'hazir' }
  | { tip: 'yukleniyor'; yuzde: number }
  | { tip: 'ses'; anahtar: string; wav: ArrayBuffer }
  | { tip: 'hata'; anahtar?: string; mesaj: string };

const gonder = (y: Yanit, aktar?: Transferable[]) =>
  (self as unknown as DedicatedWorkerGlobalScope).postMessage(y, aktar || []);

let tts: KokoroTip | null = null;
let yukleniyor: Promise<KokoroTip> | null = null;
let iptalEdildi = false;

/** Sıraya alınan işler; teker teker işleniyor. */
const kuyruk: { anahtar: string; metin: string; ses: string; hiz: number }[] = [];
let calisiyor = false;

async function modeliYukle(): Promise<KokoroTip> {
  if (tts) return tts;
  if (yukleniyor) return yukleniyor;

  yukleniyor = (async () => {
    /* Dinamik import: kokoro-js + transformers.js büyük. Statik import
       olsaydı worker dosyası her ziyarette inerdi; oysa bu kod yalnızca
       arka plan üretimi istendiğinde gerekiyor. */
    const { KokoroTTS } = await import('kokoro-js');
    const model = await KokoroTTS.from_pretrained(
      'onnx-community/Kokoro-82M-v1.0-ONNX',
      {
        dtype: 'q8',
        device: 'wasm',
        progress_callback: (p: any) => {
          if (p?.status === 'progress' && typeof p.progress === 'number') {
            gonder({ tip: 'yukleniyor', yuzde: Math.round(p.progress) });
          }
        },
      } as any
    );
    tts = model as unknown as KokoroTip;
    return tts;
  })();

  return yukleniyor;
}

async function kuyruguIsle(): Promise<void> {
  if (calisiyor) return;
  calisiyor = true;

  try {
    const model = await modeliYukle();
    gonder({ tip: 'hazir' });

    while (kuyruk.length && !iptalEdildi) {
      const is = kuyruk.shift()!;
      try {
        const audio = await (model as any).generate(is.metin, { voice: is.ses, speed: is.hiz });
        /* WAV'ı ArrayBuffer olarak AKTARIYORUZ (kopyalamıyoruz): bir
           paragraf ~1,3 MB, her seferinde kopyalamak boşuna bellek. */
        const blob: Blob = audio.toBlob
          ? audio.toBlob()
          : new Blob([audio.toWav()], { type: 'audio/wav' });
        const buf = await blob.arrayBuffer();
        gonder({ tip: 'ses', anahtar: is.anahtar, wav: buf }, [buf]);
      } catch (e: any) {
        gonder({ tip: 'hata', anahtar: is.anahtar, mesaj: e?.message || 'üretilemedi' });
      }
    }
  } catch (e: any) {
    gonder({ tip: 'hata', mesaj: e?.message || 'Kokoro yüklenemedi' });
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
    /* Kuyruğu boşalt; süren üretim bitince döngü duruyor. */
    kuyruk.length = 0;
    return;
  }
  if (m.tip === 'uret') {
    iptalEdildi = false;
    kuyruk.push({ anahtar: m.anahtar, metin: m.metin, ses: m.ses, hiz: m.hiz ?? 1 });
    void kuyruguIsle();
  }
};
