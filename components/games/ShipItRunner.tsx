"use client";

import { useEffect, useRef, useState } from "react";
import { GameShell } from "./GameShell";
import { useGameLoop } from "./useGameLoop";
import { collect, reportScore, useAlbum } from "@/lib/collectibles";
import { usePrefs } from "@/lib/prefs";
import { confetti, sfx } from "@/lib/fx";

const W = 800;
const H = 260;
const GROUND = 214;
const PX = 80;
const PW = 34;
const PH = 34;

type Status = "idle" | "playing" | "over";
type Item = { kind: "bug" | "star"; x: number; w: number; h: number; lift: number; done: boolean };

function pill(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") ctx.roundRect(x, y, w, h, r);
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

// Endless runner: jump the bugs, grab the deploy stars. Space / Up / tap to jump.
export function ShipItRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [score, setScore] = useState(0);
  const [inView, setInView] = useState(true);
  const statusRef = useRef<Status>("idle");
  const overAt = useRef(0);
  const { calm } = usePrefs();
  const { best } = useAlbum();
  const g = useRef({ y: 0, vy: 0, grounded: true, items: [] as Item[], t: 0, spawn: 0.8, score: 0, dash: 0, speed: 300 });

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
    g.current = { y: 0, vy: 0, grounded: true, items: [], t: 0, spawn: 0.8, score: 0, dash: 0, speed: 300 };
    statusRef.current = "playing";
    setStatus("playing");
    setScore(0);
  }

  function jump() {
    if (statusRef.current !== "playing") {
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
    statusRef.current = "over";
    overAt.current = performance.now();
    setStatus("over");
    sfx.hit();
    const final = g.current.score;
    reportScore("runner", final);
    if (final >= 10) {
      collect("runner");
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
      if (Math.random() < 0.3) s.items.push({ kind: "star", x: W + 20, w: 24, h: 24, lift: 52 + Math.random() * 58, done: false });
      else s.items.push({ kind: "bug", x: W + 20, w: 26 + Math.random() * 16, h: 24 + Math.random() * 10, lift: 0, done: false });
      s.spawn = (0.85 + Math.random() * 0.85) * (300 / s.speed) * 1.15;
    }

    const py = GROUND - PH + s.y;
    for (const item of s.items) {
      item.x -= s.speed * dt;
      if (item.kind === "bug") {
        const oy = GROUND - item.h;
        const hit = PX + 5 < item.x + item.w - 4 && PX + PW - 5 > item.x + 4 && py + 5 < oy + item.h && py + PH > oy + 6;
        if (hit) {
          gameOver();
          return;
        }
        if (!item.done && item.x + item.w < PX) {
          item.done = true;
          s.score += 1;
          setScore(s.score);
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
    s.items = s.items.filter((item) => item.x > -60 && !(item.kind === "star" && item.done));
  }

  function draw() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const s = g.current;
    ctx.setTransform(canvas.width / W, 0, 0, canvas.width / W, 0, 0);
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = "rgba(255,245,250,.35)";
    for (let i = 0; i < 14; i += 1) sparkle(ctx, (i * 137 - s.dash * 0.15 + 4000) % W, 26 + ((i * 53) % 110), 3 + (i % 3));

    ctx.strokeStyle = "rgba(255,45,120,.65)";
    ctx.lineWidth = 3;
    ctx.setLineDash([18, 14]);
    ctx.lineDashOffset = s.dash;
    ctx.beginPath();
    ctx.moveTo(0, GROUND + 3);
    ctx.lineTo(W, GROUND + 3);
    ctx.stroke();
    ctx.setLineDash([]);

    for (const item of s.items) {
      if (item.kind === "star") {
        ctx.fillStyle = "#fff5fa";
        sparkle(ctx, item.x + item.w / 2, GROUND - item.lift - item.h / 2, item.w * 0.62);
      } else {
        const bx = item.x;
        const by = GROUND - item.h;
        ctx.strokeStyle = "#fff5fa";
        ctx.lineWidth = 2;
        for (let leg = 0; leg < 3; leg += 1) {
          const lx = bx + 6 + (leg * (item.w - 12)) / 2;
          ctx.beginPath();
          ctx.moveTo(lx, by + item.h - 4);
          ctx.lineTo(lx - 4, GROUND + 2);
          ctx.stroke();
        }
        ctx.fillStyle = "#d946ef";
        ctx.beginPath();
        ctx.ellipse(bx + item.w / 2, by + item.h / 2, item.w / 2, item.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff5fa";
        ctx.beginPath();
        ctx.arc(bx + item.w * 0.32, by + item.h * 0.38, 3.4, 0, Math.PI * 2);
        ctx.arc(bx + item.w * 0.66, by + item.h * 0.38, 3.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#08000f";
        ctx.beginPath();
        ctx.arc(bx + item.w * 0.32, by + item.h * 0.4, 1.6, 0, Math.PI * 2);
        ctx.arc(bx + item.w * 0.66, by + item.h * 0.4, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const py = GROUND - PH + s.y;
    const body = ctx.createLinearGradient(PX, py, PX + PW, py + PH);
    body.addColorStop(0, "#ff2d78");
    body.addColorStop(1, "#d946ef");
    ctx.fillStyle = body;
    pill(ctx, PX, py, PW, PH, 11);
    ctx.fill();
    ctx.strokeStyle = "#fff5fa";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "#fff5fa";
    ctx.beginPath();
    ctx.arc(PX + 12, py + 14, 3.6, 0, Math.PI * 2);
    ctx.arc(PX + 24, py + 14, 3.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#fff5fa";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(PX + 18, py + 20, 7, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }

  useGameLoop(update, draw, status === "playing" && inView);

  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const bestScore = best.runner ?? 0;

  return (
    <GameShell
      id="runner"
      emoji="🚀"
      title="Ship It!"
      blurb="Jump over the bugs and grab the stars to ship your release. Score 10 to earn a sticker."
      controls="Space, Up arrow or tap to jump"
      stats={[{ label: "Shipped", value: score }, { label: "Best", value: bestScore }]}
    >
      <div
        ref={holderRef}
        tabIndex={0}
        role="group"
        aria-label="Ship It! game. Press space or the jump button to play."
        onKeyDown={(event) => {
          if (event.code === "Space" || event.code === "ArrowUp") {
            event.preventDefault();
            jump();
          }
        }}
        className="rounded-3xl"
      >
        <div className="relative overflow-hidden rounded-3xl border-2 border-border bg-bg/70" onPointerDown={jump}>
          <canvas ref={canvasRef} aria-hidden="true" className="block h-auto w-full touch-manipulation" style={{ aspectRatio: `${W} / ${H}` }} />
          {status !== "playing" && (
            <div className="absolute inset-0 grid place-items-center bg-bg/55 text-center backdrop-blur-[2px]">
              <div>
                <p className="font-display text-3xl font-bold">{status === "over" ? "Bug got you! 🐞" : "Ready to ship?"}</p>
                {status === "over" && <p className="mt-1 text-muted-2">You shipped {score}. {score >= 10 ? "Sticker unlocked!" : "10 earns a sticker."}</p>}
                <p className="mt-3 font-mono text-xs text-pink-soft">{calm ? "Calm mode: slower bugs" : "Tap, or press Space"}</p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" className="btn btn-primary" onClick={() => { holderRef.current?.focus(); jump(); }}>
            {status === "playing" ? "Jump ↑" : status === "over" ? "Play again" : "Start"}
          </button>
        </div>
        <p className="sr-only" role="status">{status === "over" ? `Game over. You shipped ${score}.` : ""}</p>
      </div>
    </GameShell>
  );
}
