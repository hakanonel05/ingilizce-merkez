import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// Konuşma (görsel betimleme) -> alt yol:  /konusma/
export default defineConfig({
  /* Whisper cozumlemesi ayri bir Worker'da calisiyor ve o worker
     @huggingface/transformers'i DINAMIK import ediyor (buyuk bir kutuphane,
     ilk acilista inmesin diye). Vite'in varsayilan worker bicimi IIFE ve kod
     bolme desteklemiyor: derleme "UMD and IIFE output formats are not
     supported for code-splitting builds" ile duruyor. ES modulu bunu cozuyor.
     Ayni ayar reading ve katmanli yapilandirmalarinda da var. */
  worker: { format: "es" },
  /* BAGIMLILIK ONBELLEGI AYRI.

     Vite'in varsayilan onbellek dizini node_modules/.vite ve uc yapilandirma
     da ayni node_modules'u gosteriyor. Paylasildiginda su oluyor: konusma
     sunucusu acilinca vite "config degisti" deyip onbellegi bastan kuruyor,
     tarayici da elindeki eski modulleri isteyince 504 (Outdated Optimize Dep)
     aliyor ve sayfa BOS aciliyor. Olctum: ilk acilista tam olarak bu oldu.

     Ayri dizin bunu kokten kesiyor - konusma kendi onbellegine bakiyor,
     digerlerininkine dokunmuyor. (reading ve katmanli hala ayni dizini
     paylasiyor; aralarinda gecis yapmak ayni 504'u uretebiliyor.) */
  cacheDir: path.resolve(__dirname, 'node_modules/.vite-konusma'),
  root: path.resolve(__dirname, 'apps/konusma'),
  base: '/konusma/',
  envDir: __dirname,
  plugins: [react(), tailwindcss()],
  build: {
    outDir: path.resolve(__dirname, 'dist/konusma'),
    // ÖNEMLİ: reading ve katmanlı derlemelerini silmesin — üçü aynı dist/
    // kökünü paylaşıyor (bkz. vite.reading.config.ts).
    emptyOutDir: false,
  },
  server: {
    port: 5175,
    /* /api ISTEKLERI API SUNUCUSUNA GIDER.
       npm run dev:api ile server.ts 3000 portunda ayaga kalkar. Kapaliysa
       istekler ECONNREFUSED ile duser - bu dogru davranis, cunku vite'in
       HTML hata sayfasini JSON diye ayristirmaya calismaktansa acikca
       basarisiz olmasi yeglenir. */
    proxy: { "/api": { target: "http://localhost:3000", changeOrigin: true } },
  },
});
