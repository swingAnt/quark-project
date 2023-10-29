
// https://vitejs.dev/config/
import { defineConfig } from 'vite';
import * as path from 'path'


export default defineConfig({
  plugins: [
  ],
  resolve:{
    alias:{
      '@':path.resolve(__dirname,'src')
    }

  },
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
