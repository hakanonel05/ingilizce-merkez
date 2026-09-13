/* AÇIK UÇLU CEVAP EŞLEŞTİRME SINAMASI
 * ============================================================================
 * Kitabın cevap anahtarındaki gerçek biçimlerle sınıyor. Bu mantık yanlış
 * olursa doğru cevap yanlış görünür ve öğrenci hatasını arar — sessiz ve
 * can sıkıcı bir hata. O yüzden ayrı sınaması var.
 *
 * Çalıştırma: node scripts/acik-uclu-sinamasi.mjs
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const kok = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const kaynak = readFileSync(path.join(kok, 'apps/reading/src/lib/acikUcluCevap.ts'), 'utf8');

// TS dosyasını Node'da çalıştırabilmek için tip süslerini soy.
const js = kaynak
  .replace(/^export /gm, '')
  .replace(/: string\[\]/g, '')
  .replace(/: string/g, '')
  .replace(/: boolean/g, '')
  .replace(/new Set<string>\(\)/g, 'new Set()')
  .replace(/const \[, sol, alternatif, sag\]/, 'const [, sol, alternatif, sag]');

const modul = new Function(js + '\nreturn { kabulEdilenler, acikUcluDogruMu };')();
const { acikUcluDogruMu } = modul;

let gecti = 0;
let kaldi = 0;

function sina(ad, verilen, anahtar, beklenen) {
  const sonuc = acikUcluDogruMu(verilen, anahtar);
  if (sonuc === beklenen) {
    gecti++;
  } else {
    kaldi++;
    console.log('  ✗', ad, '| verilen:', JSON.stringify(verilen), '| anahtar:', JSON.stringify(anahtar),
      '| beklenen', beklenen, 'cikan', sonuc);
  }
}

console.log('açık uçlu cevap eşleştirme');

// 1 — düz cevap
sina('düz cevap', 'Egypt', 'Egypt', true);
sina('küçük harf', 'egypt', 'Egypt', true);
sina('sonunda nokta', 'Egypt.', 'Egypt', true);
sina('boşluklu', '  Egypt ', 'Egypt', true);
sina('yanlış cevap', 'Sudan', 'Egypt', false);
sina('boş cevap', '', 'Egypt', false);

// 2 — "(or X)" iki cevap da doğru
sina('or: ilki', 'Kermanshah', 'Kermanshah (or Iran)', true);
sina('or: ikincisi', 'Iran', 'Kermanshah (or Iran)', true);
sina('or: alakasız', 'Tehran', 'Kermanshah (or Iran)', false);

// 3 — "(the) X" parantez isteğe bağlı
sina('isteğe bağlı: kısa', 'project', '(the) project', true);
sina('isteğe bağlı: uzun', 'the project', '(the) project', true);
sina('isteğe bağlı: başka', 'the plan', '(the) project', false);
sina('isteğe bağlı: running clothes', 'running clothes', '(running) clothes', true);
sina('isteğe bağlı: clothes', 'clothes', '(running) clothes', true);

// 4 — uzun alternatif
sina('uzun or: kısa hâli', 'lip-reading', 'lip-reading (or being able to lip-read well)', true);
sina('uzun or: uzun hâli', 'being able to lip-read well',
  'lip-reading (or being able to lip-read well)', true);

// 5 — çok kelimeli düz cevap
sina('çok kelimeli', 'Western Cwm', 'Western Cwm', true);
sina('çok kelimeli: küçük', 'western cwm', 'Western Cwm', true);
sina('çok kelimeli: eksik', 'Western', 'Western Cwm', false);

// 6 — baştaki artikel göz ardı edilmeli
sina('artikel: fazladan', 'the deserts', 'deserts', true);
sina('artikel: eksik', 'deserts', 'the deserts', true);

// 7 — serbest metin doğru sayılmamalı
sina('cümle içinde geçiyor', 'I think the answer is Egypt because', 'Egypt', false);

console.log('\ngeçti', gecti, '| kaldı', kaldi);
process.exit(kaldi ? 1 : 0);
