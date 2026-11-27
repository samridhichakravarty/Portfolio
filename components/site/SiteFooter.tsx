import Link from '@/components/site/Link';
import { SITE, SERVICES } from '@/lib/site';
import { PROJECTS } from '@/lib/data';

export function SiteFooter() {
  return (
    <footer className="s-footer">
      <div className="s-footer-inner">
        <div>
          <p className="s-footer-brand">samridhi<span>.</span></p>
          <p>Full-stack developer in {SITE.city}, India. {SITE.status}.</p>
          <p><a className="s-link" href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
        </div>
        <nav aria-label="Hire me">
          <p className="s-foot-title">Hire me</p>
          <ul>
            <li><Link href="/recruiters">For recruiters</Link></li>
            <li><Link href="/freelance/start">Start a project</Link></li>
            <li><a href={SITE.resume} download>Résumé (PDF)</a></li>
          </ul>
        </nav>
        <nav aria-label="Freelance services">
          <p className="s-foot-title">Freelance</p>
          <ul>
            {SERVICES.map(service => <li key={service.slug}><Link href={`/freelance/${service.slug}`}>{service.title}</Link></li>)}
          </ul>
        </nav>
        <nav aria-label="More">
          <p className="s-foot-title">More</p>
          <ul>
            {PROJECTS.map(project => <li key={project.slug}><Link href={`/work/${project.slug}`}>{project.title}</Link></li>)}
            <li><Link href="/about">About</Link></li>
            <li><Link href="/play">Play</Link></li>
            <li><a href={SITE.github} target="_blank" rel="noreferrer">GitHub</a></li>
            <li><a href={SITE.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
          </ul>
        </nav>
      </div>
      <div className="s-footer-bottom">
        <span>© {new Date().getFullYear()} {SITE.name} · {SITE.city}, India</span>
        <Link href="/">Back to the story</Link>
      </div>
    </footer>
  );
}
