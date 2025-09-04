import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  css: {
    devSourcemap: false
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  server: {
    port: 3000
  }
});