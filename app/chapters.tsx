'use client';

import { useCallback, useEffect, useRef, useState, type FocusEvent, type FormEvent, type PointerEvent } from 'react';
import { ArrowDownToLine, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Check, Github, Linkedin, Mail, Shuffle, Sparkles, Star } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ChapterFilm, { careerStops, type ChapterMoment } from './chapter-film';
import { scrollAfterWheel } from './chapter-scroll';
import { ChatPreview, PlatformPreview, RepoLink } from './playground';
import SkillFlight from './skill-flight';

const email = 'chakravartysamridhi@gmail.com';
const github = 'https://github.com/samridhichakravarty';
const linkedin = 'https://www.linkedin.com/in/samridhi-chakravarty-45a5172a7/';

const stickerNames = { daisy: 'Daisy', burst: 'Starburst', heart: 'Heart' };
type Sticker = keyof typeof stickerNames;

const projects = [
  {
    number: '01',
    category: 'Full-stack platform',
    title: 'Enterprise Web Platform',
    description: 'One platform for careers management, EOR and HRO calculators, and AI-assisted blog generation. A JWT-protected admin dashboard brings CRM, content management, and automated email workflows together.',
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Vercel', 'Groq', 'JWT', 'Resend'],
    repo: 'Enterprise',
    Preview: PlatformPreview,
  },
  {
    number: '02',
    category: 'Real-time messaging',
    title: 'Real-Time Chat Application',
    description: 'Direct and group conversations with live presence, typing and delivery indicators, and file sharing. JWT authentication, role-based authorization, and persistent chat history support both conversation types.',
    stack: ['JavaScript', 'Node.js', 'Socket.IO', 'MongoDB', 'JWT', 'Cloudinary'],
    repo: 'Real-Time',
    Preview: ChatPreview,
  },
];

const roles = [
  {
    company: 'ScaleneWorks',
    role: 'Web Development Intern',
    dates: 'May 2025 – July 2025',
    stamp: 'Web development',
    description: 'Built responsive interfaces and JavaScript interactions during an eight-week internship. Integrated MySQL data storage and collaborated on development and debugging across multiple web applications.',
  },
  {
    company: 'Atlass Partners',
    role: 'Forward Deployment Engineer',
    dates: 'May 2026 – Present',
    stamp: 'Client solutions',
    description: 'Work with clients to understand their requirements and with cross-functional teams to turn those requirements into product features. Maintain and improve company websites across UI, content, and functionality.',
  },
  {
    company: 'Atlass Partners',
    role: 'AI Engineer',
  },
];

const groups = [
  { name: 'Languages', skills: ['Python', 'JavaScript', 'HTML5', 'CSS3'] },
  { name: 'Frontend', skills: ['React.js', 'Next.js', 'Responsive Web Design', 'DOM Manipulation'] },
  { name: 'Backend & data', skills: ['Node.js', 'REST APIs', 'Backend Integration', 'MongoDB', 'MySQL', 'Database Fundamentals'] },
  { name: 'AI & tools', skills: ['AI Fundamentals', 'Data Science Fundamentals', 'AI API Integration', 'Git', 'GitHub', 'Vercel', 'Cloudinary'] },
];
const allSkills = groups.flatMap((group, color) => group.skills.map(name => ({ name, color, group: group.name })));

function ChapterLabel({ children }: { children: string }) {
  return <p className="chapter-label"><span aria-hidden="true" />{children}</p>;
}

function useDesktopMotion() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(min-width: 761px) and (prefers-reduced-motion: no-preference)');
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return enabled;
}

function Collectible({ name, collected, onCollect, draggable = false }: {
  name: Sticker;
  collected: boolean;
  onCollect: (name: Sticker) => void;
  draggable?: boolean;
}) {
  return (
    <motion.button type="button" className={'collectible sticker-' + name}
      aria-label={collected ? stickerNames[name] + ' sticker collected' : 'Collect ' + stickerNames[name] + ' sticker'}
      aria-pressed={collected} title={collected ? 'In your sticker book' : 'Collect this sticker'}
      drag={draggable} dragSnapToOrigin dragMomentum={false} whileDrag={{ scale: 1.1 }}
      onClick={() => onCollect(name)}
    >
      <img src={'/media/' + name + '.webp'} alt="" loading="lazy" />
      {collected && <span className="sticker-check"><Check size={12} /></span>}
    </motion.button>
  );
}

