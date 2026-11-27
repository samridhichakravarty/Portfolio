"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { GameShell } from "./GameShell";
import { collect, reportScore, useAlbum } from "@/lib/collectibles";
import { usePrefs } from "@/lib/prefs";
import { confetti, sfx } from "@/lib/fx";

type Status = "idle" | "playing" | "over";

// Whack-a-bug. Click or tap the bug, or press keys 1 to 9. Calm mode gives more time and slower bugs.
export function BugPop() {
  const { calm } = usePrefs();
  const { best } = useAlbum();
  const duration = calm ? 45 : 30;
  const [status, setStatus] = useState<Status>("idle");
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(duration);
  const [active, setActive] = useState<number | null>(null);
  const run = useRef({ score: 0, endAt: 0 });
  const holder = useRef<HTMLDivElement>(null);

  function start() {
    run.current = { score: 0, endAt: performance.now() + duration * 1000 };
    setScore(0);
    setLeft(duration);
    setStatus("playing");
    holder.current?.focus();
  }

  useEffect(() => {
    if (status !== "playing") return;
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
        setStatus("over");
        sfx.win();
        reportScore("bugpop", run.current.score);
        if (run.current.score >= 15) {
          collect("bugpop");
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
    if (status !== "playing" || index !== active) return;
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
      stats={[{ label: "Popped", value: score }, { label: "Time", value: status === "playing" ? left : duration }, { label: "Best", value: best.bugpop ?? 0 }]}
    >
      <div
        ref={holder}
        tabIndex={0}
        role="group"
        aria-label="Bug Pop game. Press keys 1 to 9 to pop bugs."
        onKeyDown={(event) => {
          const n = Number(event.key);
          if (n >= 1 && n <= 9) pop(n - 1);
        }}
        className="rounded-3xl"
      >
        <div className="mx-auto grid max-w-sm grid-cols-3 gap-3 sm:gap-4">
          {Array.from({ length: 9 }, (_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => pop(index)}
              aria-label={`Hole ${index + 1}${active === index ? ", bug here" : ""}`}
              className="relative grid aspect-square place-items-center overflow-hidden rounded-full border-2 border-border bg-bg shadow-[inset_0_8px_16px_rgba(0,0,0,0.6)]"
            >
              <motion.span
                aria-hidden="true"
                initial={false}
                animate={{ y: active === index ? 0 : 70, scale: active === index ? 1 : 0.6 }}
                transition={{ type: "spring", stiffness: 420, damping: 22 }}
                className="text-4xl sm:text-5xl"
              >
                🐞
              </motion.span>
            </button>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" className="btn btn-primary" onClick={start} disabled={status === "playing"}>
            {status === "over" ? "Play again" : "Start"}
          </button>
          <p className="font-display text-lg" aria-live="polite">
            {status === "over" ? `Time! You popped ${score}. ${score >= 15 ? "Sticker unlocked! 🎉" : "15 earns a sticker."}` : ""}
          </p>
        </div>
      </div>
    </GameShell>
  );
}
