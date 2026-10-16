/* ÇALIŞMA MODLARI SINAMASI
 *
 * Kelime kartlarına eklenen üç mod (yazma, çoktan seçmeli, eşleştirme) ve yön
 * seçimi için karar mantığı. Sınanmasının sebebi somut: "bu cevap doğru mu" ve
 * "bu çeldirici makul mü" sorularının yanlış cevabı, çalışmayı doğrudan
 * bozuyor — kullanıcı doğru yazdığı hâlde yanlış sayılıyor ya da soru
 * kendiliğinden cevaplanıyor.
 *
 * Çalıştır:  npm run test:calisma-modlari
 */

import {
  kucult, sadeles, cevapSecenekleri, mesafe, yazmayiDenetle, yazmaDerecesi,
  soruYonu, karistir, testSorusuUret, eslestirmeKur, TEST_SIK_SAYISI,
} from '../shared/vocab/calismaModlari.ts';
import { Rating } from '../shared/vocab/fsrs.ts';

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

/** Sınamada yineleyen rastgelelik: hep aynı sırayı üretir. */
function sahteRastgele(tohum = 1) {
  let s = tohum;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

const kart = (id, front, back, ek = {}) => ({
  id, front, back, level: 'B1', kind: 'word', lessonId: 'd1', lessonTitle: 'Ders',
  createdAt: 0, due: 0, stability: 0, difficulty: 0, elapsedDays: 0,
  scheduledDays: 0, reps: 0, lapses: 0, state: 'learning', ...ek,
});

console.log('\n  TÜRKÇE KÜÇÜK HARF');
denetle('I → ı', kucult('ISLAK') === 'ıslak', kucult('ISLAK'));
denetle('İ → i', kucult('İSTANBUL') === 'istanbul', kucult('İSTANBUL'));
denetle('noktalama düşüyor', sadeles('Ertelemek, (bir işi)!') === 'ertelemek bir işi');

console.log('\n  CEVAP SEÇENEKLERİ');
denetle('virgülle ayrılan karşılıklar',
  JSON.stringify(cevapSecenekleri('ana dal, bölüm')) === JSON.stringify(['ana dal', 'bölüm']));
denetle('parantez içi hedef değil',
  JSON.stringify(cevapSecenekleri('ertelemek (bir işi)')) === JSON.stringify(['ertelemek']));
denetle('tek karşılık', JSON.stringify(cevapSecenekleri('hata')) === JSON.stringify(['hata']));

console.log('\n  MESAFE');
denetle('aynı dizgi 0', mesafe('abc', 'abc') === 0);
denetle('bir harf farkı 1', mesafe('kedi', 'kedı') === 1);
denetle('boş dizgi', mesafe('', 'abc') === 3);

console.log('\n  YAZMA DENETİMİ');
{
  denetle('birebir doğru', yazmayiDenetle('ertelemek', 'ertelemek').durum === 'dogru');
  denetle('büyük harf fark etmiyor', yazmayiDenetle('ertelemek', 'ERTELEMEK').durum === 'dogru');
  denetle('noktalama fark etmiyor', yazmayiDenetle('ertelemek', 'ertelemek.').durum === 'dogru');
  denetle('ikinci karşılık da doğru', yazmayiDenetle('ana dal, bölüm', 'bölüm').durum === 'dogru');
  /* Bir harf şaşmak bambaşka kelime yazmakla aynı şey değil. */
  denetle('bir harf şaşması YAKIN',
    yazmayiDenetle('ertelemek', 'ertelemk').durum === 'yakin',
    yazmayiDenetle('ertelemek', 'ertelemk').durum);
  denetle('alakasız kelime YANLIŞ', yazmayiDenetle('ertelemek', 'koşmak').durum === 'yanlis');
  denetle('boş cevap yanlış', yazmayiDenetle('ertelemek', '').durum === 'yanlis');
  denetle('beklenen karşılık geri dönüyor',
    yazmayiDenetle('ana dal, bölüm', 'bölm').beklenen === 'bölüm',
    yazmayiDenetle('ana dal, bölüm', 'bölm').beklenen);
  /* KISA KELİMEDE HOŞGÖRÜ YOK: "cat" ile "cut" bir harf farklı ama
     bambaşka kelimeler. */
  denetle('kısa kelimede bir harf farkı YANLIŞ',
    yazmayiDenetle('cat', 'cut').durum === 'yanlis',
    yazmayiDenetle('cat', 'cut').durum);
}

console.log('\n  DERECELENDİRME EŞLEŞMESİ');
denetle('doğru → Good', yazmaDerecesi('dogru') === Rating.Good);
denetle('yakın → Hard', yazmaDerecesi('yakin') === Rating.Hard);
denetle('yanlış → Again', yazmaDerecesi('yanlis') === Rating.Again);

console.log('\n  YÖN');
{
  const k = kart('1', 'mistake', 'hata');
  const a = soruYonu(k, 'enTr');
  denetle('enTr: İngilizce sorulur', a.soru === 'mistake' && a.cevap === 'hata' && a.soruIngilizce);
  const b = soruYonu(k, 'trEn');
  denetle('trEn: Türkçe sorulur', b.soru === 'hata' && b.cevap === 'mistake' && !b.soruIngilizce);
  const c = soruYonu(k, 'karisik', () => 0.1);
  const d = soruYonu(k, 'karisik', () => 0.9);
  denetle('karışık: iki yön de çıkabiliyor', c.soruIngilizce !== d.soruIngilizce);
}

console.log('\n  ÇOKTAN SEÇMELİ');
{
  const deste = [
    kart('1', 'mistake', 'hata', { pos: 'noun' }),
    kart('2', 'deadline', 'son teslim tarihi', { pos: 'noun' }),
    kart('3', 'lesson', 'ders', { pos: 'noun' }),
    kart('4', 'window', 'pencere', { pos: 'noun' }),
    kart('5', 'run', 'koşmak', { pos: 'verb' }),
  ];
  const s = testSorusuUret(deste[0], deste, 'enTr', sahteRastgele(7));
  denetle('dört şık', s.secenekler.length === TEST_SIK_SAYISI, String(s.secenekler.length));
  denetle('doğru şık listede', s.secenekler[s.dogruIndeks] === 'hata');
  denetle('şıklar benzersiz', new Set(s.secenekler).size === s.secenekler.length);
  denetle('soru İngilizce tarafı', s.soru === 'mistake');
  /* ÇELDİRİCİLER AYNI SÖZ TÜRÜNDEN: "koşmak" (fiil) dört isim arasına
     girerse soru kendiliğinden cevaplanır. */
  denetle('çeldiriciler aynı söz türünden',
    !s.secenekler.includes('koşmak'), JSON.stringify(s.secenekler));

  /* Aynı karşılığı taşıyan iki kart varsa "iki şık da doğru" olmamalı. */
  const ikiz = [...deste, kart('6', 'error', 'hata', { pos: 'noun' })];
  const s2 = testSorusuUret(ikiz[0], ikiz, 'enTr', sahteRastgele(3));
  denetle('aynı karşılıklı çeldirici elendi',
    s2.secenekler.filter((x) => x === 'hata').length === 1,
    JSON.stringify(s2.secenekler));

  /* Deste küçükse şık sayısı düşebilir ama soru yine de kurulmalı. */
  const kucuk = [kart('1', 'mistake', 'hata'), kart('2', 'lesson', 'ders')];
  const s3 = testSorusuUret(kucuk[0], kucuk, 'enTr', sahteRastgele(5));
  denetle('küçük destede soru yine kuruluyor',
    s3.secenekler.length === 2 && s3.dogruIndeks >= 0, String(s3.secenekler.length));

  const s4 = testSorusuUret(deste[0], deste, 'trEn', sahteRastgele(11));
  denetle('trEn yönünde soru Türkçe', s4.soru === 'hata' && !s4.soruIngilizce);
  denetle('trEn yönünde şıklar İngilizce', s4.secenekler.includes('mistake'));
}

console.log('\n  EŞLEŞTİRME');
{
  const deste = Array.from({ length: 10 }, (_, i) => kart(String(i), `w${i}`, `k${i}`));
  const o = eslestirmeKur(deste, 6, sahteRastgele(2));
  denetle('altı çift', o.sol.length === 6 && o.sag.length === 6);
  denetle('iki taraf aynı kartlardan',
    JSON.stringify([...o.sol.map((x) => x.kartId)].sort()) ===
    JSON.stringify([...o.sag.map((x) => x.kartId)].sort()));
  denetle('sıralar farklı (karıştırılmış)',
    JSON.stringify(o.sol.map((x) => x.kartId)) !== JSON.stringify(o.sag.map((x) => x.kartId)));
  const az = eslestirmeKur(deste.slice(0, 3), 6, sahteRastgele(2));
  denetle('deste azsa o kadarıyla kuruluyor', az.sol.length === 3);
}

console.log('\n  KARIŞTIRMA');
{
  const liste = [1, 2, 3, 4, 5, 6, 7, 8];
  const k = karistir(liste, sahteRastgele(9));
  denetle('kaynak değişmiyor', JSON.stringify(liste) === JSON.stringify([1,2,3,4,5,6,7,8]));
  denetle('aynı ögeler', JSON.stringify([...k].sort((a,b)=>a-b)) === JSON.stringify(liste));
  denetle('sıra değişti', JSON.stringify(k) !== JSON.stringify(liste));
}

console.log(`\n  SONUÇ: ${gecti} geçti, ${kaldi} kaldı\n`);
process.exit(kaldi === 0 ? 0 : 1);
