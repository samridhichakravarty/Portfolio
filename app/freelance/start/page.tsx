import { pageMeta } from '@/lib/seo';
import Link from '@/components/site/Link';
import { breadcrumbLd } from '@/lib/schema';
import { JsonLd } from '@/components/site/JsonLd';
import { PageHead } from '@/components/site/PageHead';
import { SiteFooter } from '@/components/site/SiteFooter';
import { AmbientVideo } from '@/components/site/AmbientVideo';
import { BuildQuest } from '@/components/pages/BuildQuest';

export const metadata = pageMeta({
  title: 'Start a Project: Build Quest and Free Brief',
  description: 'Describe your project in two minutes: pick what to build, add features, set the pace and get a size estimate plus a ready-to-send brief for a freelance full-stack developer.',
  path: '/freelance/start',
});

export default function StartPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Freelance', path: '/freelance' }, { name: 'Start a project', path: '/freelance/start' }])} />
      <PageHead
        kicker="Build Quest"
        title={<>Scope your project <em>in two minutes.</em></>}
        lede="Four quick levels: pick what to build, add features, set the pace. You get a size estimate, the questions I will ask next, and a ready-to-send brief."
        aside={<AmbientVideo name="contact" label="Animated preview of a delivered brief" />}
      />
      <div className="s-page">
        <BuildQuest />
        <p className="s-muted" style={{ marginTop: '2.5rem' }}>
          Prefer to just talk? <Link className="s-link" href="/freelance">See what I build</Link> or email me directly from the footer. Hiring for a full-time role? <Link className="s-link" href="/recruiters">Recruiter page</Link>.
        </p>
      </div>
      <SiteFooter />
    </>
  );
}
