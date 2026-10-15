/* DIKTE KATALOGU CIKARICI
 *
 * EnglishClub'in uc seviyesindeki butun konulari ve her konunun butun
 * alistirmalarini bir kez tarayip depoya gomulecek veri dosyasini uretir.
 * Boylece uygulama listeyi canli cekmek zorunda kalmiyor (konu basina
 * 10-15 saniye bekleniyordu).
 *
 * YALNIZCA BASLIK VE ADRES toplaniyor - ses ya da cevap metni degil.
 * Onlar alistirma acilinca kaynagindan geliyor.
 *
 * Node'un fetch'i EnglishClub'a 403 aliyor (TLS parmak izi), bu yuzden
 * curl kullaniliyor.
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';

const calistir = promisify(execFile);
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const SEVIYELER = [
  { id: 'baslangic', ad: 'Başlangıç', dizin: 'https://www.englishclub.com/listening/dictations-short.php' },
  { id: 'orta', ad: 'Orta', dizin: 'https://www.englishclub.com/listening/dictations-medium.php' },
  { id: 'ileri', ad: 'İleri', dizin: 'https://www.englishclub.com/listening/dictations-long.php' },
];

const SAYFA_RE =
  /^https:\/\/www\.englishclub\.com\/listening\/dictations?[a-z0-9-]*\.php$/i;

const bekle = (ms) => new Promise((r) => setTimeout(r, ms));

async function al(url) {
  const { stdout } = await calistir(
    'curl',
    ['-sS', '--compressed', '--max-time', '25', '-A', UA, url],
    { maxBuffer: 16 * 1024 * 1024 }
  );
  return stdout;
}

const sadeles = (h) =>
  h.replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&apos;|&rsquo;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

function baslikCikar(html) {
  const m = html.match(/<title>([\s\S]*?)<\/title>/i);
  return m ? sadeles(m[1]).replace(/\s*\|\s*Listening.*$/i, '').trim() : '';
}

function sonrakiCikar(html, temel) {
  const m = html.match(
    /<a[^>]+href=["']([^"']*dictation[a-z0-9-]*\.php)["'][^>]*>\s*Next Dictation/i
  );
  if (!m) return '';
  const mutlak = new URL(m[1], temel).href;
  return SAYFA_RE.test(mutlak) ? mutlak : '';
}

function konulariCikar(html, temel) {
  const gorulen = new Set();
  const out = [];
  for (const m of html.matchAll(
    /<a[^>]+href=["']([^"']*dictations?-[a-z0-9-]+\.php)["'][^>]*>([\s\S]*?)<\/a>/gi
  )) {
    let mutlak;
    try { mutlak = new URL(m[1], temel).href; } catch { continue; }
    if (!SAYFA_RE.test(mutlak)) continue;
    if (/dictations-(short|medium|long)\.php$/i.test(mutlak)) continue;
    if (gorulen.has(mutlak)) continue;
    const baslik = sadeles(m[2]);
    if (!baslik) continue;
    gorulen.add(mutlak);
    out.push({ baslik, url: mutlak });
  }
  return out;
}

const katalog = [];
let toplamAlistirma = 0;

for (const s of SEVIYELER) {
  process.stdout.write(`\n${s.ad}: dizin okunuyor…\n`);
  const dizinHtml = await al(s.dizin);
  const konular = konulariCikar(dizinHtml, s.dizin);
  process.stdout.write(`  ${konular.length} konu\n`);

  /* ZINCIR KONU SINIRINDA DURMALI.
     Ileri seviyede konular birbirine zincirli: "Recorded Message"in
     sonraki baglantisi "Automated Recording" yani BASKA BIR KONU.
     Sinir konmadan her konu kendinden sonrakilerin hepsini topluyordu
     (10, 9, 8 ... 1 diye azalan sayilar bunun isaretiydi). Dizindeki
     adresler zaten "bunlar ayri konu" diyor; zincir oraya varinca
     bitiyor. */
  const dizindekiAdresler = new Set(konular.map((x) => x.url));

  const konuKayitlari = [];
  for (const k of konular) {
    const alistirmalar = [];
    const gorulen = new Set();
    let u = k.url;
    while (u && alistirmalar.length < 15 && !gorulen.has(u)) {
      gorulen.add(u);
      const html = await al(u);
      alistirmalar.push({ baslik: baslikCikar(html) || k.baslik, url: u });
      const sonraki = sonrakiCikar(html, u);
      u = dizindekiAdresler.has(sonraki) ? '' : sonraki;
      await bekle(250); /* siteyi yormamak icin */
    }
    toplamAlistirma += alistirmalar.length;
    konuKayitlari.push({ baslik: k.baslik, url: k.url, alistirmalar });
    process.stdout.write(`  ${k.baslik}: ${alistirmalar.length}\n`);
  }
  katalog.push({ id: s.id, ad: s.ad, konular: konuKayitlari });
}

const basliklar = [
  '/* DİKTE KATALOĞU — EnglishClub alıştırmalarının dizini',
  ' * ============================================================================',
  ' * ÜRETİLMİŞ DOSYA; elle düzenlenmez.',
  ' *   scripts/dikte-katalogu-uret.mjs',
  ' *',
  ' * NİYE GÖMÜLÜ: EnglishClub bir konunun alıştırmalarını tek yerde',
  ' * listelemiyor; her sayfa yalnızca bir sonrakine bağlı. Listeyi canlı',
  ' * çıkarmak konu başına zinciri yürümek demekti ve 10-15 saniye sürüyordu.',
  ' * Burada bir kez toplanmış hâli duruyor, liste anında açılıyor.',
  ' *',
  ' * YALNIZCA BAŞLIK VE ADRES var — ses ve cevap metni yok. Onlar alıştırma',
  ' * açıldığında kaynağından geliyor.',
  ' *',
  ` * Toplandığı tarih: ${new Date().toISOString().slice(0, 10)}`,
  ` * ${katalog.reduce((t, s) => t + s.konular.length, 0)} konu, ${toplamAlistirma} alıştırma.`,
  ' */',
  '',
  'export interface KatalogAlistirmasi {',
  '  baslik: string;',
  '  url: string;',
  '}',
  '',
  'export interface KatalogKonusu {',
  '  baslik: string;',
  '  url: string;',
  '  alistirmalar: KatalogAlistirmasi[];',
  '}',
  '',
  'export interface KatalogSeviyesi {',
  '  id: string;',
  '  ad: string;',
  '  konular: KatalogKonusu[];',
  '}',
  '',
  'export const DIKTE_KATALOGU: KatalogSeviyesi[] = ',
].join('\n');

const govde = JSON.stringify(katalog, null, 2) + ';\n';
fs.writeFileSync('apps/konusma/src/data/dikteKatalogu.ts', basliklar + govde, 'utf8');

process.stdout.write(
  `\nTOPLAM: ${katalog.reduce((t, s) => t + s.konular.length, 0)} konu, ${toplamAlistirma} alıştırma\n`
);
