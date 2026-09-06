/* KATMANLI CALISMA — YEDI KATMANIN UCTAN UCA SIMULASYONU
 * ============================================================================
 *
 * Calistirma:  npm run test:katmanlar
 *   Once  npm run dev:katmanli  (5174)  ve  npm run dev:api  (3000) gerek.
 *   Chrome yolu CHROME_PATH ile verilebilir.
 *
 * Bu bir ekran goruntusu turu degil: her katmanda dugmeye basiliyor ve
 * sonucun DOM a dustugu dogrulaniyor. Ucu ikame, ucu de sinirlari belli:
 *
 *  1. MIKROFON — Chrome sahte aygitla aciliyor ve asagida uretilen
 *     konusma benzeri WAV besleniyor. MediaRecorder gercekten calisiyor,
 *     IndexedDB ye gercekten yaziyor. Yalnizca sesin KAYNAGI sentetik.
 *
 *  2. SES TANIMA — webkitSpeechRecognition headless te yok; olsaydi da
 *     Google sunucusuna cikardi. W3C arayuzunu tasiyan bir ikame
 *     kuruluyor. Bu, UYGULAMANIN kodunu test eder, tarayicinin tanima
 *     motorunu ETMEZ.
 *
 *  3. YAPAY ZEKA UC NOKTALARI — depoda GEMINI_API_KEY olmayabilir ve
 *     olsa bile her kosuda para harcamak istemeyiz. Istekler CDP Fetch
 *     ile yakalanip server.ts teki SEMANIN AYNISIYLA yanitlaniyor.
 *     Istemcinin gonderdigi govde alanlari da rapora yaziliyor ki yanlis
 *     alan gonderiliyorsa gorulsun. Gemini nin kendisi test EDILMEZ.
 *
 * speechSynthesis headless te 0 sesle gelir, yani hic ses cikmaz; cagrinin
 * yapildigini saymak uygulama kodunu dogrulamaya yeter.
 *
 * OLCUM HATASI UYARISI: bu betigin ilk surumunde sekiz kontrol kaliyordu
 * ve dordu betigin kendi hatasiydi — Katman 1 ve 7 deki ikon dugmelerin
 * adi aria-label da degil title da; Katman 4 un testi derse gomulu geldigi
 * icin sahte yanit hic devreye girmiyor; Katman 5 te Kisa Bak metnin
 * uzunlugunu degil ortunun varligini degistiriyor. Bir kontrol kalirsa
 * once betigi supheli gor.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

/* Chrome yolu: CHROME_PATH ortam degiskeni, yoksa alisildik yerler. */
const CHROME = process.env.CHROME_PATH || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((p) => fs.existsSync(p));
if (!CHROME) { console.error('Chrome bulunamadi. CHROME_PATH ver.'); process.exit(1); }

const OUT = process.argv[2] || path.join(os.tmpdir(), 'katman-simulasyonu');
const PORT = Number(process.argv[3] || 9411);

/* HER KOSU TEMIZ PROFILLE BASLAR.
   Bu unutuldugunda betik yanlis alarm verdi: onceki kosunun kaydi ve
   cozulmus testi tarayici profilinde (localStorage + IndexedDB) kaliyor,
   ikinci kosuda "Kaydi Baslat" dugmesi "Yeniden Kaydet" oluyor ve test
   zaten gonderilmis geliyor. Dort kontrol duserek uygulamada hata varmis
   izlenimi veriyordu. */
