import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const root = path.resolve(process.cwd());
const uiDist = path.resolve(root, 'ui-dist');

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: uiDist,
    emptyOutDir: false,
    rollupOptions: {
      input: {
        editor: path.resolve(root, 'editor/editor.html')
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  }
});
