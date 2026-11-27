import NextLink from 'next/link';
import type { ComponentProps } from 'react';

// Static-export hosts do not serve Next's per-segment prefetch files, so prefetching only produces 404s.
// Pages still navigate normally; they just load when clicked.
export default function Link(props: ComponentProps<typeof NextLink>) {
  return <NextLink prefetch={false} {...props} />;
}
