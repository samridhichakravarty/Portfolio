"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SKILL_GROUPS } from "@/lib/data";
import { collect } from "@/lib/collectibles";
import { confetti, sfx } from "@/lib/fx";

const ALL = SKILL_GROUPS.flatMap((group) => group.items.map((name) => ({ name, group: group.name })));
const CHEERS = ["Nice pull!", "Ooh, sparkly!", "Lucky you!", "Capsule cracked!", "Fresh from the machine!"];
const DOTS = ["#ff2d78", "#ff7eb3", "#d946ef", "#fff5fa", "#ff2d78", "#d946ef", "#ff7eb3", "#fff5fa", "#ff2d78"];

type Pull = { name: string; group: string; cheer: string; id: number };

// A capsule machine: each pull reveals one of my skills. All skills are also listed as plain text below it.
export function SkillGacha() {
  const reduce = useReducedMotion();
  const [pulled, setPulled] = useState<string[]>([]);
  const [current, setCurrent] = useState<Pull | null>(null);
  const [dropping, setDropping] = useState(false);
  const counter = useRef(0);
  const button = useRef<HTMLButtonElement>(null);

  function pull() {
    if (dropping) return;
    const pool = ALL.filter((skill) => !pulled.includes(skill.name));
    const list = pool.length ? pool : ALL;
    const pick = list[Math.floor(Math.random() * list.length)] ?? ALL[0];
    if (!pick) return;
    setDropping(true);
    setCurrent(null);
    sfx.pop();
    window.setTimeout(() => {
      counter.current += 1;
      setCurrent({ ...pick, cheer: CHEERS[counter.current % CHEERS.length] ?? "Nice pull!", id: counter.current });
      setPulled((list) => (list.includes(pick.name) ? list : [...list, pick.name]));
      setDropping(false);
      collect("capsule");
      sfx.coin();
      const box = button.current?.getBoundingClientRect();
      if (box) confetti(box.left + box.width / 2, box.top, 18);
    }, reduce ? 0 : 900);
  }

  return (
    <div className="grid items-center gap-6 md:grid-cols-[minmax(0,18rem)_1fr]">
      <div className="mx-auto w-full max-w-[18rem]">
        <div className="sticker relative overflow-hidden bg-surface p-5 pb-6 text-center">
          <div aria-hidden="true" className="relative mx-auto grid h-36 w-36 grid-cols-3 place-items-center gap-1 rounded-full border-4 border-text/90 bg-pink/10 p-5">
            {DOTS.map((color, index) => (
              <motion.span
                key={index}
                className="h-8 w-8 rounded-full border-2 border-text/80"
                style={{ background: color }}
                animate={dropping && !reduce ? { y: [0, -8, 4, 0], rotate: [0, 12, -12, 0] } : {}}
                transition={{ duration: 0.5, repeat: dropping ? 1 : 0, delay: index * 0.03 }}
              />
            ))}
          </div>
          <button
            ref={button}
            type="button"
            onClick={pull}
            disabled={dropping}
            className="btn btn-primary mt-5 w-full"
          >
            {dropping ? "Rolling..." : "Pull a capsule 🍬"}
          </button>
          <p className="mt-3 font-mono text-xs text-muted-2">{pulled.length} of {ALL.length} skills met</p>
        </div>
      </div>

      <div className="min-h-[11rem]" aria-live="polite">
        <AnimatePresence mode="wait">
          {current ? (
            <motion.div
              key={current.id}
              initial={reduce ? false : { opacity: 0, y: -50, rotate: -8, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 260, damping: 16 }}
              className="sticker bg-gradient-to-br from-pink to-fuchsia p-6 text-white"
            >
              <p className="label !text-white/85">{current.cheer}</p>
              <p className="mt-2 font-display text-4xl font-bold sm:text-5xl">{current.name}</p>
              <p className="mt-2 text-white/90">Part of my {current.group} toolkit.</p>
            </motion.div>
          ) : (
            <motion.p key="hint" initial={false} className="font-display text-2xl text-muted-2">
              {dropping ? "Here it comes..." : "Pull the lever to meet a skill!"}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
