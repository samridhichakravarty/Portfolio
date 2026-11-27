'use client';

import { useEffect, useRef, useState } from 'react';
import { GameShell } from './GameShell';
import { collect, reportScore, useAlbum } from '@/lib/collectibles';
import { usePrefs } from '@/lib/prefs';
import { confetti, sfx } from '@/lib/fx';

type Status = 'idle' | 'playing' | 'over';

const CHECKLIST = [
  'It works on phones and desktops, not just on my screen.',
  'Forms and logins are tested with real data, including mistakes.',
  'Errors show clear messages instead of a blank page.',
  'Pages are checked for speed and accessibility.',
  'Secrets and settings are confirmed before the release goes out.',
];

// Whack-a-bug. The end of the game is the checklist I actually run before a launch.
export default function BugPop() {
  const { calm } = usePrefs();
  const { best } = useAlbum();
  const duration = calm ? 45 : 30;
  const [status, setStatus] = useState<Status>('idle');
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(duration);
  const [active, setActive] = useState<number | null>(null);
  const run = useRef({ score: 0, endAt: 0 });
  const holder = useRef<HTMLDivElement>(null);

  function start() {
    run.current = { score: 0, endAt: performance.now() + duration * 1000 };
    setScore(0);
    setLeft(duration);
    setStatus('playing');
    holder.current?.focus();
  }

  useEffect(() => {
    if (status !== 'playing') return;
    let alive = true;
    let timer = 0;

    const next = () => {
      if (!alive) return;
      setActive(Math.floor(Math.random() * 9));
      const visible = calm ? 1400 : Math.max(520, 980 - run.current.score * 14);
      timer = window.setTimeout(() => {
        setActive(null);
        timer = window.setTimeout(next, 200);
      }, visible);
    };
    next();

    const tick = window.setInterval(() => {
      const remain = Math.max(0, Math.ceil((run.current.endAt - performance.now()) / 1000));
      setLeft(remain);
      if (remain <= 0) {
        setActive(null);
        setStatus('over');
        sfx.win();
        reportScore('bugpop', run.current.score);
        if (run.current.score >= 15) {
          collect('bugpop');
          const box = holder.current?.getBoundingClientRect();
          if (box) confetti(box.left + box.width / 2, box.top + 80, 34);
        }
      }
    }, 200);

    return () => {
      alive = false;
      clearTimeout(timer);
      clearInterval(tick);
    };
  }, [status, calm]);

  function pop(index: number) {
    if (status !== 'playing' || index !== active) return;
    sfx.pop();
    run.current.score += 1;
    setScore(run.current.score);
    setActive(null);
  }

  return (
    <GameShell
      id="bugpop"
      emoji="🐞"
      title="Bug Pop"
      blurb={`Pop as many bugs as you can in ${duration} seconds. Pop 15 to earn a sticker.`}
      controls="Click, tap, or press keys 1 to 9"
      stats={[{ label: 'Popped', value: score }, { label: 'Time', value: status === 'playing' ? left : duration }, { label: 'Best', value: best.bugpop ?? 0 }]}
      behind="Plain React state and timers with no canvas. Every hole is a real button, so it works with a keyboard, a screen reader and touch. Calm mode gives more time and slower bugs."
    >
      <div
        ref={holder}
        tabIndex={0}
        role="group"
        aria-label="Bug Pop game. Press keys 1 to 9 to pop bugs."
        onKeyDown={event => {
          const n = Number(event.key);
          if (n >= 1 && n <= 9) pop(n - 1);
        }}
      >
        <div className="game-stage" style={{ padding: 'clamp(1rem,3vw,1.6rem)' }}>
          <div className="holes">
            {Array.from({ length: 9 }, (_, index) => (
              <button key={index} type="button" className="hole" onClick={() => pop(index)} aria-label={`Hole ${index + 1}${active === index ? ', bug here' : ''}`}>
                <span aria-hidden="true" style={{ transform: active === index ? 'translateY(0) scale(1)' : 'translateY(120%) scale(.6)' }}>🐞</span>
              </button>
            ))}
          </div>
        </div>
        <div className="s-row" style={{ marginTop: '1rem' }}>
          <button type="button" className="s-btn" onClick={start} disabled={status === 'playing'}>{status === 'over' ? 'Play again' : 'Start'}</button>
          <p style={{ fontWeight: 800 }} aria-live="polite">{status === 'over' ? `Time! You popped ${score}. ${score >= 15 ? 'Sticker unlocked!' : '15 earns a sticker.'}` : ''}</p>
        </div>
      </div>
      <div>
        <h3 className="s-h3">What I check before every launch</h3>
        <ul className="s-checks" style={{ marginTop: '.8rem' }}>{CHECKLIST.map(item => <li key={item}>{item}</li>)}</ul>
      </div>
    </GameShell>
  );
}
