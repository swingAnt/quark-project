
// https://vitejs.dev/config/
import { defineConfig } from 'vite';
import * as path from 'path'
// import devtools from 'solid-devtools/vite';

export default defineConfig({
  plugins: [

  ],
  resolve:{
    alias:{
      '@':path.resolve(__dirname,'src')
    }

  },
  server: {
    port: 8000,
  },
  build: {
    target: 'esnext',
  },
});
