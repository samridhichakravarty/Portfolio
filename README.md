# Samridhi Chakravarty's portfolio

A Next.js portfolio with a two-film opening, a scroll-scrubbed scrapbook, a horizontal project gallery, an arcade career timeline, a draggable skills lab, and an email postcard.

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

The footage, stills, stickers, and résumé are in `public/media`. ScrollTrigger drives the paused video elements and seeks in either direction. Lenis smooths desktop wheel input. The five chapter clips use closely spaced keyframes and load near the viewport on desktop. Each clip hands off to an interactive HTML interface. Mobile and reduced-motion visitors get static chapter artwork. The postcard opens a draft in the default email app.

The project previews are interactive concepts and link to their corresponding repositories.
