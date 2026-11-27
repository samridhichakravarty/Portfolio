import { pageMeta } from '@/lib/seo';
import Link from '@/components/site/Link';
import { SITE } from '@/lib/site';
import { ABOUT, EXPERIENCE, EDUCATION } from '@/lib/data';
import { breadcrumbLd } from '@/lib/schema';
import { JsonLd } from '@/components/site/JsonLd';
import { PageHead } from '@/components/site/PageHead';
import { SiteFooter } from '@/components/site/SiteFooter';

export const metadata = pageMeta({
  title: 'About Samridhi, Full-Stack Developer in Jaipur',
  description: 'Samridhi Chakravarty is a full-stack developer in Jaipur: AI and Data Science student, Forward Deployment Engineer, open to full-time roles and freelance projects.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])} />
      <PageHead
        kicker="About me"
        title={<>Hi, I'm <em>Samridhi.</em></>}
        lede={ABOUT.lead}
        actions={<><Link className="s-btn" href="/recruiters">I'm hiring</Link><Link className="s-btn s-btn--paper" href="/freelance/start">I have a project</Link></>}
        aside={<img src={SITE.portrait} alt="Samridhi wearing pink sunglasses against a blue sky" width={960} height={1050} style={{ width: '100%', maxWidth: '24rem', justifySelf: 'center', border: 'var(--line)', borderRadius: 20, boxShadow: '6px 7px var(--ink)', transform: 'rotate(-2deg)', background: '#fff' }} />}
      />
      <div className="s-page">
        <section aria-labelledby="story">
          <h2 id="story" className="s-h2">What I do</h2>
          <p className="s-lede" style={{ marginTop: '1rem' }}>{ABOUT.body}</p>
        </section>
        <section className="s-section" aria-labelledby="path">
          <h2 id="path" className="s-h2">Where I have worked and studied</h2>
          <div className="xp" style={{ marginTop: '1.2rem' }}>
            {EXPERIENCE.map(role => (
              <article key={`${role.org}-${role.title}`}>
                <header><h3 className="s-h3">{role.title}, {role.org}</h3><span className="s-chip">{role.dates}</span></header>
                <ul>{role.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>
              </article>
            ))}
            <article>
              <header><h3 className="s-h3">{EDUCATION.degree}, {EDUCATION.school}</h3><span className="s-chip">{EDUCATION.dates}</span></header>
            </article>
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}
