import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// Katmanlı İngilizce -> alt yol:  /katmanli/
export default defineConfig({
  root: path.resolve(__dirname, 'apps/katmanli'),
  base: '/katmanli/',
  envDir: __dirname,
  plugins: [react(), tailwindcss()],
  build: {
    outDir: path.resolve(__dirname, 'dist/katmanli'),
    // ÖNEMLİ: reading derlemesini silmesin
    emptyOutDir: false,
  },
  server: { port: 5174 },
});
