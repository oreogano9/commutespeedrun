import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const root = path.resolve(process.cwd());

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': '"production"',
    process: '{"env":{"NODE_ENV":"production"}}'
  },
  build: {
    outDir: path.resolve(root, 'ui-dist/content-overlay'),
    emptyOutDir: false,
    cssCodeSplit: false,
    lib: {
      entry: path.resolve(root, 'ui-src/content-overlay/main.jsx'),
      name: 'TimestampChatterReactOverlayBundle',
      formats: ['iife'],
      fileName: () => 'content-overlay.js',
      cssFileName: 'content-overlay'
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    }
  }
});
