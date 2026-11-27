import type { Metadata } from 'next';
import Link from '@/components/site/Link';
import { notFound } from 'next/navigation';
import { PROJECTS } from '@/lib/data';
import { SERVICES } from '@/lib/site';
import { pageMeta } from '@/lib/seo';
import { breadcrumbLd } from '@/lib/schema';
import { JsonLd } from '@/components/site/JsonLd';
import { CollectOnMount } from '@/components/site/CollectOnMount';
import { PageHead } from '@/components/site/PageHead';
import { SiteFooter } from '@/components/site/SiteFooter';
import { AmbientVideo } from '@/components/site/AmbientVideo';

type Props = { params: Promise<{ slug: string }> };
const related: Record<string, string[]> = {
  'enterprise-web-platform': ['web-apps', 'ai-features', 'sites-dashboards'],
  'real-time-chat-application': ['apis-backends', 'web-apps'],
};

export function generateStaticParams() {
  return PROJECTS.map(project => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find(item => item.slug === slug);
  if (!project) return {};
  const title = `${project.title}: ${project.category} Case Study`;
  return pageMeta({ title, description: project.summary, path: `/work/${project.slug}` });
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const project = PROJECTS.find(item => item.slug === slug);
  if (!project) notFound();
  const next = PROJECTS.find(item => item.slug !== project.slug);
  const services = SERVICES.filter(service => (related[project.slug] ?? []).includes(service.slug));

  return (
    <>
      <CollectOnMount id="case" />
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Work', path: '/#work' }, { name: project.title, path: `/work/${project.slug}` }])} />
      <PageHead
        kicker={`Case study ${project.number} · ${project.category}`}
        title={project.title}
        lede={project.description}
        actions={<><a className="s-btn" href={project.repo} target="_blank" rel="noreferrer">View the code ↗</a><Link className="s-btn s-btn--paper" href="/freelance/start">Build something similar</Link></>}
        aside={<AmbientVideo name="work" label={`Animated preview of the ${project.title} project`} />}
      />
      <div className="s-page">
        <section aria-labelledby="does">
          <h2 id="does" className="s-h2">What it does</h2>
          <ul className="s-checks" style={{ marginTop: '1.2rem' }}>{project.highlights.map(item => <li key={item}>{item}</li>)}</ul>
        </section>
        <section className="s-section" aria-labelledby="stack">
          <h2 id="stack" className="s-h2">Built with</h2>
          <ul className="s-row" style={{ listStyle: 'none', padding: 0, marginTop: '1.2rem' }}>{project.stack.map(tech => <li key={tech} className="s-chip" style={{ fontSize: '1rem' }}>{tech}</li>)}</ul>
        </section>
        {services.length > 0 && (
          <section className="s-section" aria-labelledby="hire">
            <h2 id="hire" className="s-h2">Need something like this?</h2>
            <div className="s-grid" style={{ marginTop: '1.2rem' }}>
              {services.map(service => (
                <Link key={service.slug} href={`/freelance/${service.slug}`} className="s-card">
                  <h3 className="s-h3">{service.title}</h3>
                  <p style={{ marginTop: '.5rem' }}>{service.short}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
        <div className="s-row" style={{ marginTop: '3rem' }}>
          {next && <Link className="s-btn s-btn--paper" href={`/work/${next.slug}`}>Next: {next.title} →</Link>}
          <Link className="s-btn s-btn--paper" href="/recruiters">Recruiter snapshot</Link>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
