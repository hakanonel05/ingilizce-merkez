/* KAYIT ANALİZİ SINAMASI
 * ============================================================================
 * Gölgeleme katmanındaki "kaydımı çözümle" özelliğinin doğru çalıştığını
 * kanıtlar. Uydurma veriyle değil, GERÇEK Whisper çıktısıyla: test sesleri
 * Kokoro ile üretiliyor, Whisper'a veriliyor, çıkan sonuç hizalama ve
 * puanlama mantığından geçiriliyor.
 *
 * Neden bu sınama var: analizin kendisi kullanıcıya "şu kelimeyi yanlış
 * söyledin" diyor. Yanlış bir hizalama, doğru okumuş birine hata
 * gösterir — bu özelliğin yapabileceği en zararlı şey. Dört senaryo
 * denetleniyor:
 *
 *   1. DOĞRU okuma   -> hiçbir kelime yanlış işaretlenmemeli (asıl risk bu)
 *   2. YANLIŞ kelime -> üç bozuk kelimenin üçü de yakalanmalı
 *   3. EKSİK kelime  -> atlanan kelimeler 'eksik', geri kalan hizada kalmalı
 *   4. TAKILMA       -> akıcılık düşmeli ama kelime doğruluğu etkilenmemeli
 *
 * Son senaryo iki gerçek hatayı yakaladı ve tasarımı değiştirdi:
 *   · Duraksama önce Whisper'ın zaman damgalarından ölçülüyordu. Cümle
 *     ortasına 1,2 sn sessizlik eklenen kayıtta Whisper takılmaların hiçbirini
 *     göstermedi. Ölçüm sesin dalga biçimine taşındı.
 *   · Duraksamanın "beklenen" sayılıp sayılmadığına Whisper'ın noktalamasına
 *     bakılarak karar veriliyordu; Whisper takılmanın olduğu yere de virgül
 *     koyunca hepsi mazur görüldü. Ölçüt uzunluğa çevrildi.
 *
 * Çalıştırma:  npm run test:kayit-analizi
 * (İlk çalıştırmada Kokoro ve Whisper modelleri iniyor, ~190 MB.)
 */
import { pipeline } from '@huggingface/transformers';
import { KokoroTTS } from 'kokoro-js';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { pathToFileURL } from 'url';

const GECICI = fs.mkdtempSync(path.join(os.tmpdir(), 'kayit-analizi-'));

/* Analiz mantığını kaynaktan al. Saf bir işlev olduğu için tarayıcı API'si
   gerekmiyor; tsx altında doğrudan içe aktarılabiliyor. */
const { analizTuret, sesiOlc } = await import(
  pathToFileURL(path.resolve('shared/ses/konusmaCozumleme.ts')).href
);

const HEDEF =
  "There's a man by the name of Captain William Swenson who recently was awarded " +
  'the congressional Medal of Honor for his actions on September 8, 2009.';

const SENARYOLAR = [
  { ad: 'dogru okuma', metin: HEDEF },
  {
    ad: 'uc kelime yanlis',
    metin:
      "There's a man by the name of Captain William Swenson who recently was rewarded " +
      'the congress Medal of Honor for his actions on December 8, 2009.',
    beklenenSorunlu: ['awarded', 'congressional', 'September'],
  },
  {
    ad: 'kelimeler atlanmis',
    metin:
      "There's a man by the name of Captain William Swenson who was awarded " +
      'the Medal of Honor for his actions on September 8, 2009.',
    beklenenEksik: ['recently', 'congressional'],
  },
];

function wavdanFloat32(dosya, hedefOran = 16000) {
  const b = fs.readFileSync(dosya);
  const oran = b.readUInt32LE(24);
  const bitler = b.readUInt16LE(34);
  let i = 12;
  let veri = null;
  while (i < b.length - 8) {
    const ad = b.toString('ascii', i, i + 4);
    const boy = b.readUInt32LE(i + 4);
    if (ad === 'data') {
      veri = b.subarray(i + 8, i + 8 + boy);
      break;
    }
    i += 8 + boy + (boy % 2);
  }
  const n = bitler === 32 ? veri.length / 4 : veri.length / 2;
  const ham = new Float32Array(n);
  for (let k = 0; k < n; k++)
    ham[k] = bitler === 32 ? veri.readFloatLE(k * 4) : veri.readInt16LE(k * 2) / 32768;
  if (oran === hedefOran) return ham;
  const adim = oran / hedefOran;
  const m = Math.floor(n / adim);
  const cikti = new Float32Array(m);
  for (let k = 0; k < m; k++) cikti[k] = ham[Math.floor(k * adim)];
  return cikti;
}

