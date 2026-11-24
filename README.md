# Samridhi Chakravarty's portfolio

A Next.js portfolio with two scroll-scrubbed opening films, interactive project concepts, an experience timeline, a draggable skills section, and a downloadable résumé.

## Run locally

Use Node.js 20.9 or newer.

```sh
npm ci
npm run dev
```

Open http://localhost:3000.

## Build and serve

```sh
npm run build
npm start
```

The build exports the site to `out/`. Open http://127.0.0.1:3000 after starting the local server.

To deploy, publish the contents of `out/` to the root of a static host that supports byte-range requests for MP4 files.

The footage, stills, stickers, and résumé are in `public/media`. ScrollTrigger drives the paused video elements and seeks in either direction. Lenis smooths desktop wheel input. The reduced-motion and no-JavaScript layouts display stills from both clips.

The project previews are interactive concepts and link to their corresponding repositories.