fs.rmSync(path.join(OUT, '_p'), { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

/* Sahte mikrofon sesi burada uretiliyor: depoda ikili dosya tutmamak
   ve "kayit gercekten veri yazdi mi" sorusunu sessiz bir dosyayla
   karistirmamak icin konusma benzeri bir sinyal. */
const WAV = path.join(OUT, 'konusma.wav');
sesUret(WAV);
function sesUret(yol) {
  const HIZ = 48000, SANIYE = 12, N = HIZ * SANIYE;
  const veri = Buffer.alloc(N * 2);
  for (let i = 0; i < N; i++) {
    const t = i / HIZ;
    const hece = Math.max(0, Math.sin(2 * Math.PI * 4 * t));
    const zarf = hece * hece * (t % 4 < 3.2 ? 1 : 0);
    const f0 = 110 + 18 * Math.sin(2 * Math.PI * 0.7 * t);
    const v = Math.max(-1, Math.min(1, (0.55 * Math.sin(2 * Math.PI * f0 * t)
      + 0.28 * Math.sin(2 * Math.PI * f0 * 3.2 * t)
      + 0.14 * Math.sin(2 * Math.PI * f0 * 6.1 * t)) * zarf * 0.8));
    veri.writeInt16LE(Math.round(v * 32767), i * 2);
  }
  const b = Buffer.alloc(44);
  b.write('RIFF', 0); b.writeUInt32LE(36 + veri.length, 4); b.write('WAVE', 8);
  b.write('fmt ', 12); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
  b.writeUInt32LE(HIZ, 24); b.writeUInt32LE(HIZ * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34);
  b.write('data', 36); b.writeUInt32LE(veri.length, 40);
  fs.writeFileSync(yol, Buffer.concat([b, veri]));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars',
  '--autoplay-policy=no-user-gesture-required', '--use-fake-ui-for-media-stream',
  '--use-fake-device-for-media-stream', '--use-file-for-fake-audio-capture=' + WAV,
  '--remote-debugging-port=' + PORT, '--user-data-dir=' + path.join(OUT, '_p'),
  '--window-size=1600,1100', 'about:blank'], { stdio: 'ignore' });

let ws, id = 1;
const pend = new Map();
const konsol = [];
const apiCagri = [];
const send = (m, p = {}) => { const i = id++; ws.send(JSON.stringify({ id: i, method: m, params: p }));
  return new Promise((res, rej) => { pend.set(i, { res, rej }); setTimeout(() => rej(new Error('t/o ' + m)), 45000); }); };
async function conn() { for (let i = 0; i < 40; i++) { try { const r = await fetch('http://127.0.0.1:' + PORT + '/json/list');
  const p = (await r.json()).find((t) => t.type === 'page'); if (p) return p.webSocketDebuggerUrl; } catch {} await sleep(250); } throw new Error('CDP yok'); }
const ev = async (e) => { const r = await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text); return r.result?.value; };
const shot = async (n) => { const { data } = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(OUT, n + '.png'), Buffer.from(data, 'base64')); };

