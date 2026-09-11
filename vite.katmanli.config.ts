import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// Katmanlı İngilizce -> alt yol:  /katmanli/
export default defineConfig({
  /* Kokoro ses uretimi ayri bir Worker'da calisiyor ve o worker kokoro-js'i
     DINAMIK import ediyor (buyuk bir kutuphane, ilk acilista inmesin diye).
     Vite'in varsayilan worker bicimi IIFE ve kod bolme desteklemiyor:
     derleme "UMD and IIFE output formats are not supported for
     code-splitting builds" ile duruyordu. ES modulu bunu cozuyor. */
  worker: { format: "es" },
  root: path.resolve(__dirname, 'apps/katmanli'),
  base: '/katmanli/',
  envDir: __dirname,
  plugins: [react(), tailwindcss()],
  build: {
    outDir: path.resolve(__dirname, 'dist/katmanli'),
    // ÖNEMLİ: reading derlemesini silmesin
    emptyOutDir: false,
  },
  server: {
    port: 5174,
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
