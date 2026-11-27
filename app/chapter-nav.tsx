'use client';

import Link from '@/components/site/Link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type MouseEvent } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { scrollToElement, scrollToY } from './smooth-scroll';

// Story chapters live on the home page. Recruiters and Freelance are their own pages.
const chapters = [
  ['top', 'Home'], ['about', 'About'], ['work', 'Work'],
  ['experience', 'Experience'], ['skills', 'Skills'], ['contact', 'Contact'],
] as const;
const optional = new Set(['about', 'experience', 'skills']);
const pages = [['/recruiters', 'Recruiters'], ['/freelance', 'Freelance']] as const;

export default function ChapterNav() {
  const pathname = usePathname();
  const onHome = pathname === '/';
  const [active, setActive] = useState<string>('top');

  useEffect(() => {
    if (!onHome) return;
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
  }, [onHome]);

  function navigate(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (!onHome || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    const hash = '#' + id;
    if (window.location.hash !== hash) window.history.pushState(null, '', hash);
    if (event.detail === 0 && id !== 'top') target.focus({ preventScroll: true });
    if (id === 'top') scrollToY(0);
    else scrollToElement(target);
  }

  return (
    <header className="masthead chapter-nav">
      <Link className="brand" href="/" onClick={event => navigate(event, 'top')} aria-label="Samridhi, home"><Sparkles size={23} strokeWidth={2.6} /><span>samridhi<span className="brand-dot">.</span></span></Link>
      <nav aria-label="Main">
        {chapters.slice(0, -1).map(([id, label]) => (
          <Link key={id} className={optional.has(id) ? 'nav-opt' : undefined} href={id === 'top' ? '/' : '/#' + id} onClick={event => navigate(event, id)} aria-current={onHome && active === id ? 'location' : undefined}>{label}</Link>
        ))}
        {pages.map(([href, label]) => (
          <Link key={href} href={href} aria-current={pathname.startsWith(href) ? 'page' : undefined}>{label}</Link>
        ))}
      </nav>
      <Link className="nav-contact" href="/freelance/start" aria-label="Start a project" aria-current={pathname === '/freelance/start' ? 'page' : undefined}>Start a project <ArrowUpRight size={16} /></Link>
    </header>
  );
}
