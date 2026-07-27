import { defineConfig } from 'vite';
import { resolve } from 'path';
import { existsSync, cpSync } from 'fs';

const root = resolve(__dirname);

// Los entregables se enlazan con <a href download> desde `presentaciones/descargas/`.
// Vite solo reescribe rutas de assets en <img src>, <link href> y CSS: el href de un
// <a> lo deja intacto. Por eso en `dev` funcionan (se sirve desde la raíz) pero en
// `build` no se copiarían a `dist`. Este plugin copia `presentaciones/assets` tal cual
// al terminar el build, de modo que cualquier enlace de descarga hacia esa carpeta
// —entregables o imágenes, como el diagrama BPMN— resuelva en el sitio publicado.
//
// Se excluye el material multimedia (audios .m4a, video .mp4 y .zip): supera los
// límites de GitHub (100 MB por archivo) y de GitHub Pages (1 GB por sitio), y por
// eso tampoco se versiona — ver .gitignore.
const MEDIA_EXCLUIDA = /(\.(m4a|mp4|zip)$|\.DS_Store$)/i;

function copyAssets(outDir) {
  return {
    name: 'copy-assets',
    apply: 'build',
    closeBundle() {
      const src = resolve(root, 'presentaciones', 'assets');
      if (!existsSync(src)) return;
      const dest = resolve(root, outDir, 'presentaciones', 'assets');
      cpSync(src, dest, {
        recursive: true,
        filter: (from) => !MEDIA_EXCLUIDA.test(from),
      });
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
    plugins: [copyAssets(outDir)],
    build: {
      outDir,
      emptyOutDir: true,
      rollupOptions: {
        input: {
          home: resolve(root, 'index.html'),
          procesos: resolve(root, 'presentaciones/procesos/index.html'),
          gobierno: resolve(root, 'presentaciones/gobierno/index.html'),
          recomendaciones: resolve(root, 'presentaciones/recomendaciones/index.html'),
          descargas: resolve(root, 'presentaciones/descargas/index.html'),
        },
      },
    },
    server: {
      open: true,
    },
  };
});