const sadeles = (k) => k.toLowerCase().replace(/[^a-z0-9']/g, '');

console.log('');
console.log('  Kayit analizi sinamasi');
console.log('  ' + '='.repeat(60));

const tts = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', {
  dtype: 'q8',
  device: 'cpu',
});
const asr = await pipeline('automatic-speech-recognition', 'Xenova/whisper-base.en', {
  dtype: 'q8',
});

/* 24 kHz Kokoro çıktısını 16 kHz'e indir. */
function indir(f32, kaynakOran = 24000, hedefOran = 16000) {
  const adim = kaynakOran / hedefOran;
  const n = Math.floor(f32.length / adim);
  const c = new Float32Array(n);
  for (let i = 0; i < n; i++) c[i] = f32[Math.floor(i * adim)];
  return c;
}

/**
 * Takılarak okuyan birini taklit et.
 *
 * Kokoro "..." yazınca duraklamıyor, o yüzden parçalar ayrı ayrı üretilip
 * aralarına SESSİZLİK ekleniyor. Bölme yerleri bilerek doğal olmayan
 * noktalarda ("the" ve "of" sonrası): cümle sınırında durmak kusur değil,
 * cümlenin ortasında takılmak kusur. Ayrım tam da bu.
 */
async function takilarakOku(parcalar, sessizlikSn = 1.2) {
  const bolumler = [];
  for (const p of parcalar) {
    const a = await tts.generate(p, { voice: 'af_heart', speed: 0.9 });
    bolumler.push(indir(a.audio));
  }
  const sessizlik = new Float32Array(Math.round(16000 * sessizlikSn));
  const toplam =
    bolumler.reduce((t, b) => t + b.length, 0) + sessizlik.length * (bolumler.length - 1);
  const cikti = new Float32Array(toplam);
  let o = 0;
  bolumler.forEach((b, i) => {
    cikti.set(b, o);
    o += b.length;
    if (i < bolumler.length - 1) {
      cikti.set(sessizlik, o);
      o += sessizlik.length;
    }
  });
  return cikti;
}

let basarisiz = 0;
const denetle = (ad, kosul, ayrinti) => {
  console.log('    ' + (kosul ? '[gecti]' : '[KALDI]') + ' ' + ad + (ayrinti ? ' — ' + ayrinti : ''));
  if (!kosul) basarisiz++;
};

