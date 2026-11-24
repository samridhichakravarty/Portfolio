import type { Metadata } from 'next';
import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/dm-sans';
import './globals.css';

export const metadata: Metadata = {
  title: 'Samridhi Chakravarty | Developer Portfolio',
  description: 'Samridhi Chakravarty builds full-stack web applications and studies AI and Data Science in Jaipur.',
  icons: { icon: '/media/wink.webp' },
};

export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}</body></html>;
}