function About({ sticker, count }: { sticker: React.ReactNode; count: number }) {
  const [note, setNote] = useState(false);
  return (
    <section className="chapter scrapbook story-book" data-chapter id="about" tabIndex={-1} aria-labelledby="scrapbook-title">
      <div className="chapter-inner book-stage">
        <div className="book-header">
          <ChapterLabel>About me</ChapterLabel>
          <h2 id="scrapbook-title" className="chapter-title">Curiosity is my <em>favorite feature.</em></h2>
        </div>
        <div className="book-chamber">
          <div className="book-pages">
            <figure className="book-portrait">
              <img src="/media/chapters/samridhi-portrait.webp" alt="Samridhi wearing pink sunglasses against a blue sky" width={960} height={1050} loading="lazy" />
              <figcaption>Samridhi Chakravarty</figcaption>
            </figure>
            <article className="book-bio">
              <h3>Hi, I’m Samridhi.</h3>
              <p>I’m <strong>Samridhi Chakravarty</strong>, a Computer Science Engineering student specializing in AI and Data Science at Poornima University in Jaipur.</p>
              <p>I like turning messy problems into web products people can use. My work spans full-stack development, AI integrations, and building features around what clients and users need.</p>
              <div className="book-bio-tools">
                <span className="sticker-count" aria-live="polite"><Star size={15} /> Sticker book {count}/3</span>
                <button type="button" className="flip-note" aria-label="Turn field note" aria-expanded={note} aria-controls="scrapbook-note" onClick={() => setNote(!note)}>
                  <span>Field note</span>
                  <span className="flip-front">Turn the page <ArrowUpRight size={17} /></span>
                  <span className="flip-back" id="scrapbook-note" aria-hidden={!note}>B.Tech · 2023–2027</span>
                </button>
              </div>
            </article>
            {sticker}
          </div>
          <ChapterFilm chapter="about" className="book-film" />
        </div>
      </div>
    </section>
  );
}