for (const s of SENARYOLAR) {
  console.log('');
  console.log('  ' + s.ad);

  const ses = await tts.generate(s.metin, { voice: 'af_heart', speed: 0.9 });
  const dosya = path.join(GECICI, s.ad.replace(/\s+/g, '-') + '.wav');
  await ses.save(dosya);

  const pcm = wavdanFloat32(dosya);
  const r = await asr(pcm, { return_timestamps: 'word' });
  const cozum = {
    metin: String(r.text || '').trim(),
    kelimeler: (r.chunks || [])
      .map((c) => ({
        metin: String(c.text || '').trim(),
        bas: Number(c.timestamp?.[0] ?? 0),
        son: Number(c.timestamp?.[1] ?? 0),
      }))
      .filter((k) => k.metin),
  };

  const a = analizTuret(HEDEF, cozum, sesiOlc(pcm));
  const sorunlu = a.kelimeler.filter((k) => k.durum === 'farkli' || k.durum === 'kaymis');
  const eksik = a.kelimeler.filter((k) => k.durum === 'eksik');

  console.log(
    '    dogruluk ' + a.dogrulukPuani + ' · akicilik ' + a.akicilikPuani +
      ' · dakikada ' + a.akicilik.kelimeHizi + ' kelime'
  );

  if (s.ad === 'dogru okuma') {
    /* EN ÖNEMLİ DENETİM: doğru okuyan birine hata gösterilmemeli. */
    denetle(
      'dogru okumada hata isaretlenmedi',
      sorunlu.length === 0 && eksik.length === 0,
      sorunlu.length || eksik.length
        ? 'yanlis isaretlenenler: ' +
          [...sorunlu, ...eksik].map((k) => k.hedef + '->' + (k.duyulan ?? '-')).join(', ')
        : ''
    );
    denetle('dogruluk puani 100', a.dogrulukPuani === 100, 'puan: ' + a.dogrulukPuani);
    denetle('fazladan kelime yok', a.fazladan.length === 0, a.fazladan.join(', '));
    /* Bu denetim bir hatayi yakalamak icin eklendi: ilk surum virgulde
       yapilan dogal duraklamayi da cezalandiriyordu ve kusursuz okuma
       akicilikta 86 aliyordu. Noktalamada durmak iyi okumanin isareti. */
    denetle(
      'kusursuz okuma akicilikta cezalanmadi',
      a.akicilikPuani >= 95,
      'akicilik: ' + a.akicilikPuani + ', takilma: ' + a.akicilik.duraklamaSayisi
    );
  }

  if (s.beklenenSorunlu) {
    const yakalanan = s.beklenenSorunlu.filter((b) =>
      sorunlu.some((k) => sadeles(k.hedef) === sadeles(b))
    );
    denetle(
      'bozuk kelimeler yakalandi',
      yakalanan.length === s.beklenenSorunlu.length,
      yakalanan.length + '/' + s.beklenenSorunlu.length + ' (' + yakalanan.join(', ') + ')'
    );
    /* Yanlış yere yayılmamalı: hizalama bozulursa tüm cümle hatalı görünür. */
    denetle(
      'hata yalnizca o kelimelerde',
      sorunlu.length + eksik.length <= s.beklenenSorunlu.length + 1,
      'toplam isaretli: ' + (sorunlu.length + eksik.length)
    );
  }

  if (s.beklenenEksik) {
    const yakalanan = s.beklenenEksik.filter((b) =>
      [...eksik, ...sorunlu].some((k) => sadeles(k.hedef) === sadeles(b))
    );
    denetle(
      'atlanan kelimeler yakalandi',
      yakalanan.length === s.beklenenEksik.length,
      yakalanan.length + '/' + s.beklenenEksik.length + ' (' + yakalanan.join(', ') + ')'
    );
    /* Atlanan kelimeden SONRAKİLER doğru hizalanmalı — basit konum
       karşılaştırması burada çuvallıyordu, hizalamanın varlık sebebi bu. */
    const sonrakiler = a.kelimeler.slice(-8);
    denetle(
      'atlamadan sonraki kelimeler hizada',
      sonrakiler.every((k) => k.durum === 'dogru'),
      'son 8 kelime: ' + sonrakiler.map((k) => k.hedef + ':' + k.durum).join(' ')
    );
  }
}

/* --- 4. senaryo: cümle ortasında takılma --- */
console.log('');
console.log('  cumle ortasinda takilma');
{
  const pcm = await takilarakOku([
    "There's a man by the name of Captain William Swenson who recently was awarded the",
    'congressional Medal of',
    'Honor for his actions on September 8, 2009.',
  ]);
  const r = await asr(pcm, { return_timestamps: 'word' });
  const a = analizTuret(HEDEF, {
    metin: String(r.text || '').trim(),
    kelimeler: (r.chunks || [])
      .map((c) => ({
        metin: String(c.text || '').trim(),
        bas: Number(c.timestamp?.[0] ?? 0),
        son: Number(c.timestamp?.[1] ?? 0),
      }))
      .filter((k) => k.metin),
  }, sesiOlc(pcm));

  console.log(
    '    dogruluk ' + a.dogrulukPuani + ' · akicilik ' + a.akicilikPuani +
      ' · takilma ' + a.akicilik.duraklamaSayisi +
      ' · en uzun ' + a.akicilik.enUzunDuraklama + ' sn'
  );
  denetle('takilmalar yakalandi', a.akicilik.duraklamaSayisi >= 2,
    a.akicilik.duraklamaSayisi + ' takilma');
  denetle('akicilik puani dustu', a.akicilikPuani <= 70, 'akicilik: ' + a.akicilikPuani);
  /* Takılmak bir TELAFFUZ hatası değil: kelimeler doğru söylendi. İki ölçünün
     birbirine karışmaması gerekiyor, yoksa kullanıcı yanlış şeyi çalışır. */
  denetle('kelime dogrulugu etkilenmedi', a.dogrulukPuani >= 95,
    'dogruluk: ' + a.dogrulukPuani);
}

fs.rmSync(GECICI, { recursive: true, force: true });

console.log('');
console.log('  ' + '='.repeat(60));
if (basarisiz) {
  console.log('  ' + basarisiz + ' denetim KALDI');
  process.exit(1);
}
console.log('  tum denetimler gecti');
