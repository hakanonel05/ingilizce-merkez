import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// Reading (Lexis Trainer) -> sitenin KÖKÜ:  /
export default defineConfig({
  root: path.resolve(__dirname, 'apps/reading'),
  base: '/',
  envDir: __dirname,
  plugins: [react(), tailwindcss()],
  publicDir: path.resolve(__dirname, 'apps/reading/public'),
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    // ÖNEMLİ: dist/katmanli/ alt klasörünü silmesin — reading ve katmanlı
    // aynı dist/ kökünü paylaşıyor, reading'i tek başına derlemek
    // katmanlı'nın çıktısını yok etmemeli (bkz. vite.katmanli.config.ts).
    emptyOutDir: false,
  },
  server: {
    port: 5173,
    /* /api ISTEKLERI API SUNUCUSUNA GIDER.

       Bu proxy yoktu ve sonucu suydu: vite /api/generate-quiz gibi bir
       yolu taniyip HTML hata sayfasi donuyordu, istemci de onu JSON diye
       ayristirmaya calisip
         Unexpected token (T), "The server is configured with..."
       hatasini veriyordu. Yani YEREL GELISTIRMEDE hicbir yapay zeka
       ozelligi calismiyordu; hata mesaji da sebebi gizliyordu.

       npm run dev:api ile server.ts 3000 portunda ayaga kalkar.
       Kapaliysa istekler ECONNREFUSED ile duser - bu dogru davranis,
       cunku HTML donmesindense acikca basarisiz olmasi yeglenir. */
    proxy: { "/api": { target: "http://localhost:3000", changeOrigin: true } },
  },
});
