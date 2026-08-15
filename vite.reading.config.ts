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
    emptyOutDir: true,
  },
  server: { port: 5173 },
});
