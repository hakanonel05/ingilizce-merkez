/* DİKTE SINAMASI
 *
 * İki kural sınanıyor: metnin dikte birimlerine bölünmesi ve yazılanın
 * hedefle karşılaştırılması. İkisi de saf — ses, tarayıcı, ağ yok.
 *
 * Çalıştır:  npm run test:dikte
 */

import {
  dikteBirimleri,
  dikteyiDenetle,
  duraklamaSuresi,
} from '../apps/konusma/src/lib/dikteDenetimi.ts';

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

console.log('\n  BÖLME');
{
  const b = dikteBirimleri('I have an appointment. Can you come at three?');
  denetle('cümleler ayrı birim', b.length === 2, JSON.stringify(b.map((x) => x.metin)));
  denetle('cümle sonu noktalaması korunuyor', b[0].metin.endsWith('.') && b[1].metin.endsWith('?'));
  denetle('sıra numaraları 1 den başlıyor', b[0].sira === 1 && b[1].sira === 2);
}
{
  /* 20 kelimelik tek cümle: bir solukta yazılamaz, bölünmeli. */
  const uzun =
    'I would like to make an appointment with the doctor, but I cannot come before five on Friday afternoon.';
  const b = dikteBirimleri(uzun);
  denetle('uzun cümle parçalanıyor', b.length > 1, JSON.stringify(b.map((x) => x.metin)));
  denetle(
    'parçaların hiçbiri aşırı uzun değil',
    b.every((x) => x.kelimeSayisi <= 14),
    JSON.stringify(b.map((x) => x.kelimeSayisi))
  );
  denetle(
    'parçalar birleştirilince metin korunuyor',
    b.map((x) => x.metin).join(' ').replace(/\s+/g, ' ') === uzun
  );
}
{
  const b = dikteBirimleri('Yes. I will be there at nine tomorrow morning.');
  denetle(
    'tek kelimelik parça kendi başına birim olmuyor',
    b.every((x) => x.kelimeSayisi >= 3),
    JSON.stringify(b.map((x) => x.metin))
  );
}
denetle('boş metin boş dönüyor', dikteBirimleri('   ').length === 0);

console.log('\n  DENETLEME — birebir');
{
  const s = dikteyiDenetle('I have an appointment at three.', 'I have an appointment at three.');
  denetle('hepsi doğru', s.dogru === s.toplam && s.toplam === 6, `${s.dogru}/${s.toplam}`);
  denetle('puan 100', s.puan === 100);
  denetle('tam işareti', s.tamMi === true);
}

console.log('\n  DENETLEME — noktalama ve büyük harf sayılmıyor');
{
  const s = dikteyiDenetle("I don't have an appointment.", 'i dont have an appointment');
  denetle('büyük harf farkı yanlış saymıyor', s.puan === 100, `${s.dogru}/${s.toplam}`);
  denetle('kesme işareti farkı yanlış saymıyor', s.kelimeler.every((k) => k.durum === 'dogru'));
  denetle('yazım işareti eksik olsa da dikte tam sayılıyor', s.tamMi === true);
}

console.log('\n  DENETLEME — hatalar');
{
  const s = dikteyiDenetle('I have an appointment at three.', 'I have a appointment at free.');
  const yanlislar = s.kelimeler.filter((k) => k.durum === 'yanlis');
  denetle('iki kelime yanlış', yanlislar.length === 2, JSON.stringify(yanlislar.map((k) => `${k.hedef}→${k.yazilan}`)));
  denetle('puan düştü', s.puan < 100 && s.puan > 50, String(s.puan));
  denetle('tam değil', s.tamMi === false);
}
{
  const s = dikteyiDenetle('Can you come at three on Friday?', 'Can you come on Friday?');
  const eksikler = s.kelimeler.filter((k) => k.durum === 'eksik').map((k) => k.hedef);
  denetle('atlanan kelimeler eksik işaretli', eksikler.length === 2, JSON.stringify(eksikler));
}
{
  const s = dikteyiDenetle('Come at three.', 'Please come at three today.');
  denetle('fazladan yazılanlar ayrı listede', s.fazladan.length === 2, JSON.stringify(s.fazladan));
  denetle('fazladan yazmak hedef kelimeleri bozmuyor', s.dogru === 3, `${s.dogru}/${s.toplam}`);
}
{
  const s = dikteyiDenetle('I have an appointment.', '');
  denetle('boş cevapta hepsi eksik', s.kelimeler.every((k) => k.durum === 'eksik'), `${s.dogru}/${s.toplam}`);
  denetle('boş cevapta puan sıfır', s.puan === 0);
}

console.log('\n  DURAKLAMA');
denetle('kısa birimde taban süre geçerli', duraklamaSuresi(2) === 2, String(duraklamaSuresi(2)));
denetle('uzun birimde kelimeye göre uzuyor', duraklamaSuresi(10) === 8, String(duraklamaSuresi(10)));
denetle('çarpan uygulanıyor', duraklamaSuresi(10, 1.5) === 12, String(duraklamaSuresi(10, 1.5)));
denetle('çarpan küçükse taban yine korunuyor', duraklamaSuresi(1, 0.5) === 1, String(duraklamaSuresi(1, 0.5)));

console.log(`\n  SONUÇ: ${gecti} geçti, ${kaldi} kaldı\n`);
process.exit(kaldi === 0 ? 0 : 1);
