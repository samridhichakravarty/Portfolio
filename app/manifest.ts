import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.short,
    description: SITE.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#fff9f1',
    theme_color: '#ff85bd',
    icons: [{ src: '/media/wink.webp', sizes: '512x512', type: 'image/webp' }],
  };
}
