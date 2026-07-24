import { defineConfig } from 'vite';
import { resolve } from 'path';
import { existsSync, cpSync } from 'fs';

const root = resolve(__dirname);

// Presentaciones que se compilan como páginas independientes.
const decks = ['procesos', 'gobierno', 'recomendaciones'];

// Los archivos de `presentaciones/<deck>/fuentes` se enlazan con <a href> desde
// el slide de Preguntas. Vite no procesa esos enlaces (no son assets JS/CSS ni
// <img>), por lo que en `dev` funcionan (sirve desde la raíz) pero en `build`
// no se copiarían a `dist`. Este plugin los copia tal cual al terminar el build.
function copyFuentes(outDir) {
  return {
    name: 'copy-fuentes',
    apply: 'build',
    closeBundle() {
      for (const deck of decks) {
        const src = resolve(root, 'presentaciones', deck, 'fuentes');
        if (!existsSync(src)) continue;
        const dest = resolve(root, outDir, 'presentaciones', deck, 'fuentes');
        cpSync(src, dest, { recursive: true });
      }
    },
  };
}

// En build usamos la subruta del repo para GitHub Pages
// (https://rolo1410.github.io/subastar-consultoria/). En dev, raíz "/".
export default defineConfig(({ command }) => {
  const outDir = 'dist';
  return {
    base: command === 'build' ? '/subastar-consultoria/' : '/',
    root,
    plugins: [copyFuentes(outDir)],
    build: {
      outDir,
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
  };
});
