'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { setPref, usePrefs } from '@/lib/prefs';

// Games load only when they scroll near the screen, so they never slow down the first view.
function OnView({ children, minHeight }: { children: ReactNode; minHeight: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setSeen(true);
        observer.disconnect();
      }
    }, { rootMargin: '300px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} style={{ minHeight: seen ? undefined : minHeight }}>{seen ? children : null}</div>;
}

const loading = () => <p className="s-muted">Loading game...</p>;
const Runner = dynamic(() => import('./ShipItRunner'), { ssr: false, loading });
const Pop = dynamic(() => import('./BugPop'), { ssr: false, loading });
const Match = dynamic(() => import('./StackMatch'), { ssr: false, loading });
const Gacha = dynamic(() => import('./SkillGacha'), { ssr: false, loading });

export function Games() {
  const { calm, sound } = usePrefs();
  return (
    <div className="s-stack" style={{ gap: '2rem' }}>
      <div className="s-row" role="group" aria-label="Game settings">
        <button type="button" className="s-btn s-btn--paper" aria-pressed={calm} onClick={() => setPref('calm', !calm)}>Calm mode: {calm ? 'on' : 'off'}</button>
        <button type="button" className="s-btn s-btn--paper" aria-pressed={sound} onClick={() => setPref('sound', !sound)}>Sound: {sound ? 'on' : 'off'}</button>
        <span className="s-muted" style={{ fontSize: '.9rem' }}>Calm mode slows the games and gives more time.</span>
      </div>
      <OnView minHeight={620}><Runner /></OnView>
      <OnView minHeight={560}><Gacha /></OnView>
      <OnView minHeight={560}><Match /></OnView>
      <OnView minHeight={560}><Pop /></OnView>
    </div>
  );
}
