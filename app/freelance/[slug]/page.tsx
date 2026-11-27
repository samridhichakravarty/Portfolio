import type { Metadata } from 'next';
import Link from '@/components/site/Link';
import { notFound } from 'next/navigation';
import { SERVICES, PROCESS } from '@/lib/site';
import { pageMeta } from '@/lib/seo';
import { breadcrumbLd, faqLd } from '@/lib/schema';
import { JsonLd } from '@/components/site/JsonLd';
import { PageHead } from '@/components/site/PageHead';
import { SiteFooter } from '@/components/site/SiteFooter';
import { AmbientVideo } from '@/components/site/AmbientVideo';

type Props = { params: Promise<{ slug: string }> };
const films = ['skills', 'about', 'experience', 'contact'] as const;

export function generateStaticParams() {
  return SERVICES.map(service => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find(item => item.slug === slug);
  if (!service) return {};
  return pageMeta({
    title: service.seoTitle,
    description: `${service.short} ${service.intro.split('. ')[0]}.`.slice(0, 158),
    path: `/freelance/${service.slug}`,
  });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const index = SERVICES.findIndex(item => item.slug === slug);
  const service = SERVICES[index];
  if (!service) notFound();
  const others = SERVICES.filter(item => item.slug !== service.slug);

  return (
    <>
      <JsonLd data={[
        breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Freelance', path: '/freelance' }, { name: service.title, path: `/freelance/${service.slug}` }]),
        faqLd(service.faqs),
      ]} />
      <PageHead
        kicker={`Freelance · ${service.title}`}
        title={service.seoTitle}
        lede={service.intro}
        actions={<><Link className="s-btn" href="/freelance/start">Start a project</Link><Link className="s-btn s-btn--paper" href="/freelance">All services</Link></>}
        aside={<AmbientVideo name={films[index % films.length] ?? 'skills'} label={`Animated preview for ${service.title}`} />}
      />
      <div className="s-page">
        <section aria-labelledby="get">
          <h2 id="get" className="s-h2">What you get</h2>
          <ul className="s-checks" style={{ marginTop: '1.2rem' }}>{service.deliverables.map(item => <li key={item}>{item}</li>)}</ul>
        </section>

        <section className="s-section" aria-labelledby="how">
          <h2 id="how" className="s-h2">How it works</h2>
          <ol className="s-steps" style={{ marginTop: '1.2rem' }}>
            {PROCESS.map(item => <li key={item.step}><h3 className="s-h3">{item.step}</h3><p style={{ marginTop: '.3rem' }}>{item.text}</p></li>)}
          </ol>
        </section>

        <section className="s-section s-faq" aria-labelledby="faq">
          <h2 id="faq" className="s-h2" style={{ marginBottom: '1.2rem' }}>Questions people ask</h2>
          {service.faqs.map(faq => <details key={faq.q}><summary>{faq.q}</summary><p>{faq.a}</p></details>)}
        </section>

        <section className="s-section" aria-labelledby="more">
          <h2 id="more" className="s-h2">Other things I build</h2>
          <div className="s-grid" style={{ marginTop: '1.2rem' }}>
            {others.map(item => (
              <Link key={item.slug} href={`/freelance/${item.slug}`} className="s-card">
                <h3 className="s-h3">{item.title}</h3>
                <p style={{ marginTop: '.5rem' }}>{item.short}</p>
              </Link>
            ))}
          </div>
        </section>

        <div className="s-card s-card--yellow s-stack" style={{ marginTop: '3.5rem' }}>
          <h2 className="s-h2">Want this for your project?</h2>
          <p className="s-lede">Send me a brief in two minutes and I will reply with questions, a scope and an estimate.</p>
          <div className="s-row"><Link className="s-btn s-btn--ink" href="/freelance/start">Start the Build Quest</Link></div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
