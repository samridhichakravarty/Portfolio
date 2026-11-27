'use client';

import { useEffect, useRef, useState } from 'react';
import { GameShell } from './GameShell';
import { useGameLoop } from './useGameLoop';
import { RISK_FIXES } from '@/lib/site';
import { collect, reportScore, useAlbum } from '@/lib/collectibles';
import { usePrefs } from '@/lib/prefs';
import { confetti, sfx } from '@/lib/fx';

const W = 800;
const H = 260;
const GROUND = 214;
const PX = 80;
const PW = 34;
const PH = 34;
const RISKS = Object.keys(RISK_FIXES);

type Status = 'idle' | 'playing' | 'over';
type Item = { kind: 'risk' | 'star'; x: number; w: number; h: number; lift: number; done: boolean; label: string };

function pill(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') ctx.roundRect(x, y, w, h, r);
  else ctx.rect(x, y, w, h);
}

function sparkle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}

// Endless runner. The obstacles are the four things that sink real projects; the stars are releases.
export default function ShipItRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [score, setScore] = useState(0);
  const [inView, setInView] = useState(true);
  const [dodged, setDodged] = useState<string[]>([]);
  const [shared, setShared] = useState(false);
  const statusRef = useRef<Status>('idle');
  const overAt = useRef(0);
  const { calm } = usePrefs();
  const { best } = useAlbum();
  const g = useRef({ y: 0, vy: 0, grounded: true, items: [] as Item[], t: 0, spawn: 0.8, score: 0, dash: 0, speed: 300, dodged: new Set<string>() });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const holder = holderRef.current;
    if (!holder) return;
    const observer = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), { threshold: 0.2 });
    observer.observe(holder);
    return () => observer.disconnect();
  }, []);

  function begin() {
    g.current = { y: 0, vy: 0, grounded: true, items: [], t: 0, spawn: 0.8, score: 0, dash: 0, speed: 300, dodged: new Set<string>() };
    statusRef.current = 'playing';
    setStatus('playing');
    setScore(0);
    setDodged([]);
    setShared(false);
  }

  function jump() {
    if (statusRef.current !== 'playing') {
      if (performance.now() - overAt.current > 450) begin();
      return;
    }
    if (g.current.grounded) {
      g.current.vy = -660;
      g.current.grounded = false;
      sfx.jump();
    }
  }

  function gameOver() {
    statusRef.current = 'over';
    overAt.current = performance.now();
    setStatus('over');
    sfx.hit();
    const final = g.current.score;
    reportScore('runner', final);
    if (final >= 10) {
      collect('bolt');
      const box = canvasRef.current?.getBoundingClientRect();
      if (box) confetti(box.left + box.width / 2, box.top + box.height / 2, 34);
    }
  }

  function update(dt: number) {
    const s = g.current;
    s.t += dt;
    s.speed = (300 + Math.min(s.t * 9, 250)) * (calm ? 0.75 : 1);
    s.dash += s.speed * dt;
    s.vy += 1950 * dt;
    s.y += s.vy * dt;
    if (s.y >= 0) {
      s.y = 0;
      s.vy = 0;
      s.grounded = true;
    }

    s.spawn -= dt;
    if (s.spawn <= 0) {
      if (Math.random() < 0.28) s.items.push({ kind: 'star', x: W + 20, w: 24, h: 24, lift: 52 + Math.random() * 58, done: false, label: '' });
      else s.items.push({ kind: 'risk', x: W + 20, w: 30 + Math.random() * 14, h: 26 + Math.random() * 12, lift: 0, done: false, label: RISKS[Math.floor(Math.random() * RISKS.length)] ?? 'Bug' });
      s.spawn = (0.9 + Math.random() * 0.85) * (300 / s.speed) * 1.2;
    }

    const py = GROUND - PH + s.y;
    for (const item of s.items) {
      item.x -= s.speed * dt;
      if (item.kind === 'risk') {
        const oy = GROUND - item.h;
        const hit = PX + 5 < item.x + item.w - 4 && PX + PW - 5 > item.x + 4 && py + 5 < oy + item.h && py + PH > oy + 6;
        if (hit) {
          gameOver();
          return;
        }
        if (!item.done && item.x + item.w < PX) {
          item.done = true;
          s.score += 1;
          s.dodged.add(item.label);
          setScore(s.score);
          setDodged([...s.dodged]);
        }
      } else if (!item.done) {
        const sy = GROUND - item.lift - item.h;
        if (PX < item.x + item.w && PX + PW > item.x && py < sy + item.h && py + PH > sy) {
          item.done = true;
          s.score += 1;
          setScore(s.score);
          sfx.coin();
        }
      }
    }
    s.items = s.items.filter(item => item.x > -80 && !(item.kind === 'star' && item.done));
  }

  function draw() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const s = g.current;
    ctx.setTransform(canvas.width / W, 0, 0, canvas.width / W, 0, 0);
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = 'rgba(255,249,241,.7)';
    for (let i = 0; i < 12; i += 1) sparkle(ctx, (i * 151 - s.dash * 0.15 + 4000) % W, 26 + ((i * 53) % 100), 3 + (i % 3));

    ctx.strokeStyle = '#181818';
    ctx.lineWidth = 3;
    ctx.setLineDash([18, 14]);
    ctx.lineDashOffset = s.dash;
    ctx.beginPath();
    ctx.moveTo(0, GROUND + 3);
    ctx.lineTo(W, GROUND + 3);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = '800 12px "DM Sans Variable", system-ui, sans-serif';
    ctx.textAlign = 'center';
    for (const item of s.items) {
      if (item.kind === 'star') {
        const cx = item.x + item.w / 2;
        const cy = GROUND - item.lift - item.h / 2;
        ctx.fillStyle = '#ffe66d';
        sparkle(ctx, cx, cy, item.w * 0.7);
      } else {
        const by = GROUND - item.h;
        ctx.fillStyle = '#4561ff';
        pill(ctx, item.x, by, item.w, item.h, 8);
        ctx.fill();
        ctx.strokeStyle = '#181818';
        ctx.lineWidth = 3;
        ctx.stroke();
        const tag = ctx.measureText(item.label).width + 14;
        ctx.fillStyle = '#fff9f1';
        pill(ctx, item.x + item.w / 2 - tag / 2, by - 24, tag, 19, 9);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#181818';
        ctx.fillText(item.label, item.x + item.w / 2, by - 10.5);
      }
    }

    const py = GROUND - PH + s.y;
    const body = ctx.createLinearGradient(PX, py, PX + PW, py + PH);
    body.addColorStop(0, '#ff69b4');
    body.addColorStop(1, '#ff2d8d');
    ctx.fillStyle = body;
    pill(ctx, PX, py, PW, PH, 11);
    ctx.fill();
    ctx.strokeStyle = '#181818';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#181818';
    ctx.beginPath();
    ctx.arc(PX + 12, py + 14, 3.2, 0, Math.PI * 2);
    ctx.arc(PX + 24, py + 14, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(PX + 18, py + 20, 7, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }

  useGameLoop(update, draw, status === 'playing' && inView);

  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function challenge() {
    const link = `${window.location.origin}/?challenge=ship-${score}`;
    try {
      await navigator.clipboard.writeText(`I shipped ${score} in Ship It! Beat me: ${link}`);
      setShared(true);
    } catch {
      setShared(false);
    }
  }

  return (
    <GameShell
      id="runner"
      emoji="🚀"
      title="Ship It!"
      blurb="Jump over the four things that sink real projects and grab stars to ship your release. Score 10 to earn a sticker."
      controls="Space, Up arrow or tap to jump"
      stats={[{ label: 'Shipped', value: score }, { label: 'Best', value: best.runner ?? 0 }]}
      behind="Built from scratch on a canvas with a fixed 60 steps-per-second loop, no game engine. It pauses when it is off-screen or the tab is hidden, plays with a keyboard or touch, and calm mode slows it down."
    >
      <div
        ref={holderRef}
        tabIndex={0}
        role="group"
        aria-label="Ship It! game. Press space or the jump button to play."
        onKeyDown={event => {
          if (event.code === 'Space' || event.code === 'ArrowUp') {
            event.preventDefault();
            jump();
          }
        }}
      >
        <div className="game-stage" onPointerDown={jump}>
          <canvas ref={canvasRef} aria-hidden="true" style={{ display: 'block', width: '100%', height: 'auto', aspectRatio: `${W} / ${H}`, touchAction: 'manipulation' }} />
          {status !== 'playing' && (
            <div className="game-cover">
              <div>
                <p className="s-h2">{status === 'over' ? 'Project at risk!' : 'Ready to ship?'}</p>
                {status === 'over' && <p style={{ marginTop: '.4rem', fontWeight: 650 }}>You shipped {score}. {score >= 10 ? 'Sticker unlocked!' : '10 earns a sticker.'}</p>}
                <p className="s-eyebrow" style={{ marginTop: '.7rem' }}>{calm ? 'Calm mode: slower' : 'Tap or press Space'}</p>
              </div>
            </div>
          )}
        </div>
        <div className="s-row" style={{ marginTop: '1rem' }}>
          <button type="button" className="s-btn" onClick={() => { holderRef.current?.focus(); jump(); }}>
            {status === 'playing' ? 'Jump ↑' : status === 'over' ? 'Play again' : 'Start'}
          </button>
          {status === 'over' && score > 0 && <button type="button" className="s-btn s-btn--paper" onClick={challenge}>{shared ? 'Link copied' : 'Challenge a friend'}</button>}
        </div>
        <p className="sr-only" role="status">{status === 'over' ? `Game over. You shipped ${score}.` : ''}</p>
      </div>

      <div>
        <h3 className="s-h3">How I handle those risks on real projects</h3>
        <ul className="s-checks" style={{ marginTop: '.8rem' }}>
          {RISKS.map(risk => (
            <li key={risk} style={{ opacity: dodged.length === 0 || dodged.includes(risk) ? 1 : 0.55 }}>
              <span><b>{risk}.</b> {RISK_FIXES[risk]}{dodged.includes(risk) ? ' (you dodged this one!)' : ''}</span>
            </li>
          ))}
        </ul>
      </div>
    </GameShell>
  );
}
