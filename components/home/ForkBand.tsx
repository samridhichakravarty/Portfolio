import Link from '@/components/site/Link';
import { SITE } from '@/lib/site';

// Splits visitors into two clear lanes right after the opening: recruiters and project clients.
export default function ForkBand() {
  return (
    <section className="fork" aria-labelledby="fork-title">
      <div className="fork-inner">
        <p className="s-kicker">Work with me</p>
        <h2 id="fork-title" className="s-h2" style={{ marginTop: '1rem' }}>Hiring, or got a project? <em>Pick your lane.</em></h2>
        <div className="fork-grid">
          <article className="fork-card fork-card--pink">
            <p className="s-eyebrow">For recruiters</p>
            <h3 className="s-h3">Hiring a full-stack developer?</h3>
            <p>The 60-second snapshot: current role, stack, projects, résumé and a direct way to reach me. I am open to full-time roles.</p>
            <div className="s-row">
              <Link className="s-btn" href="/recruiters">See the snapshot →</Link>
              <a className="s-link" href={SITE.resume} download>Download résumé</a>
            </div>
          </article>
          <article className="fork-card fork-card--blue">
            <p className="s-eyebrow">For projects</p>
            <h3 className="s-h3">Got something to build?</h3>
            <p>Web apps, AI features, APIs and dashboards. Answer a few questions and send me a clear brief I can reply to.</p>
            <div className="s-row">
              <Link className="s-btn" href="/freelance/start">Start a project →</Link>
              <Link className="s-link" href="/freelance">See services</Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
