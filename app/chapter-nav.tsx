'use client';

import { useEffect, useState, type MouseEvent } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { cancelChapterScroll, scrollAfterWheel } from './chapter-scroll';

const chapters = [
  ['top', 'Home'], ['about', 'About'], ['work', 'Work'],
  ['experience', 'Experience'], ['skills', 'Skills'], ['contact', 'Contact'],
] as const;

export default function ChapterNav() {
  const [active, setActive] = useState<string>('top');

  useEffect(() => {
    const sections = chapters.map(([id]) => document.getElementById(id));
    let frame = 0;
    function update() {
      frame = 0;
      const marker = (document.querySelector('header')?.offsetHeight ?? 0) + 45;
      let current: string = 'top';
      for (const section of sections) {
        if (section && section.getBoundingClientRect().top <= marker) current = section.id;
      }
      setActive(current);
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('hashchange', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('hashchange', schedule);
    };
  }, []);

  function navigate(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    const hash = '#' + id;
    if (window.location.hash !== hash) window.history.pushState(null, '', hash);
    if (event.detail === 0 && id !== 'top') target.focus({ preventScroll: true });
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scroll = () => target.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' });
    if (id === 'top') {
      cancelChapterScroll();
      scroll();
    } else scrollAfterWheel(scroll);
  }

  return (
    <header className="masthead chapter-nav">
      <a className="brand" href="#top" onClick={event => navigate(event, 'top')} aria-label="Samridhi, back to the opening"><Sparkles size={23} strokeWidth={2.6} /><span>samridhi<span className="brand-dot">.</span></span></a>
      <nav aria-label="Portfolio chapters">
        {chapters.slice(0, -1).map(([id, label]) => <a key={id} href={'#' + id} onClick={event => navigate(event, id)} aria-current={active === id ? 'location' : undefined}>{label}</a>)}
      </nav>
      <a className="nav-contact" href="#contact" onClick={event => navigate(event, 'contact')} aria-label="Contact, let’s talk" aria-current={active === 'contact' ? 'location' : undefined}>Let’s talk <ArrowUpRight size={16} /></a>
    </header>
  );
}
