/* DERSİN KELİMELERİ DESTEYE ALINIYOR MU
 *
 * Ders silinince kart destesi zaten etkilenmiyordu; asıl kayıp dersin
 * İÇİNDEKİ kelime listesiydi (Katman 2'deki IPA'lı liste). Artık silmeden
 * önce desteye taşınıyor. Burada o dönüşümün kuralları sınanıyor —
 * IndexedDB'ye dokunmadan, saf.
 *
 * Çalıştır:  npm run test:ders-kelimeleri
 */

import { dersKelimelerindenKartlar } from '../apps/katmanli/src/lib/dersKelimeleri.ts';

let gecti = 0;
let kaldi = 0;

function denetle(baslik, kosul, ayrinti = '') {
  if (kosul) {
    gecti++;
    console.log(`    [gecti] ${baslik}${ayrinti ? ' — ' + ayrinti : ''}`);
  } else {
    kaldi++;
    console.log(`    [KALDI] ${baslik}${ayrinti ? ' — ' + ayrinti : ''}`);
  }
}

const ders = (vocabulary) => ({ id: 'ders-1', title: 'Tim Urban — Erteleme', vocabulary });
const onYuzler = (kartlar) => kartlar.map((k) => k.front).sort();

console.log('\n  olağan dönüşüm');
{
  const kartlar = dersKelimelerindenKartlar(
    ders([
      { word: 'procrastinate', type: 'verb', ipa: '/prəˈkræstɪneɪt/', meaningTr: 'ertelemek', exampleSentence: 'I procrastinate a lot.' },
      { word: 'deadline', type: 'noun', meaningTr: 'son teslim tarihi' },
    ]),
    new Set()
  );
  denetle('iki kelime de karta dönüştü', kartlar.length === 2, onYuzler(kartlar).join(', '));
  const p = kartlar.find((k) => k.front === 'procrastinate');
  denetle('Türkçe karşılık kartın arkasına geçti', p.back === 'ertelemek');
  denetle('IPA korundu', p.ipa === '/prəˈkræstɪneɪt/');
  denetle('örnek cümle korundu', p.exampleEn === 'I procrastinate a lot.');
  denetle('söz türü tanındı', p.pos === 'verb', String(p.pos));
  denetle('dersin kimliği kaynağa yazıldı', p.sources?.[0]?.lessonId === 'ders-1');
  denetle('ders adı kaynağa yazıldı', p.sources?.[0]?.lessonTitle === 'Tim Urban — Erteleme');
  denetle('kart yeni, tekrar geçmişi sıfır', p.reps === 0);
}

console.log('\n  ELEMELER');
{
  const kartlar = dersKelimelerindenKartlar(
    ders([
      { word: 'deadline', meaningTr: 'son teslim tarihi' },
      { word: 'procrastinate', meaningTr: 'ertelemek' },
    ]),
    new Set(['deadline'])
  );
  denetle('"biliyorum" denen kelime desteye girmiyor',
    onYuzler(kartlar).join(',') === 'procrastinate', onYuzler(kartlar).join(','));
}
{
  /* Model kimi satırda karşılığı boş bırakabiliyor; çalışılamayan kart
     üretmek desteyi kirletir. */
  const kartlar = dersKelimelerindenKartlar(
    ders([
      { word: 'deadline', meaningTr: '' },
      { word: '', meaningTr: 'bir şey' },
      { word: '   ', meaningTr: '   ' },
      { word: 'focus', meaningTr: 'odaklanmak' },
    ]),
    new Set()
  );
  denetle('karşılığı ya da kendisi boş olan satırlar atlanıyor',
    onYuzler(kartlar).join(',') === 'focus', onYuzler(kartlar).join(','));
}
{
  const kartlar = dersKelimelerindenKartlar(
    ders([
      { word: 'Focus', meaningTr: 'odaklanmak' },
      { word: 'focus', meaningTr: 'odak' },
    ]),
    new Set()
  );
  denetle('aynı kelime iki kez yazılmışsa tek kart üretiliyor', kartlar.length === 1, `${kartlar.length} kart`);
}
{
  denetle('kelime listesi yoksa boş dönüyor', dersKelimelerindenKartlar(ders(undefined), new Set()).length === 0);
  denetle('liste boşsa boş dönüyor', dersKelimelerindenKartlar(ders([]), new Set()).length === 0);
}

console.log('\n  BÜYÜK/KÜÇÜK HARF — "biliyorum" listesi küçük harfle tutuluyor');
{
  const kartlar = dersKelimelerindenKartlar(
    ders([{ word: 'Deadline', meaningTr: 'son teslim tarihi' }]),
    new Set(['deadline'])
  );
  denetle('büyük harfle yazılmış kelime de bilinen sayılıyor', kartlar.length === 0, `${kartlar.length} kart`);
}

console.log(`\n  SONUÇ: ${gecti} geçti, ${kaldi} kaldı\n`);
process.exit(kaldi === 0 ? 0 : 1);