function ProjectArt({ children }: { children: React.ReactNode }) {
  const art = useRef<HTMLDivElement>(null);

  function tilt(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse') return;
    if ((event.target as Element).closest('.mock-window')) {
      art.current?.removeAttribute('style');
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    art.current?.style.setProperty('--tilt-x', ((0.5 - (event.clientY - bounds.top) / bounds.height) * 5) + 'deg');
    art.current?.style.setProperty('--tilt-y', (((event.clientX - bounds.left) / bounds.width - 0.5) * 6) + 'deg');
  }

  return (
    <div className="project-art" onPointerMove={tilt} onPointerLeave={() => art.current?.removeAttribute('style')}>
      <span className="concept-tag">Interactive concept</span>
      <div className="project-folio"><div className="project-art-inner" ref={art}>{children}</div></div>
    </div>
  );
}

function Work({ sticker }: { sticker: React.ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  function goToProject(index: number, behavior: ScrollBehavior) {
    const root = section.current;
    if (!root?.hasAttribute('data-gallery')) return;
    scrollAfterWheel(() => {
      const offset = Number.parseFloat(root.style.getPropertyValue(index === 0 ? '--gallery-first' : '--gallery-second'));
      if (!Number.isFinite(offset)) return;
      const header = document.querySelector('header')?.offsetHeight ?? 0;
      const start = root.getBoundingClientRect().top + window.scrollY - header;
      window.scrollTo({ top: start + offset, behavior });
    });
  }

  function keepFocusInView(event: FocusEvent<HTMLDivElement>) {
    if (!event.target.matches(':focus-visible')) return;
    const panel = event.target.closest<HTMLElement>('[data-project]');
    const root = section.current;
    if (!panel || !root?.hasAttribute('data-gallery')) return;
    const visible = event.currentTarget.getBoundingClientRect();
    const bounds = event.target.getBoundingClientRect();
    const index = Number(panel.dataset.project);
    const covered = Number(root.style.getPropertyValue('--chapter-handoff')) < 0.98;
    if (covered || bounds.left < visible.left + 3 || bounds.right > visible.right - 3) goToProject(index, 'instant');
  }

  return (
    <section ref={section} className="chapter exhibition story-work" data-chapter id="work" tabIndex={-1} aria-labelledby="exhibition-title">
      <div className="chapter-inner exhibition-stage">
        <div className="exhibition-header">
          <div>
            <ChapterLabel>Selected work</ChapterLabel>
            <h2 className="chapter-title" id="exhibition-title">Project <em>playground.</em></h2>
          </div>
          {sticker}
        </div>
        <div className="project-viewport" onFocusCapture={keepFocusInView}>
          <div className="project-rail" id="project-rail">
            {projects.map(({ number, category, title, description, stack, repo, Preview }, index) => (
              <article className={'work-panel work-panel-' + index} key={repo} data-project={index}>
                <div className="work-story">
                  <strong className="work-number" aria-hidden="true">{number}</strong>
                  <p className="work-type">{category}</p>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <ul className="stack" aria-label="Technologies">{stack.map(tech => <li key={tech}>{tech}</li>)}</ul>
                  <RepoLink href={github + '/' + repo} label={'View ' + title + ' repository'} />
                </div>
                <ProjectArt><Preview /></ProjectArt>
              </article>
            ))}
          </div>
          <ChapterFilm chapter="work" className="work-film" onProjectChange={setActive} />
        </div>
        <div className="gallery-controls" aria-label="Project gallery controls">
          <p>Scroll to explore</p>
          <span className="gallery-track" aria-hidden="true"><i /></span>
          <div className="gallery-buttons" role="group" aria-label="Choose a project">
            <button type="button" aria-label="Show Enterprise Web Platform" aria-pressed={active === 0} onClick={() => goToProject(0, 'smooth')}><ArrowLeft size={17} /> 01</button>
            <button type="button" aria-label="Show Real-Time Chat Application" aria-pressed={active === 1} onClick={() => goToProject(1, 'smooth')}>02 <ArrowRight size={17} /></button>
          </div>
        </div>
        <div className="project-confetti" aria-hidden="true"><i /><i /><i /></div>
      </div>
    </section>
  );
}

function Experience() {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(-1);

  function visitMilestone(index: number) {
    const root = section.current;
    if (root?.hasAttribute('data-arcade-pin')) {
      scrollAfterWheel(() => {
        const header = document.querySelector('header')?.offsetHeight ?? 0;
        const start = root.getBoundingClientRect().top + window.scrollY - header;
        const distance = root.offsetHeight - window.innerHeight + header;
        window.scrollTo({ top: start + distance * careerStops[index], behavior: 'smooth' });
      });
      return;
    }

    const card = document.getElementById('career-' + index);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    card?.focus({ preventScroll: true });
    setActive(index);
    scrollAfterWheel(() => card?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'nearest' }));
  }

  return (
    <section ref={section} className="chapter arcade story-arcade" data-chapter id="experience" tabIndex={-1} aria-labelledby="arcade-title">
      <div className="chapter-inner arcade-content">
        <div className="arcade-heading">
          <ChapterLabel>Experience</ChapterLabel>
          <h2 className="chapter-title" id="arcade-title">Leveling up <em>in real life.</em></h2>
        </div>
        <div className="arcade-frame">
          <div className="arcade-screen">
            <ChapterFilm chapter="experience" className="arcade-world" onCareerChange={setActive} />
          </div>
          <ol className="arcade-path">
            {roles.map(({ company, role, dates, stamp, description }, index) => (
              <li className={'arcade-stop stop-' + index} key={role} data-landed={active === index || undefined}>
                <article className="career-card" id={'career-' + index} tabIndex={-1} aria-label={company + ', ' + role}>
                  <p className="career-level"><span>Level 0{index + 1}</span>{dates && <span>{dates}</span>}</p>
                  <h3>{company}</h3>
                  <p className="career-role">{role}{index < 2 ? ' · Jaipur' : ''}</p>
                  {description && <p>{description}</p>}
                  {stamp && <span className="career-stamp"><Star size={13} />{stamp}</span>}
                </article>
              </li>
            ))}
          </ol>
        </div>
        <div className="arcade-deck">
          <p className="arcade-caption">Career milestones</p>
          <div className="level-controls" role="group" aria-label="Jump to a career milestone">
            {roles.map(({ company, role }, index) => <button key={role} type="button" aria-controls={'career-' + index} aria-pressed={active === index} onClick={() => visitMilestone(index)}>Level 0{index + 1}<span className="sr-only"> {company}, {role}</span></button>)}
          </div>
          <div className="arcade-finish" aria-hidden="true"><Star size={19} fill="currentColor" /><span>Level complete</span></div>
        </div>
      </div>
    </section>
  );
}

