import { defineConfig } from 'vite';
import { resolve } from 'path';

const root = resolve(__dirname);

// En build usamos la subruta del repo para GitHub Pages
// (https://rolo1410.github.io/subastar-consultoria/). En dev, raíz "/".
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/subastar-consultoria/' : '/',
  root,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        home: resolve(root, 'index.html'),
        procesos: resolve(root, 'presentaciones/procesos/index.html'),
        gobierno: resolve(root, 'presentaciones/gobierno/index.html'),
        recomendaciones: resolve(root, 'presentaciones/recomendaciones/index.html'),
      },
    },
  },
  server: {
    open: true,
  },
}));
