/* TED LİNKİ TANIMA SINAMASI
 *
 * Kullanıcı artık ted.com adresini de yapıştırabiliyor ve YouTube linkiyle
 * aynı dersi alıyor. Bunun ilk adımı adresin DOĞRU tanınması: yanlış
 * tanınırsa link sessizce "elle yapıştırılmış metin" sayılıyor ve ders
 * saçma sapan üç cümleden oluşuyor (geliştirme sırasında tam olarak bu
 * oldu). Ağ erişimi gerektirmeyen, saf kural sınaması.
 *
 * Çalıştır:  npm run test:ted-linki
 */

import { tedLinkiMi } from '../apps/katmanli/src/lib/ted.ts';

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

const SLUG = 'tim_urban_inside_the_mind_of_a_master_procrastinator';

console.log('\n  TANINMASI GEREKEN adresler');
for (const adres of [
  `https://www.ted.com/talks/${SLUG}`,
  `https://ted.com/talks/${SLUG}`,
  `http://www.ted.com/talks/${SLUG}`,
  `www.ted.com/talks/${SLUG}`,
  `ted.com/talks/${SLUG}`,
  `https://www.ted.com/talks/${SLUG}/transcript`,
  `https://www.ted.com/talks/${SLUG}?language=tr`,
  `https://www.ted.com/talks/${SLUG}/transcript?subtitle=en`,
  `https://embed.ted.com/talks/${SLUG}`,
  /* Yeni konuşmaların slug'ı sayı içerebiliyor. */
  'https://www.ted.com/talks/talk_190421',
  /* Link metnin ortasında geçebilir: kullanıcı not alıp yapıştırıyor. */
  `şu konuşma: https://www.ted.com/talks/${SLUG} çok iyiydi`,
]) {
  denetle(adres.length > 58 ? adres.slice(0, 55) + '…' : adres, tedLinkiMi(adres) === true);
}

console.log('\n  TANINMAMASI GEREKEN adresler');
for (const [adres, neden] of [
  ['https://www.youtube.com/watch?v=arj7oStGLkU', 'YouTube'],
  ['', 'boş'],
  ['Bu bir transkript metni, link değil.', 'düz metin'],
  /* Alan adı sınırı: bunlar ted.com DEĞİL. */
  [`https://notted.com/talks/${SLUG}`, 'notted.com'],
  [`https://ted.com.evil.example/talks/${SLUG}`, 'ted.com.evil.example'],
  /* ted.com'un konuşma olmayan sayfaları. */
  ['https://www.ted.com/playlists/171/the_most_popular_talks_of_all', 'playlist'],
  ['https://www.ted.com/', 'ana sayfa'],
]) {
  denetle(neden, tedLinkiMi(adres) === false, adres.slice(0, 44));
}

console.log(`\n  SONUÇ: ${gecti} geçti, ${kaldi} kaldı\n`);
process.exit(kaldi === 0 ? 0 : 1);
