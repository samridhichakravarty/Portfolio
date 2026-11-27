import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/dm-sans';
import './globals.css';
import './chapters.css';
import './site.css';
import { SITE } from '@/lib/site';
import { personLd, serviceLd, websiteLd } from '@/lib/schema';
import { JsonLd } from '@/components/site/JsonLd';
import SiteExtras from '@/components/site/SiteExtras';
import ChapterNav from './chapter-nav';
import Magnetic from './magnetic';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  keywords: [...SITE.keywords],
  alternates: { canonical: '/' },
  openGraph: { type: 'website', locale: 'en_IN', url: '/', siteName: SITE.name, title: SITE.title, description: SITE.description },
  twitter: { card: 'summary_large_image', title: SITE.title, description: SITE.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  icons: { icon: '/media/wink.webp' },
  category: 'technology',
};

export const viewport: Viewport = { themeColor: '#ff85bd', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <JsonLd data={[websiteLd(), personLd(), serviceLd()]} />
        <ChapterNav />
        <Magnetic />
        <SiteExtras />
        <main id="main" tabIndex={-1}>{children}</main>
      </body>
    </html>
  );
}
