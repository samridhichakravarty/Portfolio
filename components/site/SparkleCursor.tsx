"use client";

import { useEffect, useRef } from "react";
import { usePrefs } from "@/lib/prefs";

type Particle = { x: number; y: number; vx: number; vy: number; life: number; size: number; color: string };

const COLORS = ["#ff2d78", "#ff7eb3", "#d946ef", "#fff5fa"];

function sparkle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}

// A short sparkle trail behind a mouse pointer. Mouse only, off in calm mode.
export function SparkleCursor() {
  const { calm } = usePrefs();
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || calm) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const particles: Particle[] = [];
    let frame = 0;
    let last = 0;

    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const p = particles[index];
        if (!p) continue;
        p.life -= 0.03;
        if (p.life <= 0) {
          particles.splice(index, 1);
          continue;
        }
        p.x += p.vx;
        p.y += p.vy;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        sparkle(ctx, p.x, p.y, p.size * p.life + 1);
      }
      frame = particles.length ? requestAnimationFrame(tick) : 0;
    };

    const move = (event: PointerEvent) => {
      const now = performance.now();
      if (now - last < 30) return;
      last = now;
      particles.push({
        x: event.clientX,
        y: event.clientY,
        vx: (Math.random() - 0.5) * 0.9,
        vy: Math.random() * 0.7 + 0.2,
        life: 1,
        size: 4 + Math.random() * 5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)] ?? "#ff2d78",
      });
      if (particles.length > 44) particles.shift();
      if (!frame) frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frame);
    };
  }, [calm]);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90]" />;
}
