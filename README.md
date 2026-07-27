# Presentaciones GIZ

Sitio de la consultoría GIZ/Subastar construido con [reveal.js](https://revealjs.com/)
y [Vite](https://vite.dev/).

Incluye 3 presentaciones independientes y una página de descargas:

- **Procesos** — `presentaciones/procesos/`
- **Gobierno** — `presentaciones/gobierno/`
- **Recomendaciones** — `presentaciones/recomendaciones/`
- **Descargas** — `presentaciones/descargas/` (informes y entregables)

## Requisitos

- Node.js 18+ (probado con v22)

## Comandos

```bash
npm run dev       # servidor de desarrollo con recarga en vivo
npm run build     # genera la versión estática en dist/
npm run preview   # sirve la versión de dist/
```

Al iniciar `npm run dev` se abre la página de inicio con enlaces a las
presentaciones. También puedes ir directo a una:

- http://localhost:5173/presentaciones/procesos/
- http://localhost:5173/presentaciones/gobierno/
- http://localhost:5173/presentaciones/recomendaciones/
- http://localhost:5173/presentaciones/descargas/

## Estructura

```
.
├── index.html                    # página de inicio (selector)
├── vite.config.js                # build multipágina
├── src/
│   ├── init.js                   # inicialización compartida de Reveal.js
│   ├── theme.css                 # estilos compartidos de las presentaciones
│   ├── descargas.js              # entrada de la página de descargas
│   └── *.js / *.css              # módulos de UI (navegación, láser, lupa, modales…)
└── presentaciones/
    ├── procesos/index.html
    ├── gobierno/index.html
    ├── recomendaciones/index.html
    ├── descargas/index.html
    └── assets/
        ├── images/               # imágenes de las presentaciones
        └── entregables/          # documentos que se ofrecen en Descargas
```

## Editar una presentación

Cada presentación es un `index.html` con secciones `<section>` dentro de
`.reveal > .slides`. Añade o edita slides ahí. Los plugins de Markdown,
resaltado de código y notas del ponente ya están activos.

## Entregables y descargas

Los archivos que ofrece la página de Descargas viven en
`presentaciones/assets/entregables/`. Para añadir uno, colócalo ahí y enlázalo
desde `presentaciones/descargas/index.html` con `<a href="..." download>`.

Vite solo reescribe rutas de assets en `<img src>`, `<link href>` y CSS; el
`href` de un `<a>` lo deja intacto. Por eso `vite.config.js` incluye el plugin
`copy-assets`, que copia `presentaciones/assets/` tal cual a `dist/` al terminar
el build.

**Material multimedia:** las grabaciones de entrevistas (`.m4a`), el video de la
reunión (`.mp4`) y los `.zip` no se versionan ni se publican — superan el límite
de 100 MB por archivo de GitHub y el de 1 GB por sitio de GitHub Pages. Están
excluidos en `.gitignore` y filtrados en el plugin de copia. Las fotos y videos
de campo se enlazan desde la página de Descargas hacia Google Drive; el resto se
entrega por canal aparte.

## Despliegue

Cada push a `main` dispara el workflow `.github/workflows` que ejecuta
`npm ci && npm run build` y publica `dist/` en GitHub Pages. En build, `base` es
`/subastar-consultoria/` (la subruta del repo); en dev es `/`.
