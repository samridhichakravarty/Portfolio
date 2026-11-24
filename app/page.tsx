import { ArrowDown, ArrowDownToLine, ArrowUp, ArrowUpRight, Github, Linkedin, Mail, Plus, Sparkles } from 'lucide-react';
import Cinema from './cinema';
import { ChatPreview, PlatformPreview, RepoLink, SkillsPlayground } from './playground';

const links = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
];

const email = 'chakravartysamridhi@gmail.com';
const github = 'https://github.com/samridhichakravarty';
const linkedin = 'https://www.linkedin.com/in/samridhi-chakravarty-45a5172a7/';

export default function Portfolio() {
  return (
    <>
      <a className="skip-link" href="#about">Skip to portfolio</a>
      <header className="masthead">
        <a className="brand" href="#top" aria-label="Samridhi, back to the opening"><Sparkles size={23} strokeWidth={2.6} /><span>samridhi<span className="brand-dot">.</span></span></a>
        <nav aria-label="Portfolio">
          {links.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}
        </nav>
        <a className="nav-contact" href="#contact">Let’s talk <ArrowUpRight size={16} /></a>
      </header>

      <main>
        <Cinema />
        <div className="marquee" aria-hidden="true">
          <div>
            {Array.from({ length: 4 }, (_, index) => (
              <span className="marquee-group" key={index}>BUILD <b>✦</b> MAKE <b>✿</b> BREAK <b>✦</b> REPEAT <b>✿</b></span>
            ))}
          </div>
        </div>

        <section className="about section-pad" id="about" aria-labelledby="about-title">
          <div className="section-wrap">
            <p className="eyebrow"><span /> About me</p>
            <h2 className="display about-title" id="about-title">Curiosity is<br /> my <em>favorite</em><br /> feature<span>.</span></h2>
            <div className="about-note">
              <img src="/media/smile.webp" alt="" loading="lazy" />
              <div className="about-body">
                <p>I’m <strong>Samridhi Chakravarty</strong>, a Computer Science Engineering student specializing in AI and Data Science at Poornima University in Jaipur.</p>
                <p>I like turning messy problems into web products people can use. My work spans full-stack development, AI integrations, and figuring out what a feature needs through conversations with the people who use it.</p>
                <a href="#work" className="text-link">See what I’ve built <ArrowDown size={17} /></a>
              </div>
            </div>
          </div>
        </section>

        <section className="work section-pad" id="work" aria-labelledby="work-title">
          <div className="section-wrap">
            <div className="section-heading">
              <div><p className="eyebrow"><span /> Projects</p><h2 className="display" id="work-title">Selected <em>work.</em></h2></div>
              <img src="/media/burst.webp" alt="" loading="lazy" />
            </div>
            <article className="project project-platform">
              <div className="project-copy">
                <p className="project-index">01 / Full-stack platform</p>
                <h3>Enterprise<br />Web Platform</h3>
                <p>One platform for careers management, EOR and HRO calculators, and AI-assisted blog generation. A JWT-protected admin dashboard brings CRM, content management, and automated email workflows together.</p>
                <ul className="stack" aria-label="Technologies">{['Next.js', 'TypeScript', 'Supabase', 'Vercel', 'Groq', 'JWT', 'Resend'].map(tech => <li key={tech}>{tech}</li>)}</ul>
                <RepoLink href={github + '/Enterprise'} label="View Enterprise Web Platform repository" />
              </div>
              <div className="project-visual"><span className="preview-caption">Interactive concept</span><PlatformPreview /></div>
            </article>
            <article className="project project-chat">
              <div className="project-copy">
                <p className="project-index">02 / Real-time messaging</p>
                <h3>Real-Time<br />Chat Application</h3>
                <p>Direct and group conversations with live presence, typing and delivery indicators, and file sharing. JWT authentication, role-based authorization, and persistent chat history support both conversation types.</p>
                <ul className="stack" aria-label="Technologies">{['JavaScript', 'Node.js', 'Socket.IO', 'MongoDB', 'JWT', 'Cloudinary'].map(tech => <li key={tech}>{tech}</li>)}</ul>
                <RepoLink href={github + '/Real-Time'} label="View Real-Time Chat Application repository" />
              </div>
              <div className="project-visual"><span className="preview-caption">Interactive concept</span><ChatPreview /></div>
            </article>
          </div>
        </section>

        <section className="experience section-pad" id="experience" aria-labelledby="experience-title">
          <div className="section-wrap">
            <p className="eyebrow"><span /> Experience</p>
            <h2 className="display" id="experience-title">On the <em>job.</em></h2>
            <div className="timeline">
              <details open>
                <summary><span className="job-date">May 2026 – Present</span><span><strong>Forward Deployment Engineer</strong><small>Atlass Partners · Jaipur</small></span><span className="job-toggle"><Plus size={22} /></span></summary>
                <div className="job-detail"><p>Work with clients to understand their requirements and with cross-functional teams to turn those requirements into product features. Maintain and improve company websites across UI, content, and functionality.</p></div>
              </details>
              <details>
                <summary><span className="job-date">May 2025 – July 2025</span><span><strong>Web Development Intern</strong><small>ScaleneWorks · Jaipur</small></span><span className="job-toggle"><Plus size={22} /></span></summary>
                <div className="job-detail"><p>Built responsive interfaces and JavaScript interactions during an eight-week internship. Integrated MySQL data storage and collaborated on development and debugging across multiple web applications.</p></div>
              </details>
            </div>
          </div>
        </section>

        <section className="skills section-pad" id="skills" aria-labelledby="skills-title">
          <div className="section-wrap">
            <p className="eyebrow"><span /> Technical skills</p>
            <h2 className="display" id="skills-title">The <em>toolkit.</em></h2>
            <p className="skill-hint">Drag the skills around or select one.</p>
            <SkillsPlayground />
          </div>
        </section>

        <footer className="contact section-pad" id="contact">
          <div className="section-wrap">
            <p className="eyebrow"><span /> Contact</p>
            <h2 className="display">Let’s make<br />something <em>cool.</em></h2>
            <img className="contact-bolt" src="/media/bolt.webp" alt="" loading="lazy" />
            <a className="contact-email" href={'mailto:' + email}><Mail size={22} />{email}<ArrowUpRight size={22} /></a>
            <div className="contact-links">
              <a href={github} target="_blank" rel="noreferrer"><Github size={19} /> GitHub</a>
              <a href={linkedin} target="_blank" rel="noreferrer"><Linkedin size={19} /> LinkedIn</a>
              <a href="/media/Samridhi-Chakravarty-Resume.pdf" download><ArrowDownToLine size={19} /> Download résumé</a>
            </div>
            <div className="footer-bottom"><span>Samridhi Chakravarty · Jaipur, India</span><a href="#top">Back to top <ArrowUp size={16} /></a></div>
          </div>
        </footer>
      </main>
    </>
  );
}
