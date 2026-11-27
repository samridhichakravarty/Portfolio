import { pageMeta } from '@/lib/seo';
import Link from '@/components/site/Link';
import { SITE } from '@/lib/site';
import { PROJECTS, EXPERIENCE, EDUCATION, SKILL_GROUPS, SKILL_PROOF } from '@/lib/data';
import { breadcrumbLd } from '@/lib/schema';
import { JsonLd } from '@/components/site/JsonLd';
import { CollectOnMount } from '@/components/site/CollectOnMount';
import { PageHead } from '@/components/site/PageHead';
import { SiteFooter } from '@/components/site/SiteFooter';
import { RoleBrief } from '@/components/pages/RoleBrief';

export const metadata = pageMeta({
  title: 'Full-Stack Developer Résumé and Contact, Jaipur',
  description: 'Recruiter snapshot for Samridhi Chakravarty: full-stack developer in Jaipur, open to full-time roles. Experience, projects, skills, résumé PDF and direct contact.',
  path: '/recruiters',
});

export default function RecruitersPage() {
  return (
    <>
      <CollectOnMount id="recruiter" />
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Recruiters', path: '/recruiters' }])} />
      <PageHead
        kicker="For recruiters"
        title={<>Full-stack developer. <em>Open to full-time roles.</em></>}
        lede={<>I'm Samridhi Chakravarty in {SITE.city}, India. I build web apps, AI features and the backends behind them. Here is everything you need in one minute.</>}
        actions={
          <>
            <a className="s-btn" href={`mailto:${SITE.email}?subject=${encodeURIComponent('Full-stack developer role')}`}>Email me</a>
            <a className="s-btn s-btn--paper" href={SITE.resume} download>Download résumé (PDF)</a>
            <a className="s-btn s-btn--paper" href={SITE.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <a className="s-btn s-btn--paper" href={SITE.github} target="_blank" rel="noreferrer">GitHub</a>
          </>
        }
      />
      <div className="s-page">
        <section aria-labelledby="glance">
          <h2 id="glance" className="s-h2">At a glance</h2>
          <dl className="facts" style={{ marginTop: '1.2rem' }}>
            <div><dt>Open to</dt><dd>Full-time roles. Also freelance projects.</dd></div>
            <div><dt>Target role</dt><dd>Full-stack developer</dd></div>
            <div><dt>Current role</dt><dd>Forward Deployment Engineer and AI Engineer, Atlass Partners (since May 2026)</dd></div>
            <div><dt>Location</dt><dd>{SITE.city}, India (IST, UTC+5:30)</dd></div>
            <div><dt>Core stack</dt><dd>JavaScript, TypeScript, Python, React, Next.js, Node.js, MongoDB, MySQL, Supabase</dd></div>
            <div><dt>Education</dt><dd>{EDUCATION.degree}, {EDUCATION.school}, {EDUCATION.dates}</dd></div>
            <div><dt>Contact</dt><dd><a className="s-link" href={`mailto:${SITE.email}`}>{SITE.email}</a></dd></div>
          </dl>
        </section>

        <section className="s-section" aria-labelledby="exp">
          <h2 id="exp" className="s-h2">Experience</h2>
          <div className="xp" style={{ marginTop: '1.2rem' }}>
            {EXPERIENCE.map(role => (
              <article key={`${role.org}-${role.title}`}>
                <header><h3 className="s-h3">{role.title}, {role.org}</h3><span className="s-chip">{role.dates}</span></header>
                <ul>{role.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>

        <section className="s-section" aria-labelledby="projects">
          <h2 id="projects" className="s-h2">Projects</h2>
          <div className="s-grid" style={{ marginTop: '1.2rem' }}>
            {PROJECTS.map(project => (
              <article key={project.slug} className={'s-card s-stack ' + (project.tone === 'pink' ? 's-card--pink' : 's-card--blue')}>
                <h3 className="s-h3">{project.title}</h3>
                <p>{project.description}</p>
                <ul className="s-row" style={{ listStyle: 'none', padding: 0 }} aria-label="Technologies">{project.stack.map(tech => <li key={tech} className="s-chip">{tech}</li>)}</ul>
                <div className="s-row">
                  <Link className="s-btn s-btn--paper" href={`/work/${project.slug}`}>Case study</Link>
                  <a className="s-link" href={project.repo} target="_blank" rel="noreferrer">Source code</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="s-section" aria-labelledby="skills">
          <h2 id="skills" className="s-h2">Skills, with where I used them</h2>
          <table className="skill-table" style={{ marginTop: '1.2rem' }}>
            <tbody>
              {SKILL_GROUPS.map(group => (
                <tr key={group.name}>
                  <th scope="row">{group.name}</th>
                  <td>{group.items.map(item => <div key={item}><b>{item}</b>: {SKILL_PROOF[item]?.text ?? ''}</div>)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="s-section" aria-labelledby="role">
          <h2 id="role" className="s-h2">Share the role</h2>
          <p className="s-lede" style={{ margin: '.8rem 0 1.2rem' }}>Fill in what you can. It builds a short, direct email to me with the details I need to reply.</p>
          <RoleBrief />
        </section>

        <p className="s-muted no-print" style={{ marginTop: '3rem' }}>
          Also available for freelance projects: <Link className="s-link" href="/freelance">see what I build</Link>. Curious how I build interactive UI? <Link className="s-link" href="/play">Play the games</Link>.
        </p>
      </div>
      <SiteFooter />
    </>
  );
}
