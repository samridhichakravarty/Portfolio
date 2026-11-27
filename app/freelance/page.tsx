import { pageMeta } from '@/lib/seo';
import Link from '@/components/site/Link';
import { SERVICES, PROCESS } from '@/lib/site';
import { PROJECTS } from '@/lib/data';
import { breadcrumbLd } from '@/lib/schema';
import { JsonLd } from '@/components/site/JsonLd';
import { PageHead } from '@/components/site/PageHead';
import { SiteFooter } from '@/components/site/SiteFooter';
import { AmbientVideo } from '@/components/site/AmbientVideo';

export const metadata = pageMeta({
  title: 'Freelance Full-Stack Developer: Web Apps, AI, APIs',
  description: 'Hire a freelance full-stack developer in Jaipur, India. I build web apps, AI features, APIs, backends, websites and dashboards, and pick the stack that fits the job.',
  path: '/freelance',
});

export default function FreelancePage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Freelance', path: '/freelance' }])} />
      <PageHead
        kicker="Freelance"
        title={<>I build <em>what you need.</em></>}
        lede="Web apps, AI features, APIs, backends and dashboards. I pick the stack that fits the job, and I work with startups and growing teams in India and remotely."
        actions={
          <>
            <Link className="s-btn" href="/freelance/start">Start a project</Link>
            <Link className="s-btn s-btn--paper" href="/#work">See my work</Link>
          </>
        }
        aside={<AmbientVideo name="work" label="Animated preview of the project gallery" />}
      />
      <div className="s-page">
        <section aria-labelledby="builds">
          <h2 id="builds" className="s-h2">What I build</h2>
          <div className="s-grid" style={{ marginTop: '1.2rem' }}>
            {SERVICES.map((service, index) => (
              <Link key={service.slug} href={`/freelance/${service.slug}`} className={'s-card ' + ['s-card--pink', 's-card--blue', 's-card--yellow', 's-card--lav'][index % 4]}>
                <h3 className="s-h3">{service.title}</h3>
                <p style={{ marginTop: '.6rem' }}>{service.short}</p>
                <p className="s-link" style={{ marginTop: '.9rem' }}>Details →</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="s-section" aria-labelledby="how">
          <h2 id="how" className="s-h2">How it works</h2>
          <ol className="s-steps" style={{ marginTop: '1.2rem' }}>
            {PROCESS.map(item => (
              <li key={item.step}><h3 className="s-h3">{item.step}</h3><p style={{ marginTop: '.3rem' }}>{item.text}</p></li>
            ))}
          </ol>
        </section>

        <section className="s-section" aria-labelledby="proof">
          <h2 id="proof" className="s-h2">Recent work</h2>
          <div className="s-grid" style={{ marginTop: '1.2rem' }}>
            {PROJECTS.map(project => (
              <Link key={project.slug} href={`/work/${project.slug}`} className="s-card">
                <p className="s-eyebrow">{project.category}</p>
                <h3 className="s-h3" style={{ margin: '.4rem 0' }}>{project.title}</h3>
                <p>{project.summary}</p>
              </Link>
            ))}
          </div>
        </section>

        <div className="s-card s-card--yellow s-stack" style={{ marginTop: '3.5rem' }}>
          <h2 className="s-h2">Have something to build?</h2>
          <p className="s-lede">Answer a few questions in the Build Quest. You get a size estimate, the questions I will ask next, and a ready-to-send brief.</p>
          <div className="s-row"><Link className="s-btn s-btn--ink" href="/freelance/start">Start the Build Quest</Link></div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
