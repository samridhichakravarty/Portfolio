# Samridhi Chakravarty, portfolio

"Ship It!", a playful portfolio for a freelance full-stack developer in Jaipur, India. Built with Next.js 16, React 19, Tailwind CSS v4 and Framer Motion.

## What is in it

- Home, About, Services (3 pages), Work case studies (2 pages), Hire page with a project brief builder, and a Play page.
- Mini games (Ship It!, Bug Pop, Stack Match), a skill capsule machine and a 12-sticker album, all optional.
- SEO: per-page metadata and canonical URLs, JSON-LD (Person, ProfessionalService, FAQ, breadcrumbs), sitemap, robots, web manifest and a generated social image.
- Accessibility: skip link, keyboard-playable games, calm mode (stops decorative motion) and full reduced-motion support.

## Run it

Use Node.js 20.9 or newer.

```sh
npm install
npm run dev
```

Open http://localhost:3000.

```sh
npm run typecheck
npm run build
npm start
```

## Configure

Site facts (name, email, links, services) live in `lib/site.ts`. Projects, journey and skills live in `lib/data.ts`.
Set `NEXT_PUBLIC_SITE_URL` to the final domain (for example `https://example.com`) so canonical URLs, the sitemap and structured data use it.

## Deploy

Deploy to Vercel. For search engines to index the site, make sure Deployment Protection is turned off for the production domain.
