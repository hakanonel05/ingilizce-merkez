/* DERS BİRLEŞTİRME SINAMASI
 *
 * Bu kuralların sınanmasının sebebi somut: önceki sürüm ders listesini tek
 * blok olarak eşitliyordu ve iki bilgisayarda eklenen dersler birleşmek
 * yerine birbirini siliyordu — kullanıcının çalışması gerçekten kayboldu.
 * Aşağıdaki ilk senaryo tam olarak o durumu kuruyor.
 *
 * Çalıştır:  npm run test:ders-senkron
 */

import { dersiKat, dersiCikar, eskiBloguKat } from '../shared/vocab/dersBirlestirme.ts';

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

const ders = (id, updatedAt, ekstra = {}) => ({ id, title: id, updatedAt, ...ekstra });
const kimlikler = (liste) => liste.map((d) => d.id).sort().join(',');

console.log('\n  iki cihazda iki ayri ders — ASIL SENARYO');
{
  // İş bilgisayarı A dersini ekledi, ev bilgisayarı B dersini.
  const is = [ders('A', 1000)];
  const ev = [ders('B', 2000)];

  // Ev, iş bilgisayarının dersini çekiyor.
  const evSonra = dersiKat(ev, is[0]).dersler;
  // İş, evin dersini çekiyor.
  const isSonra = dersiKat(is, ev[0]).dersler;

  denetle('ev bilgisayarinda iki ders de var', kimlikler(evSonra) === 'A,B', kimlikler(evSonra));
  denetle('is bilgisayarinda iki ders de var', kimlikler(isSonra) === 'A,B', kimlikler(isSonra));
  denetle('hicbir ders kaybolmadi', evSonra.length === 2 && isSonra.length === 2);
}

console.log('\n  ayni dersin iki surumu');
{
  const yerel = [ders('A', 1000, { title: 'eski' })];
  const yeni = dersiKat(yerel, ders('A', 2000, { title: 'yeni' })).dersler;
  denetle('yeni surum kazandi', yeni[0].title === 'yeni', yeni[0].title);
  denetle('ders cogalmadi', yeni.length === 1, `${yeni.length} ders`);

  const eski = dersiKat(yerel, ders('A', 500, { title: 'daha eski' }));
  denetle('eski surum yereli ezmedi', eski.dersler[0].title === 'eski', eski.dersler[0].title);
  denetle('degisiklik bildirilmedi', eski.degisti === false);
}

console.log('\n  damgasiz eski kayit');
{
  const yerel = [{ id: 'A', title: 'damgasiz' }];
  const sonuc = dersiKat(yerel, ders('A', 1, { title: 'damgali' }));
  denetle('damgali surum damgasizi gecti', sonuc.dersler[0].title === 'damgali');
}

console.log('\n  silme yayiliyor mu');
{
  const yerel = [ders('A', 1000), ders('B', 1000)];
  const sonuc = dersiCikar(yerel, 'A');
  denetle('ders listeden cikti', kimlikler(sonuc.dersler) === 'B', kimlikler(sonuc.dersler));
  denetle('olmayan ders silinince degisiklik yok', dersiCikar(sonuc.dersler, 'Z').degisti === false);
}

console.log('\n  silinen ders geri gelmiyor');
{
  // A dersi 2000'de silindi; diger cihaz onu 1500 damgasiyla gonderiyor.
  const mezarlar = { A: 2000 };
  const sonuc = dersiKat([], ders('A', 1500), mezarlar);
  denetle('silinmis ders geri gelmedi', sonuc.dersler.length === 0, `${sonuc.dersler.length} ders`);

  // Ama silmeden SONRA duzenlendiyse geri gelmeli: kullanici onu oradan
  // silmemis ve uzerinde calismaya devam etmis.
  const sonraki = dersiKat([], ders('A', 3000), mezarlar);
  denetle('silmeden sonra duzenlenen ders geri geldi', sonraki.dersler.length === 1);
}

console.log('\n  eski blok kaydi (gecis donemi)');
{
  const yerel = [ders('A', 5000, { title: 'yerel A' })];
  const blok = [
    { id: 'A', title: 'bloktaki eski A' },
    { id: 'C', title: 'bloktaki C' },
  ];
  const sonuc = eskiBloguKat(yerel, blok, 1000);

  denetle('bloktaki yeni ders eklendi', kimlikler(sonuc.dersler) === 'A,C', kimlikler(sonuc.dersler));
  const a = sonuc.dersler.find((d) => d.id === 'A');
  denetle('blok, daha yeni yerel dersi EZMEDI', a.title === 'yerel A', a.title);

  const bos = eskiBloguKat([ders('A', 1)], 'dizi degil', 0);
  denetle('bozuk blok yoksayildi', bos.degisti === false && bos.dersler.length === 1);
}

console.log('\n  bos ve bozuk girdiler');
{
  denetle('kimliksiz ders yoksayildi', dersiKat([], { title: 'id yok' }).degisti === false);
  denetle('bos liste bozulmadi', dersiKat([], ders('A', 1)).dersler.length === 1);
}

console.log('\n  ' + '='.repeat(58));
if (kaldi === 0) {
  console.log(`  tum denetimler gecti (${gecti})`);
} else {
  console.log(`  ${kaldi} DENETIM KALDI, ${gecti} gecti`);
  process.exitCode = 1;
}
