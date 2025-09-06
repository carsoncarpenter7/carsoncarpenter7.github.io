import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  },
  css: {
    devSourcemap: false
  },
  server: {
    port: 3000
  }
});