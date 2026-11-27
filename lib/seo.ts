import type { Metadata } from 'next';
import { SITE } from './site';

const image = { url: '/opengraph-image.png', width: 1200, height: 630, alt: `${SITE.name}, full-stack developer in ${SITE.city}` };

// Per-page metadata with the share image included. A page's own openGraph replaces the layout's,
// so the image has to be repeated here or sub-pages would lose it.
export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const shown = `${title} | ${SITE.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: 'website', locale: 'en_IN', siteName: SITE.name, url: path, title: shown, description, images: [image] },
    twitter: { card: 'summary_large_image', title: shown, description, images: [image.url] },
  };
}
