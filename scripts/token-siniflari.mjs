/* SESSIZ SINIF KAYBI DENETIMI.
 *
 * Tailwind 4'te @theme'de tanimsiz bir token'in yardimci sinifi HIC
 * uretilmez ve hata da verilmez - sinif sessizce yok sayilir. Bu depoda
 * ayni tuzaga iki kez dusuldu: once `hairline-2` (48 kullanim), sonra
 * reading tarafinda `ink-800`/`ink-950` (9 kullanim, shared/ bilesenleri
 * uzerinden). Ikisi de ancak kontrast olcumunde fark edildi.
 *
 * Bu betik kaynaktaki her token sinifini toplayip ILGILI paketin
 * derlenmis CSS'inde gercekten var mi diye bakiyor.
 *
 * NOT: ters bolu ile yazilan regex kacislari (\b gibi) bu ortamda
 * heredoc/araclar arasinda yeniyor, o yuzden kasten lookbehind/lookahead
 * ile yazildi.
 */
import fs from 'fs';
import path from 'path';

/* Depo koku: bu betik scripts/ altinda duruyor. */
const KOK = path.resolve(import.meta.dirname, '..') + '/';

const TOKEN = [
  'paper', 'paper-2', 'paper-3', 'paper-warm',
  'ink', 'ink-2', 'ink-3', 'ink-800', 'ink-950',
  'hairline', 'hairline-2',
  'accent', 'accent-700', 'accent-soft',
  'brand', 'brand-strong', 'brand-soft',
  'ok', 'ok-strong', 'ok-line', 'ok-soft',
  'danger', 'danger-strong', 'danger-line', 'danger-soft',
  'marker', 'marker-bg', 'marker-ink',
].join('|');

const ONEK = '(?:(?:hover|focus|focus-visible|active|group-hover|disabled|sm|md|lg|xl|2xl):)*';
const OZELLIK = '(?:bg|text|border|ring|fill|stroke|divide|decoration|from|to|placeholder|outline|caret|accent)';
const RE = new RegExp(
  '(?<![a-zA-Z0-9:_-])' + ONEK + OZELLIK + '-(?:' + TOKEN + ')(?:/[0-9]{1,3})?(?![a-zA-Z0-9-])',
  'g',
);

const walk = (d, o = []) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name === 'node_modules') continue;
    const p = path.join(d, e.name);
    e.isDirectory() ? walk(p, o) : e.name.endsWith('.tsx') && o.push(p);
  }
  return o;
};

const topla = (dizinler) => {
  const s = new Set();
  for (const p of dizinler.flatMap((d) => walk(KOK + d)))
    for (const m of fs.readFileSync(p, 'utf8').matchAll(RE)) s.add(m[0]);
  return [...s].sort();
};

const cssOku = (g) =>
  fs.readdirSync(KOK + g).filter((f) => f.endsWith('.css'))
    .map((f) => fs.readFileSync(KOK + g + '/' + f, 'utf8')).join('\n');

/* Uretilen sinif CSS'te nokta ile baslar ve : / . karakterleri kacisli yazilir. */
const KACIS = String.fromCharCode(92);
const NOKTA = String.fromCharCode(46);
const varMi = (css, c) => css.includes(NOKTA + c.replace(/[:/.]/g, (m) => KACIS + m));

let sorun = 0;
for (const [ad, kaynak, cssDizin] of [
  ['KATMANLI', ['apps/katmanli', 'shared'], 'dist/katmanli/assets'],
  ['READING', ['apps/reading', 'shared'], 'dist/assets'],
]) {
  const css = cssOku(cssDizin);
  const siniflar = topla(kaynak);
  const eksik = siniflar.filter((c) => !varMi(css, c));
  console.log('\n' + ad + '  kaynakta ' + siniflar.length + ' ayri token sinifi');
  if (eksik.length) {
    sorun += eksik.length;
    console.log('  URETILMEYEN (' + eksik.length + '):');
    for (const c of eksik) console.log('    ' + c);
  } else {
    console.log('  hepsi uretilmis');
  }
}
process.exitCode = sorun ? 1 : 0;
