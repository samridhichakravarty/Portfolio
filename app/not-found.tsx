import Link from '@/components/site/Link';
import { PageHead } from '@/components/site/PageHead';
import { SiteFooter } from '@/components/site/SiteFooter';

export default function NotFound() {
  return (
    <>
      <PageHead
        kicker="Error 404"
        title={<>This page <em>wandered off.</em></>}
        lede="The link may be old or mistyped. Here is where to go next."
        actions={<><Link className="s-btn" href="/">Back to the story</Link><Link className="s-btn s-btn--paper" href="/recruiters">Recruiter page</Link><Link className="s-btn s-btn--paper" href="/freelance">Freelance</Link><Link className="s-btn s-btn--paper" href="/play">Play a game</Link></>}
      />
      <SiteFooter />
    </>
  );
}
