import { pageMeta } from '@/lib/seo';
import Link from '@/components/site/Link';
import { breadcrumbLd } from '@/lib/schema';
import { JsonLd } from '@/components/site/JsonLd';
import { PageHead } from '@/components/site/PageHead';
import { SiteFooter } from '@/components/site/SiteFooter';
import { AlbumGrid } from '@/components/games/AlbumGrid';
import { Games } from '@/components/games/LazyGames';

export const metadata = pageMeta({
  title: 'Play: Games That Show How I Build',
  description: 'Four small games with a point: dodge real project risks, match client needs to tools, meet my skills with proof, and collect 12 stickers.',
  path: '/play',
});

export default function PlayPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Play', path: '/play' }])} />
      <PageHead
        kicker="Playground"
        title={<>Games that show <em>how I build.</em></>}
        lede="Four small games, each with something real behind it: how I handle project risks, which tool solves which problem, and where I used each skill. Optional and skippable."
        actions={<><Link className="s-btn" href="/freelance/start">Start a project</Link><Link className="s-btn s-btn--paper" href="/recruiters">Recruiter page</Link></>}
      />
      <div className="s-page s-stack" style={{ gap: '3rem' }}>
        <Games />
        <section id="album" aria-labelledby="album-title" style={{ scrollMarginTop: 'calc(var(--nav-height) + 1rem)' }}>
          <h2 id="album-title" className="s-h2">Sticker album</h2>
          <AlbumGrid />
        </section>
      </div>
      <SiteFooter />
    </>
  );
}