const b64 = (o) => Buffer.from(JSON.stringify(o), 'utf8').toString('base64');
const QUIZ = [
  { id: 1, type: 'multiple_choice', question: 'AI ile yenilenen soru: what is the fifth layer about?',
    options: ['Reading aloud', 'Listening without the picture', 'Grammar drills', 'Writing essays'],
    correctOptionIndex: 1, explanationTr: 'Besinci katmanda goruntu kapanir, yalnizca dinleme kalir.' },
  { id: 2, type: 'multiple_choice', question: 'AI ile yenilenen soru: why repeat?',
    options: ['To pass time', 'To consolidate memory', 'To sound native', 'To avoid grammar'],
    correctOptionIndex: 1, explanationTr: 'Tekrar bilgiyi kalicilastirir.' },
];
const YANITLAR = {
  'generate-quiz': () => ({ quizQuestions: QUIZ, questions: QUIZ }),
  'analyze-phonetics-grammar': () => ({
    vocabulary: [{ word: 'consolidate', type: 'verb', ipa: '/kənˈsɒlɪdeɪt/', meaningTr: 'pekistirmek',
      pronunciationNote: 'Vurgu ikinci hecede.', exampleSentence: 'Repetition consolidates memory.' }],
    grammarRules: [{ topic: 'Present Perfect', explanationTr: 'Gecmiste baslayip etkisi suren durumlar.',
      examples: [{ en: 'I have studied for an hour.', tr: 'Bir saattir calisiyorum.' }] }],
  }),
  'evaluate-writing': () => ({
    grammarCorrections: [{ original: 'I am agree with this.', corrected: 'I agree with this.',
      explanationTr: '"Agree" fiildir, yaninda "am" istemez.' }],
    naturalPhrasing: [{ original: 'It is very good for learn.', nativeSuggestion: 'It is really useful for learning.',
      whyBetterTr: 'Edattan sonra fiil -ing alir.' }],
    generalFeedback: 'Fikirler net, cumleler kisa ve anlasilir.',
  }),
  'speaking-chat': (g) => {
    const adim = g && g.currentStep ? Number(g.currentStep) : 1;
    if (!g || !g.userResponse) return { nextQuestion: 'What part of this method would help you most?',
      nextQuestionTr: 'Bu yontemin hangi kismi sana en cok yarar saglar?', step: 1, isCompleted: false };
    if (adim >= 3) return { feedback: 'Cok iyi, akiciligin korunmus.', step: 'completed', isCompleted: true };
    return { feedback: 'Guzel bir yanit, dusunceni acikca kurmussun.',
      nextQuestion: 'How would you fit this into a normal week?',
      nextQuestionTr: 'Bunu normal bir haftaya nasil yerlestirirsin?', step: adim + 1, isCompleted: false };
  },
  'ask-grammar-coach': () => ({ answer: 'Present perfect, gecmiste baslayip suren durumlar icin kullanilir.' }),
  'settings/status': () => ({ server: { gemini: false, groq: false, transcript: false, libre: false } }),
};

const ONYUKLEME = `
(() => {
  class SahteTanima {
    constructor(){ this.lang='en-US'; }
    start() { window.__tanimaBasladi=(window.__tanimaBasladi||0)+1;
      setTimeout(()=>{this.onstart&&this.onstart();},30);
      setTimeout(()=>{ this.onresult&&this.onresult({results:[[{transcript:'I think this layered method helps me remember much better.',confidence:0.94}]]});
        this.onend&&this.onend(); },400); }
    stop(){ this.onend&&this.onend(); } abort(){ this.onend&&this.onend(); }
  }
  window.SpeechRecognition = SahteTanima; window.webkitSpeechRecognition = SahteTanima;
  window.__konusmaSayaci = 0; window.__konusulanlar = [];
  window.speechSynthesis.speak = function (u) { window.__konusmaSayaci++;
    window.__konusulanlar.push(String(u&&u.text||'').slice(0,60));
    setTimeout(()=>{u&&u.onstart&&u.onstart();},10); setTimeout(()=>{u&&u.onend&&u.onend();},200); };
  window.__sesSayisi = (window.speechSynthesis.getVoices()||[]).length;
})();`;

/* Adi aria-label'da OLMAYAN dugmeler var (title kullanilmis), o yuzden
   arama uc alanda birden yapiliyor. */
const AD = "(e)=>((e.getAttribute('aria-label')||'')+' '+(e.title||'')+' '+(e.textContent||''))";
const TIK = (metin) => "(()=>{const ad=" + AD + ";"
  + "const x=[...document.querySelectorAll('main button,main [role=button]')]"
  + ".filter(e=>e.offsetParent!==null).find(e=>ad(e).includes(" + JSON.stringify(metin) + "));"
  + "if(x){x.click(); return true;} return false;})()";
const KENAR = (ad) => "(()=>{const x=[...document.querySelectorAll('aside button')]"
  + ".find(y=>(y.textContent||'').includes(" + JSON.stringify(ad) + "));"
  + "if(x){x.click(); return true;} return false;})()";
const ICER = (s) => "document.querySelector('main').innerText.includes(" + JSON.stringify(s) + ")";

