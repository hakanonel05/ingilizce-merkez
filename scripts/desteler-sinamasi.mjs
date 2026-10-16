/* DESTELER ve YAPIŞTIRARAK EKLEME SINAMASI
 *
 * Yapıştırma ayrıştırması sessizce yanlış yapabilen bir iş: ayıracı yanlış
 * seçerse yüz kelimelik liste yarısı eksik ya da karşılıkları bölünmüş
 * olarak eklenir ve kullanıcı bunu ancak çalışırken fark eder.
 *
 * Çalıştır:  npm run test:desteler
 */

import {
  ayiraciSec, yapistirilaniCozumle, destedeMi, desteyiDegistir,
} from '../shared/vocab/desteler.ts';

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

const ozet = (liste) => liste.map((s) => `${s.on}=${s.arka}`).join(' | ');

console.log('\n  AYIRAÇ SEÇİMİ');
denetle('sekme tanınıyor', ayiraciSec('a\tb\nc\td') !== null);
denetle('ayıraçsız metin null', ayiraciSec('merhaba\ndünya') === null);
denetle('boş metin null', ayiraciSec('   ') === null);

console.log('\n  YAPIŞTIRMA — temel biçimler');
{
  denetle('sekme',
    ozet(yapistirilaniCozumle('mistake\thata\ndeadline\tson teslim')) ===
    'mistake=hata | deadline=son teslim');
  denetle('tire',
    ozet(yapistirilaniCozumle('mistake - hata\ndeadline - son teslim')) ===
    'mistake=hata | deadline=son teslim');
  denetle('eşittir',
    ozet(yapistirilaniCozumle('mistake = hata\ndeadline = son teslim')) ===
    'mistake=hata | deadline=son teslim');
  denetle('virgül',
    ozet(yapistirilaniCozumle('mistake, hata\ndeadline, son teslim')) ===
    'mistake=hata | deadline=son teslim');
  denetle('noktalı virgül',
    ozet(yapistirilaniCozumle('mistake; hata\ndeadline; son teslim')) ===
    'mistake=hata | deadline=son teslim');
}

console.log('\n  YAPIŞTIRMA — asıl tuzaklar');
{
  /* SEKME VARKEN VİRGÜLE DÜŞÜLMEMELİ: karşılıkta virgül geçiyor ve
     satır satır seçilseydi ikinci satır yanlış bölünürdü. */
  const m = 'mistake\thata, yanlış\nmajor\tana dal, bölüm';
  denetle('sekme varken karşılıktaki virgül bölmüyor',
    ozet(yapistirilaniCozumle(m)) === 'mistake=hata, yanlış | major=ana dal, bölüm',
    ozet(yapistirilaniCozumle(m)));
}
{
  /* İKİDEN FAZLA ALAN: gerisi atılmamalı, karşılığa katılmalı. */
  const m = 'run, koşmak, işletmek';
  denetle('üçüncü alan karşılığa katılıyor',
    ozet(yapistirilaniCozumle(m)) === 'run=koşmak, işletmek',
    ozet(yapistirilaniCozumle(m)));
}
{
  const m = 'mistake\thata\n\n   \ndeadline\tson teslim';
  denetle('boş satırlar atlanıyor',
    yapistirilaniCozumle(m).length === 2, String(yapistirilaniCozumle(m).length));
}
{
  const m = 'mistake\thata\nMISTAKE\tyanlış\ndeadline\tson teslim';
  denetle('aynı terim iki kez varsa biri alınıyor',
    yapistirilaniCozumle(m).length === 2, ozet(yapistirilaniCozumle(m)));
}
{
  const m = 'mistake\thata\nbozuksatır\ndeadline\tson teslim';
  denetle('ayıracı olmayan satır atlanıyor, gerisi alınıyor',
    ozet(yapistirilaniCozumle(m)) === 'mistake=hata | deadline=son teslim',
    ozet(yapistirilaniCozumle(m)));
}
{
  /* Tire kelimenin İÇİNDE geçebiliyor: "e-mail - e-posta".
     Ayıraç boşluklu tire, o yüzden bölünme doğru yerden olmalı. */
  const m = 'e-mail - e-posta\nup-to-date - güncel';
  denetle('kelime içi tire ayıraç sayılmıyor',
    ozet(yapistirilaniCozumle(m)) === 'e-mail=e-posta | up-to-date=güncel',
    ozet(yapistirilaniCozumle(m)));
}
denetle('ayıraçsız metinden kart çıkmıyor',
  yapistirilaniCozumle('sadece düz metin\nbir satır daha').length === 0);
denetle('boş metin', yapistirilaniCozumle('').length === 0);

console.log('\n  DESTE ÜYELİĞİ');
{
  const k = { id: 'a', desteler: ['d1'] };
  denetle('üye', destedeMi(k, 'd1') === true);
  denetle('üye değil', destedeMi(k, 'd2') === false);
  denetle('alan yoksa üye değil', destedeMi({ id: 'b' }, 'd1') === false);

  const eklendi = desteyiDegistir(k, 'd2', true);
  denetle('ekleme', JSON.stringify(eklendi.desteler) === JSON.stringify(['d1', 'd2']));
  denetle('kaynak kart değişmiyor', JSON.stringify(k.desteler) === JSON.stringify(['d1']));

  const ikiKez = desteyiDegistir(eklendi, 'd2', true);
  denetle('aynı desteye iki kez eklenmiyor', ikiKez.desteler.length === 2);

  const cikarildi = desteyiDegistir(eklendi, 'd1', false);
  denetle('çıkarma', JSON.stringify(cikarildi.desteler) === JSON.stringify(['d2']));

  const yokCikar = desteyiDegistir({ id: 'c' }, 'd9', false);
  denetle('olmayandan çıkarma hata vermiyor',
    JSON.stringify(yokCikar.desteler) === JSON.stringify([]));
}

console.log(`\n  SONUÇ: ${gecti} geçti, ${kaldi} kaldı\n`);
process.exit(kaldi === 0 ? 0 : 1);
