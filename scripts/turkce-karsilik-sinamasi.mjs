/* TÜRKÇE KARŞILIK EŞLEŞTİRMESİ SINAMASI
 *
 * Raporda İngilizce kelime sarı vurgulanınca sağdaki Türkçe karşılığı da
 * vurgulanıyor. Türkçe eklemeli bir dil olduğu için bu eşleştirme tahmine
 * dayanıyor; tahminin NEREDE tutup nerede tutmadığı yazılı olmalı, yoksa
 * ileride biri eşiği oynatır ve yanlış kelimeler boyanmaya başlar.
 *
 * Çalıştır:  npm run test:turkce-karsilik
 */

import {
  turkceKarsilikAraliklari,
  karsilikSecenekleri,
  govde,
  kucult,
} from '../apps/katmanli/src/lib/turkceKarsilik.ts';

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

/** Vurgulanan parçaları metinden kesip döndürür — okunur sınama için. */
function vurgulananlar(cumle, karsiliklar) {
  return turkceKarsilikAraliklari(cumle, karsiliklar).map((r) =>
    cumle.slice(r.start, r.end)
  );
}

console.log('\n  GÖVDE — mastar eki atılıyor');
denetle('ertelemek → ertele', govde('ertelemek') === 'ertele', govde('ertelemek'));
denetle('yaymak → yay', govde('yaymak') === 'yay', govde('yaymak'));
denetle('isim değişmiyor', govde('bölüm') === 'bölüm');
/* "demek" beş harf: kısa kelimede ek atılırsa geriye "de" kalır ve
   her şeyi tutar. */
denetle('çok kısa kelimede ek atılmıyor', govde('demek') === 'demek', govde('demek'));

console.log('\n  TÜRKÇE KÜÇÜK HARF');
denetle('İ → i', kucult('İstanbul') === 'istanbul', kucult('İstanbul'));
denetle('I → ı', kucult('ISLAK') === 'ıslak', kucult('ISLAK'));

console.log('\n  ÇEKİMLİ BİÇİMLER — asıl mesele');
denetle(
  'ertelemek, "erteledim"i buluyor',
  vurgulananlar('Son teslim tarihine bir gün kalana dek erteledim.', ['ertelemek'])
    .join() === 'erteledim',
  vurgulananlar('Son teslim tarihine bir gün kalana dek erteledim.', ['ertelemek']).join()
);
/* KISA GÖVDE BİLEREK EŞLEŞMİYOR. "yaymak"ın gövdesi "yay", üç harf;
   bu uzunlukta ön ek eşleşmesi alakasız kelimeleri de tutuyor (aşağıdaki
   "bakır" sınaması). Eksik vurgu, yanlış vurgudan iyi. */
denetle(
  'kısa gövdeli fiil eşleşmiyor (bilerek)',
  vurgulananlar('Normal bir öğrenci işi haftalara yayardı.', ['yaymak']).length === 0,
  JSON.stringify(vurgulananlar('Normal bir öğrenci işi haftalara yayardı.', ['yaymak']))
);
denetle(
  'aynı fiilin mastarı aynen geçiyorsa yine de bulunuyor',
  vurgulananlar('İşi haftalara yaymak gerekiyordu.', ['yaymak']).join() === 'yaymak'
);
denetle(
  'isim de çekimli bulunuyor ("tarihi" → "tarihine")',
  vurgulananlar('Son teslim tarihine bir gün kaldı.', ['son teslim tarihi']).join() ===
    'Son teslim tarihine'
);

console.log('\n  ÇOK KELİMELİ ve ÇOK SEÇENEKLİ karşılıklar');
denetle(
  'çok kelimeli karşılık bütün olarak vurgulanıyor',
  vurgulananlar('Üniversitede ana dal olarak siyaset bilimi okudum.', ['ana dal']).join() ===
    'ana dal'
);
{
  const c = 'Üniversitede bölüm olarak siyaset bilimi okudum.';
  denetle(
    'virgülle ayrılmış ikinci seçenek de deneniyor',
    vurgulananlar(c, ['ana dal, bölüm']).join() === 'bölüm',
    vurgulananlar(c, ['ana dal, bölüm']).join()
  );
}
denetle(
  'parantez içi açıklama hedef değil',
  karsilikSecenekleri('ertelemek (bir işi)').length === 1,
  JSON.stringify(karsilikSecenekleri('ertelemek (bir işi)'))
);

console.log('\n  YANLIŞ VURGUYA KARŞI');
denetle(
  'karşılık cümlede hiç geçmiyorsa hiçbir şey vurgulanmıyor',
  vurgulananlar('Çevirmen bambaşka bir kelime seçmiş.', ['ertelemek']).length === 0
);
denetle(
  '"bir" tek başına hedef sayılmıyor ("birkaç" boyanmaz)',
  vurgulananlar('Birkaç hafta sürdü.', ['bir']).length === 0
);
denetle(
  'kısa ve alakasız ön ek tutmuyor ("bak" ile "bakır")',
  vurgulananlar('Bakır bir tencere aldı.', ['bakmak']).length === 0,
  JSON.stringify(vurgulananlar('Bakır bir tencere aldı.', ['bakmak']))
);
denetle('boş karşılık listesi boş dönüyor', turkceKarsilikAraliklari('Bir cümle.', []).length === 0);
denetle('boş cümle boş dönüyor', turkceKarsilikAraliklari('', ['ertelemek']).length === 0);

console.log('\n  ÇOKLU VURGU');
{
  const c = 'Son teslim tarihine kadar işi haftalara erteledim.';
  const v = vurgulananlar(c, ['son teslim tarihi', 'ertelemek']);
  denetle('aynı cümlede iki karşılık da bulunuyor', v.length === 2, JSON.stringify(v));
  const araliklar = turkceKarsilikAraliklari(c, ['son teslim tarihi', 'ertelemek']);
  denetle(
    'aralıklar sıralı ve çakışmıyor',
    araliklar.every((r, i) => i === 0 || r.start >= araliklar[i - 1].end)
  );
}
{
  /* Aynı kelime cümlede iki kez geçerse yalnızca ilki işaretleniyor:
     tekrarları boyamak satırı okunmaz yapardı. */
  const c = 'Erteledim, yine erteledim.';
  denetle(
    'tekrar eden kelimenin yalnızca ilki vurgulanıyor',
    vurgulananlar(c, ['ertelemek']).length === 1,
    JSON.stringify(vurgulananlar(c, ['ertelemek']))
  );
}

console.log(`\n  SONUÇ: ${gecti} geçti, ${kaldi} kaldı\n`);
process.exit(kaldi === 0 ? 0 : 1);