function Skills({ desktop }: { desktop: boolean }) {
  const [category, setCategory] = useState('All');
  const [skills, setSkills] = useState(allSkills);
  const [shuffles, setShuffles] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [engaged, setEngaged] = useState(false);
  const bounds = useRef<HTMLDivElement>(null);
  const flight = useRef<((moment: ChapterMoment) => void) | null>(null);
  const trackFlight = useCallback((moment: ChapterMoment) => flight.current?.(moment), []);
  const visibleSkills = category === 'All' ? skills : skills.filter(skill => skill.group === category);

  function shuffle() {
    setEngaged(true);
    const reordered = [...skills];
    for (let index = reordered.length - 1; index > 0; index -= 1) {
      const other = Math.floor(Math.random() * (index + 1));
      [reordered[index], reordered[other]] = [reordered[other], reordered[index]];
    }
    setSkills(reordered);
    setShuffles(value => value + 1);
  }

  return (
    <section className="chapter lab story-lab" data-chapter data-engaged={engaged || undefined} id="skills" tabIndex={-1} aria-labelledby="lab-title">
      <div className="chapter-inner">
        <div className="lab-heading">
          <div><ChapterLabel>Skills</ChapterLabel><h2 className="chapter-title" id="lab-title">Anti-gravity <em>lab.</em></h2></div>
          <p>{desktop ? 'Drag the badges, filter by category, or shuffle the board.' : 'Filter by category, shuffle the board, or tap a badge.'}</p>
        </div>
        <div className="lab-controls">
          <div role="group" aria-label="Filter technical skills" className="lab-filters">
            {['All', ...groups.map(group => group.name)].map(name => (
              <button type="button" key={name} aria-pressed={category === name} onClick={() => { setEngaged(true); setCategory(name); setSelected(null); }}>{name}</button>
            ))}
          </div>
          <button type="button" className="shuffle-button" onClick={shuffle}><Shuffle size={17} /> Shuffle</button>
        </div>
        <div className="orbit-board" ref={bounds}>
          <ChapterFilm chapter="skills" className="lab-world" onMotion={trackFlight} />
          <div className="orbit-grid">
            <AnimatePresence initial={false} mode="popLayout">
              {visibleSkills.map(({ name, color, group }) => (
                <motion.div key={name} layout={desktop ? 'position' : false} className="orbit-item"
                  initial={desktop ? { opacity: 0 } : false} animate={{ opacity: 1 }}
                  exit={desktop ? { opacity: 0 } : undefined}
                  transition={{ opacity: { duration: desktop ? 0.16 : 0 }, layout: { type: 'spring', stiffness: 340, damping: 33 } }}
                >
                  <motion.button type="button" className={'orbit-badge orbit-tone-' + color} title={group} data-flight-target={name}
                    drag={desktop} dragConstraints={bounds} dragSnapToOrigin dragMomentum={false}
                    dragTransition={{ bounceStiffness: 470, bounceDamping: 34 }}
                    whileDrag={{ scale: 1.05, zIndex: 5 }} whileHover={desktop ? { scale: 1.025 } : undefined}
                    aria-pressed={selected === name}
                    onClick={() => { setEngaged(true); setSelected(selected === name ? null : name); }}
                  ><span aria-hidden="true" />{name}</motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <SkillFlight ref={flight} />
          <div className="orbit-exit" aria-hidden="true">✦ <span>✧</span> ✦</div>
        </div>
        <p className="lab-status" aria-live="polite">{visibleSkills.length} {visibleSkills.length === 1 ? 'skill' : 'skills'}{category !== 'All' ? ' · ' + category : ''}{shuffles > 0 ? ' · Shuffle ' + shuffles : ''}{selected ? ' · ' + selected + ' selected' : ''}</p>
      </div>
    </section>
  );
}

function Contact({ sticker }: { sticker: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [tone, setTone] = useState('cream');
  const [decorated, setDecorated] = useState(false);
  const [sentDraft, setSentDraft] = useState(false);

  function openEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('sender') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    if (!message) {
      setStatus('Write a message before opening your draft.');
      event.currentTarget.querySelector('textarea')?.focus();
      return;
    }
    const subject = name ? 'Portfolio note from ' + name : 'Portfolio note';
    const body = name ? message + '\n\n' + name : message;
    setOpen(true);
    setSentDraft(true);
    setStatus('Draft requested. If your email app doesn’t open, use the address below.');
    window.location.href = 'mailto:' + email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  return (
    <footer className="chapter post-office story-post" data-chapter id="contact" tabIndex={-1} aria-labelledby="post-title">
      <div className="chapter-inner">
        <ChapterLabel>Contact</ChapterLabel>
        <h2 className="chapter-title" id="post-title">Send some <em>good vibes.</em></h2>
        <div className="post-chamber">
          <div className="postcard-mount">
            <form className="postcard-form" data-tone={tone} data-draft={sentDraft || undefined}
              action={'mailto:' + email} method="post" encType="text/plain"
              onSubmit={openEmail} onFocus={() => setOpen(true)} onChange={() => { setStatus(''); setSentDraft(false); }}>
              <div className="postcard-tools">
                <h3>Your postcard</h3>
                <div className="postcard-swatches" role="group" aria-label="Postcard color">
                  {['cream', 'pink', 'lavender'].map(color => <button type="button" key={color} data-swatch={color} aria-label={color + ' postcard'} aria-pressed={tone === color} onClick={() => { setTone(color); setOpen(true); }} />)}
                </div>
              </div>
              {decorated && <img className="postcard-decoration" src="/media/heart.webp" width={49} height={40} alt="" />}
              <label htmlFor="postcard-name">Your name <small>(optional)</small></label>
              <input id="postcard-name" name="sender" autoComplete="name" maxLength={100} placeholder="Your name" />
              <label htmlFor="postcard-message">Your message</label>
              <textarea id="postcard-message" name="message" placeholder="Tell me what you have in mind." rows={4} maxLength={1600} required />
              <div className="postcard-actions">
                <button className="post-submit" type="submit">Send message <ArrowUpRight size={18} /></button>
                <button className="post-decorate" type="button" aria-pressed={decorated} onClick={() => { setDecorated(!decorated); setOpen(true); }}>
                  <Sparkles size={16} /> {decorated ? 'Remove sticker' : 'Add sticker'}
                </button>
              </div>
              <p className="post-status" role="status">{status || 'Opens a draft in your email app.'}</p>
            </form>
          </div>
          <ChapterFilm chapter="contact" className="post-film" open={open} />
          {sticker}
          <button className="envelope-button" type="button" aria-pressed={open} onClick={() => setOpen(!open)}>
            <Mail size={17} />{open ? 'Release the envelope' : 'Open the envelope'}
          </button>
        </div>
        <div className="post-finale">
          <h3 className="chapter-title">Let’s make<br />something <em>cool.</em></h3>
          <img src="/media/burst.webp" alt="" className="finale-sparkle" loading="lazy" />
          <a className="post-email" href={'mailto:' + email}><Mail size={19} />{email}</a>
          <div className="contact-links post-links">
            <a href={github} target="_blank" rel="noreferrer"><Github size={18} /> GitHub</a>
            <a href={linkedin} target="_blank" rel="noreferrer"><Linkedin size={18} /> LinkedIn</a>
            <a href="/media/Samridhi-Chakravarty-Resume.pdf" download><ArrowDownToLine size={18} /> Download résumé</a>
          </div>
        </div>
        <div className="footer-bottom"><span>Samridhi Chakravarty · Jaipur, India</span><a href="#top">Back to top <ArrowUp size={16} /></a></div>
      </div>
    </footer>
  );
}

export default function Chapters() {
  const layout = useRef<HTMLDivElement>(null);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const desktop = useDesktopMotion();
  const stored = useRef(false);

  useEffect(() => {
    if (!layout.current) return;
    const firstHash = window.location.hash;
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    let alignInitialChapter = Boolean(firstHash) && navigation?.type !== 'back_forward';
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        if (!alignInitialChapter) return;
        alignInitialChapter = false;
        if (window.location.hash !== firstHash) return;
        const chapter = document.getElementById(firstHash.slice(1));
        if (chapter?.hasAttribute('data-chapter')) chapter.scrollIntoView({ behavior: 'instant' });
      });
    });
    for (const chapter of layout.current.children) observer.observe(chapter);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem('portfolio-stickers') ?? '[]');
      if (Array.isArray(saved)) {
        setStickers([...new Set(saved.filter((name): name is Sticker => typeof name === 'string' && Object.hasOwn(stickerNames, name)))]);
      }
    } catch {
      // The collection still works for this visit.
    }
    stored.current = true;
  }, []);

  function collect(name: Sticker) {
    if (stickers.includes(name)) return;
    const next = [...stickers, name];
    setStickers(next);
    if (stored.current) {
      try { localStorage.setItem('portfolio-stickers', JSON.stringify(next)); } catch { /* Keep the session collection. */ }
    }
  }

  const sticker = (name: Sticker, draggable = false) => <Collectible name={name} collected={stickers.includes(name)} onCollect={collect} draggable={desktop && draggable} />;

  return (
    <div className="chapters" ref={layout}>
      <About sticker={sticker('daisy', true)} count={stickers.length} />
      <Work sticker={sticker('burst')} />
      <Experience />
      <Skills desktop={desktop} />
      <Contact sticker={sticker('heart')} />
    </div>
  );
}
