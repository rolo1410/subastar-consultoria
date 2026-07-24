# Presentaciones GIZ

Proyecto de presentaciones construido con [reveal.js](https://revealjs.com/) y [Vite](https://vite.dev/).

Incluye 3 presentaciones independientes:

- **Procesos** — `presentaciones/procesos/`
- **Gobierno** — `presentaciones/gobierno/`
- **Recomendaciones** — `presentaciones/recomendaciones/`

## Requisitos

- Node.js 18+ (probado con v22)

## Comandos

```bash
npm run dev       # servidor de desarrollo con recarga en vivo
npm run build     # genera la versión estática en dist/
npm run preview   # sirve la versión de dist/
```

Al iniciar `npm run dev` se abre la página de inicio con enlaces a las tres
presentaciones. También puedes ir directo a una:

- http://localhost:5173/presentaciones/procesos/
- http://localhost:5173/presentaciones/gobierno/
- http://localhost:5173/presentaciones/recomendaciones/

## Estructura

```
.
├── index.html                    # página de inicio (selector)
├── vite.config.js                # build multipágina
├── src/
│   ├── init.js                   # inicialización compartida de Reveal.js
│   └── theme.css                 # estilos compartidos
└── presentaciones/
    ├── procesos/index.html
    ├── gobierno/index.html
    └── recomendaciones/index.html
```

## Editar una presentación

Cada presentación es un `index.html` con secciones `<section>` dentro de
`.reveal > .slides`. Añade o edita slides ahí. Los plugins de Markdown,
resaltado de código y notas del ponente ya están activos.