const sonuc = [];
const kayit = (katman, kontrol, gecti, not) => {
  sonuc.push({ katman, kontrol, gecti, not: not || '' });
  console.log('   ' + (gecti ? '[gecti]' : '[KALDI]') + ' ' + kontrol + (not ? '  -- ' + not : ''));
};

try {
  ws = new WebSocket(await conn());
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error')
      konsol.push((m.params.args || []).map((a) => a.value || a.description || '').join(' ').slice(0, 130));
    if (m.method === 'Page.javascriptDialogOpening') {
      konsol.push('DIYALOG: ' + m.params.type + ' ' + String(m.params.message).slice(0,80));
      send('Page.handleJavaScriptDialog', { accept: true }).catch(()=>{});
      return; }
    if (m.method === 'Fetch.requestPaused') {
      const { requestId, request } = m.params;
      const yol = request.url.split('/api/')[1]?.split('?')[0] || '';
      let govde = null;
      try { govde = request.postData ? JSON.parse(request.postData) : null; } catch {}
      const yapici = YANITLAR[yol];
      apiCagri.push({ yol, alanlar: govde ? Object.keys(govde) : [], sahte: !!yapici });
      if (yapici) send('Fetch.fulfillRequest', { requestId, responseCode: 200,
        responseHeaders: [{ name: 'Content-Type', value: 'application/json' }], body: b64(yapici(govde)) }).catch(() => {});
      else send('Fetch.continueRequest', { requestId }).catch(() => {});
      return;
    }
    if (m.id && pend.has(m.id)) { const { res, rej } = pend.get(m.id); pend.delete(m.id);
      m.error ? rej(new Error(m.error.message)) : res(m.result); }
  };
  await new Promise((r) => { ws.onopen = r; });
  await send('Page.enable'); await send('Runtime.enable');
  await send('Fetch.enable', { patterns: [{ urlPattern: '*/api/*' }] });
  await send('Page.addScriptToEvaluateOnNewDocument', { source: ONYUKLEME });
  await send('Emulation.setDeviceMetricsOverride', { width: 1600, height: 1100, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'http://localhost:5174/katmanli/' });
  await sleep(7000);
  console.log('ORTAM  speechSynthesis sesi: ' + await ev('window.__sesSayisi') + '  (headless Chrome, beklenen 0)');

  /* ======================================================= KATMAN 1 */
  console.log('\n########## KATMAN 1 — Metin Okuma & Anlama');
  await ev(KENAR('Katman 1')); await sleep(2500);
  kayit(1, 'YouTube gomulusu var', await ev("!!document.querySelector('main iframe')"));
  const u1 = await ev("document.querySelector('main').innerText.length");
  await ev(TIK('Türkçeyi gizle')); await sleep(900);
  const u2 = await ev("document.querySelector('main').innerText.length");
  kayit(1, 'Turkce satirlari gizlenebiliyor', u2 < u1, u1 + ' -> ' + u2);
  await ev(TIK('Türkçeyi göster')); await sleep(700);
  kayit(1, 'geri gosterilebiliyor', (await ev("document.querySelector('main').innerText.length")) > u2);
  await ev('window.__konusmaSayaci=0');
  await ev(TIK('Sesli okunuşu dinle')); await sleep(900);
  const k1s = await ev('window.__konusmaSayaci');
  kayit(1, 'cumle seslendirme calisiyor', k1s > 0, 'okunan: ' + JSON.stringify((await ev('window.__konusulanlar'))[0] || ''));
  await ev(TIK('Tek Sütun')); await sleep(1000);
  kayit(1, 'gorunum degistirilebiliyor (Tek Sutun)', await ev("document.querySelector('main').innerText.length > 300"));
  await ev(TIK('TED Stili')); await sleep(800);
  await shot('k1');

  /* ======================================================= KATMAN 2 */
  console.log('\n########## KATMAN 2 — Aktif Dinleme');
  await ev(KENAR('Katman 2')); await sleep(2200);
  kayit(2, 'YouTube gomulusu var', await ev("!!document.querySelector('main iframe')"));
  kayit(2, 'ingilizce metin cizildi', (await ev("document.querySelector('main').innerText.length")) > 400);
  kayit(2, 'Turkce ceviri gizli', !(await ev(ICER('Bu videoda size çok önemli'))), 'katmanin amaci bu');
  await shot('k2');

  /* ======================================================= KATMAN 3 */
  console.log('\n########## KATMAN 3 — Sesli Okuma & Shadowing');
  await ev(KENAR('Katman 3')); await sleep(2200);
  await ev('window.__konusmaSayaci=0');
  await ev(TIK('Yavaş Okut')); await sleep(1200);
  kayit(3, 'Yavas Okut seslendiriyor', (await ev('window.__konusmaSayaci')) > 0);
  kayit(3, 'kayit baslatildi', await ev(TIK('Kaydı Başlat')));
  await sleep(4500);
  const durduruldu = await ev(TIK('Durdur'));
  await sleep(2500);
  kayit(3, 'kayit durduruldu', durduruldu);
  kayit(3, 'calinabilir kayit olustu', (await ev("document.querySelectorAll('main audio').length")) > 0);
  const idb = await ev(`(async () => { try {
    const db = await new Promise((r,j)=>{const q=indexedDB.open('layered_learning_recordings');q.onsuccess=()=>r(q.result);q.onerror=()=>j(q.error);});
    const n = await new Promise((r)=>{const t=db.transaction('recordings','readonly').objectStore('recordings').count();t.onsuccess=()=>r(t.result);t.onerror=()=>r(-1);});
    const ilk = await new Promise((r)=>{const t=db.transaction('recordings','readonly').objectStore('recordings').getAll();t.onsuccess=()=>r(t.result[0]||null);t.onerror=()=>r(null);});
    db.close();
    return { adet: n, boyut: ilk && ilk.blob ? ilk.blob.size : 0, cumle: ilk ? String(ilk.sentenceText||'').slice(0,40) : '' };
  } catch (e) { return { hata: String(e) }; } })()`);
  kayit(3, 'kayit IndexedDB\'ye yazildi', idb.adet > 0, JSON.stringify(idb));
  kayit(3, 'kaydin icinde gercekten ses verisi var', idb.boyut > 2000, idb.boyut + ' bayt');
  await shot('k3');

  /* ======================================================= KATMAN 4 */
  console.log('\n########## KATMAN 4 — Altyazisiz Izleme + Anlama Testi');
  await ev(KENAR('Katman 4')); await sleep(2200);
  kayit(4, 'YouTube gomulusu var', await ev("!!document.querySelector('main iframe')"));
  kayit(4, 'bu katmanda metin bilerek gizli', await ev(ICER('Metin gösterilmiyor')));
  await ev(TIK('teste geç')); await sleep(2500);
  const soruSayisi = await ev(`(document.querySelector('main').innerText.match(/Soru \\d+/g)||[]).length`);
  kayit(4, 'derse gomulu test cizildi', soruSayisi >= 3, soruSayisi + ' soru');
  const secildi = await ev(`(() => { const m=document.querySelector('main');
    const secenek=[...m.querySelectorAll('button')].filter(b=>/^[A-D]\\)/.test((b.textContent||'').trim()));
    const gruplar={}; secenek.forEach(b=>{const h=b.closest('div[class*=space-y],section,li,form')||b.parentElement; const k=[...m.querySelectorAll('*')].indexOf(h); (gruplar[k]||=[]).push(b);});
    let n=0; Object.values(gruplar).forEach(g=>{ if(g[0]){g[0].click(); n++;} });
    return n; })()`);
  await sleep(1200);
  kayit(4, 'siklar tiklanabiliyor', secildi > 0, secildi + ' soruda sik secildi');
  await ev(TIK('Yanıtları Kontrol Et')); await sleep(2000);
  const s4 = await ev(`(() => { const t=document.querySelector('main').innerText;
    return { sonuc: /Test Sonucu/.test(t), aciklama: /Doğru Kavrayış|Açıklama|doğru cevap/i.test(t) }; })()`);
  kayit(4, 'test degerlendirildi ve puan cikti', s4.sonuc, JSON.stringify(s4));
  await shot('k4');
  console.log('   --- AI ile soru yenileme yolu ---');
  await ev(TIK('Soruları Yenile')); await sleep(3000);
  kayit(4, 'AI ile yeni test uretme yolu calisiyor', await ev(ICER('AI ile yenilenen soru')));
  await shot('k4-ai');

  /* ======================================================= KATMAN 5 */
  console.log('\n########## KATMAN 5 — Sadece Dinleme');
  await ev(KENAR('Katman 5')); await sleep(2200);
  kayit(5, 'YouTube gomulusu var', await ev("!!document.querySelector('main iframe')"));
  const ortuVar = await ev(ICER('Görüntü Kapalı'));
  kayit(5, 'goruntu varsayilan olarak ortulu', ortuVar);
  await ev(TIK('Kısa Bak')); await sleep(1200);
  const ortuKalkti = !(await ev(ICER('Görüntü Kapalı')));
  kayit(5, '"Kisa Bak" ortuyu kaldiriyor', ortuKalkti);
  await ev(TIK('Görüntüyü Kapat')); await sleep(1000);
  kayit(5, 'ortu geri geliyor', await ev(ICER('Görüntü Kapalı')));
  await shot('k5');

  /* ======================================================= KATMAN 6 */
  console.log('\n########## KATMAN 6 — Yazma & Cumle Kurma');
  await ev(KENAR('Katman 6')); await sleep(2200);
  const yazdi = await ev(`(() => { const a=[...document.querySelectorAll('main textarea')]; if(!a.length) return 0;
    const m=['In this video the speaker explain that layered learning is useful. I am agree with this.',
             'In my opinion this method is very good for learn English every day.'];
    const s=Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype,'value').set;
    a.forEach((x,i)=>{ s.call(x,m[i%m.length]); x.dispatchEvent(new Event('input',{bubbles:true})); });
    return a.length; })()`);
  kayit(6, 'yazma alanlari dolduruldu', yazdi > 0, yazdi + ' alan');
  await ev(TIK('Değerlendir')); await sleep(3000);
  kayit(6, 'gramer duzeltmesi cizildi', await ev(ICER('I agree with this')));
  kayit(6, 'dogal kullanim onerisi cizildi', await ev(ICER('really useful for learning')));
  kayit(6, 'genel geri bildirim cizildi', await ev(ICER('Fikirler net')));
  await shot('k6');

  /* ======================================================= KATMAN 7 */
  console.log('\n########## KATMAN 7 — Sesli Anlatim');
  const k7Once = await ev('window.__konusmaSayaci');
  await ev(KENAR('Katman 7')); await sleep(3500);
  kayit(7, 'kocun ilk sorusu geldi', await ev(ICER('What part of this method')));
  const mik = await ev(TIK('Mikrofonu açıp'));
  await sleep(1600);
  const yazilan = await ev(`(()=>{const i=document.querySelector('main input'); return i?i.value:'';})()`);
  kayit(7, 'mikrofon dugmesi bulundu ve calisti', mik, 'ikame ses tanima');
  kayit(7, 'taninan metin alana dustu', yazilan.length > 10, JSON.stringify(yazilan.slice(0, 46)));
  kayit(7, 'soru sesli okundu', (await ev('window.__konusmaSayaci')) > 0,
    'not: headless Chrome\'da ses cikisi yok, cagri sayiliyor');
  await ev(TIK('Gönder')); await sleep(3000);
  kayit(7, 'yanit degerlendirildi', await ev(ICER('Guzel bir yanit')));
  kayit(7, 'ikinci soruya gecildi', await ev(ICER('How would you fit this')));
  await shot('k7');

  /* ================================================ EK: FONETIK */
  console.log('\n########## EK — Fonetik & Gramer');
  await ev(KENAR('Fonetik')); await sleep(2000);
  await ev(TIK('AI Analizini Yenile')); await sleep(3000);
  kayit(8, 'AI analizi kelimeleri yeniledi', await ev(ICER('consolidate')));
  kayit(8, 'IPA okunusu cizildi', await ev(ICER('kənˈsɒlɪdeɪt')));
  await ev('window.__konusmaSayaci=0');
  await ev(TIK('Sesli Telaffuz Dinle')); await sleep(900);
  kayit(8, 'kelime telaffuzu seslendiriliyor', (await ev('window.__konusmaSayaci')) > 0);
  await ev(TIK('Gramer Yapıları')); await sleep(1200);
  kayit(8, 'gramer sekmesi kurallari cizdi', await ev(ICER('Present Perfect')));
  await shot('k8');

  /* ============================ ILERLEME: katman tamamlama */
  console.log('\n########## AKIS — katman tamamlama ilerlemeyi isliyor mu');
  await ev(KENAR('Katman 1')); await sleep(2000);
  const oncekiTik = await ev(`document.querySelectorAll('aside svg.lucide-check, aside [data-done=true]').length`);
  await ev(TIK('Aktif Dinleme')); await sleep(2500);
  const aktifBaslik = await ev("document.querySelector('main').innerText.slice(0,200)");
  kayit(9, 'tamamla dugmesi sonraki katmana geciriyor', /Aktif Dinleme/.test(aktifBaslik));
  const kalici = await ev(`(() => { try { const h=Object.keys(localStorage).filter(k=>/progress|ilerleme|layered/i.test(k));
    return h.map(k=>k+'='+String(localStorage.getItem(k)).slice(0,90)).join(' ~ ').slice(0,300); } catch(e){ return 'HATA'; } })()`);
  kayit(9, 'ilerleme localStorage\'a yazildi', /completedLayers|\d/.test(kalici), kalici.slice(0, 150));

  /* ======================================================= OZET */
  console.log('\n\n============================== OZET');
  const gruplar = {};
  for (const s of sonuc) (gruplar[s.katman] ||= []).push(s);
  let toplam = 0, gecen = 0;
  for (const k of Object.keys(gruplar)) {
    const g = gruplar[k].filter((x) => x.gecti).length;
    toplam += gruplar[k].length; gecen += g;
    const ad = k === '8' ? 'Fonetik' : k === '9' ? 'Ilerleme' : 'Katman ' + k;
    console.log('  ' + ad.padEnd(10) + ': ' + g + '/' + gruplar[k].length
      + (g < gruplar[k].length ? '   KALAN: ' + gruplar[k].filter((x) => !x.gecti).map((x) => x.kontrol).join(', ') : ''));
  }
  console.log('  TOPLAM: ' + gecen + '/' + toplam);
  console.log('\n============================== API CAGRILARI');
  for (const c of apiCagri) console.log('  ' + (c.sahte ? 'sahte ' : 'GECTI ') + c.yol.padEnd(28) + 'govde: [' + c.alanlar.join(', ') + ']');
  console.log('\n============================== KONSOL HATALARI');
  const g = [...new Set(konsol)].filter((h) => !/WebSocket|HMR|favicon|BLOCKED/i.test(h));
  console.log(g.length ? g.slice(0, 12).map((x) => '  ' + x).join('\n') : '  yok');
} catch (e) { console.error('\nHARNESS HATASI:', e.message, '\n', e.stack); process.exitCode = 1; }
finally { try { ws?.close(); } catch {} chrome.kill(); }
