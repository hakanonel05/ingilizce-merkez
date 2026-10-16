/* DESTE İSTATİSTİKLERİ SINAMASI
 *
 * "Kaç kelime biliyorum" sorusunun cevabı yanlışsa kullanıcı ilerlemediğini
 * sanıp bırakır; fazla iyimser olursa çalışmayı bırakır. Sayma kurallarının
 * yazılı olması bu yüzden önemli.
 *
 * Çalıştır:  npm run test:deste-istatistikleri
 */

import {
  olgunlukDagilimi, zorKartlar, haftalikOzet, tutmaOrani, araligiGun,
  gunEtiketi, OLGUN_GUN,
} from '../shared/vocab/desteIstatistikleri.ts';

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

const GUN = 86400000;
const SIMDI = new Date('2026-10-16T12:00:00').getTime();

const kart = (id, ek = {}) => ({
  id, front: id, back: id + '-tr', level: 'B1', kind: 'word',
  lessonId: 'd', lessonTitle: 'D', createdAt: SIMDI - 30 * GUN,
  state: 'review', step: null, stability: 5, difficulty: 5,
  due: SIMDI + GUN, lastReview: SIMDI, reps: 3, lapses: 0, ...ek,
});

console.log('\n  ARALIK');
denetle('aralık gün cinsinden',
  araligiGun(kart('a', { lastReview: SIMDI, due: SIMDI + 10 * GUN }), SIMDI) === 10);
denetle('geçmiş tarihli kartta negatif yok',
  araligiGun(kart('b', { lastReview: SIMDI, due: SIMDI - 5 * GUN }), SIMDI) === 0);

console.log('\n  OLGUNLUK DAĞILIMI');
{
  const d = olgunlukDagilimi([
    kart('yeni', { reps: 0, state: 'learning' }),
    kart('ogr', { state: 'learning' }),
    kart('yeniden', { state: 'relearning' }),
    kart('taze', { lastReview: SIMDI, due: SIMDI + 5 * GUN }),
    kart('olgun', { lastReview: SIMDI, due: SIMDI + 40 * GUN }),
    kart('askida', { suspended: true }),
  ], SIMDI);
  denetle('yeni kart sayıldı', d.yeni === 1, String(d.yeni));
  denetle('öğrenme ve yeniden öğrenme birlikte', d.ogreniliyor === 2, String(d.ogreniliyor));
  denetle('taze (21 günden kısa)', d.taze === 1, String(d.taze));
  denetle('olgun (21 gün ve üzeri)', d.olgun === 1, String(d.olgun));
  denetle('askıdaki diğer sayımlara girmiyor', d.askida === 1 && d.taze + d.olgun === 2);
  denetle('toplam hepsini kapsıyor', d.toplam === 6);
}
{
  /* Eşik tam 21 gün: SINIR DEĞERİ. Bir yanlış karşılaştırma işareti
     21 günlük kartı "taze" gösterirdi. */
  const tam = olgunlukDagilimi(
    [kart('t', { lastReview: SIMDI, due: SIMDI + OLGUN_GUN * GUN })], SIMDI);
  denetle('tam 21 gün OLGUN sayılıyor', tam.olgun === 1 && tam.taze === 0);
  const bir_eksik = olgunlukDagilimi(
    [kart('t', { lastReview: SIMDI, due: SIMDI + (OLGUN_GUN - 1) * GUN })], SIMDI);
  denetle('20 gün taze sayılıyor', bir_eksik.taze === 1 && bir_eksik.olgun === 0);
}
denetle('boş deste', olgunlukDagilimi([], SIMDI).toplam === 0);

console.log('\n  ZOR KARTLAR');
{
  const liste = zorKartlar([
    kart('cok-unutulan', { lapses: 4, difficulty: 5 }),
    kart('az-unutulan', { lapses: 1, difficulty: 5 }),
    kart('zor-ama-unutulmamis', { lapses: 0, difficulty: 9 }),
    kart('kolay', { lapses: 0, difficulty: 2 }),
    kart('hic-calisilmamis', { reps: 0, lapses: 0, difficulty: 10 }),
    kart('askida', { lapses: 5, suspended: true }),
  ]);
  const adlar = liste.map((z) => z.kart.id);
  denetle('kolay kart listede yok', !adlar.includes('kolay'), JSON.stringify(adlar));
  denetle('hiç çalışılmamış kart listede yok', !adlar.includes('hic-calisilmamis'));
  denetle('askıdaki listede yok', !adlar.includes('askida'));
  denetle('en çok unutulan başta', adlar[0] === 'cok-unutulan', JSON.stringify(adlar));
  denetle('unutma, yüksek difficulty’den ağır basıyor',
    adlar.indexOf('az-unutulan') < adlar.indexOf('zor-ama-unutulmamis') ||
    adlar.indexOf('zor-ama-unutulmamis') === -1,
    JSON.stringify(adlar));
  denetle('sınır uygulanıyor', zorKartlar(
    Array.from({ length: 30 }, (_, i) => kart('k' + i, { lapses: 3 })), 5).length === 5);
}

console.log('\n  HAFTALIK ÖZET');
{
  const gun = (d) => {
    const t = new Date(SIMDI); t.setDate(t.getDate() - d);
    return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}`;
  };
  const satir = (d, reviews, correct, dev = 'a') => ({
    id: `${gun(d)}|${dev}`, day: gun(d), deviceId: dev,
    secondsBySkill: {}, reviews, reviewsCorrect: correct,
    quizzes: 0, completions: 0, recordings: 0, cardsAdded: 0, updatedAt: 0,
  });

  const o = haftalikOzet([satir(0, 10, 8), satir(2, 5, 5)], 7, SIMDI);
  denetle('yedi gün dönüyor', o.length === 7, String(o.length));
  denetle('son gün en sonda', o[6].gun === gun(0));
  denetle('çalışılmayan gün sıfırla duruyor',
    o[5].tekrar === 0 && o[4].tekrar === 5, JSON.stringify(o.map(x=>x.tekrar)));
  denetle('etiket okunur', /^\d+ \w+$/.test(o[6].etiket), o[6].etiket);

  /* AYNI GÜN İKİ CİHAZ: satır anahtarı gün|cihaz, ikisi toplanmalı. */
  const iki = haftalikOzet([satir(0, 10, 8, 'a'), satir(0, 4, 4, 'b')], 7, SIMDI);
  denetle('aynı günün iki cihazı toplanıyor', iki[6].tekrar === 14, String(iki[6].tekrar));

  denetle('tutma oranı', tutmaOrani(o) === Math.round((8+5)/(10+5)*100), String(tutmaOrani(o)));
  denetle('hiç tekrar yoksa null', tutmaOrani(haftalikOzet([], 7, SIMDI)) === null);
}

console.log('\n  GÜN ETİKETİ');
denetle('ay adı Türkçe', gunEtiketi('2026-10-16') === '16 Eki', gunEtiketi('2026-10-16'));
denetle('başındaki sıfır atılıyor', gunEtiketi('2026-01-05') === '5 Oca', gunEtiketi('2026-01-05'));

console.log(`\n  SONUÇ: ${gecti} geçti, ${kaldi} kaldı\n`);
process.exit(kaldi === 0 ? 0 : 1);
