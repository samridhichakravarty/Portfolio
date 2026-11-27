"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { SITE } from "@/lib/site";
import { collect } from "@/lib/collectibles";
import { confetti, sfx } from "@/lib/fx";
import { usePrefs } from "@/lib/prefs";

function useClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: SITE.timeZone }).format(new Date());
    setTime(format());
    const timer = setInterval(() => setTime(format()), 15000);
    return () => clearInterval(timer);
  }, []);
  return time;
}

// Portrait sticker with floating stickers around it. Layers drift a little with the pointer.
export function HeroArt() {
  const { calm } = usePrefs();
  const time = useClock();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 90, damping: 18 });
  const sy = useSpring(py, { stiffness: 90, damping: 18 });
  const far = { x: useTransform(sx, (v) => v * -14), y: useTransform(sy, (v) => v * -14) };
  const near = { x: useTransform(sx, (v) => v * 22), y: useTransform(sy, (v) => v * 22) };

  return (
    <div
      className="relative mx-auto aspect-[1/1.05] w-full max-w-[30rem]"
      onPointerMove={(event) => {
        if (calm || event.pointerType !== "mouse") return;
        const box = event.currentTarget.getBoundingClientRect();
        px.set((event.clientX - box.left) / box.width - 0.5);
        py.set((event.clientY - box.top) / box.height - 0.5);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      <motion.div style={far} className="absolute inset-[6%] rounded-[3rem] bg-gradient-to-br from-pink via-fuchsia to-pink-soft opacity-80 blur-2xl" aria-hidden="true" />

      <motion.div style={near} className="absolute inset-[9%]">
        <motion.div whileHover={{ rotate: 0, scale: 1.02 }} className="sticker relative h-full w-full overflow-hidden bg-surface" style={{ rotate: 3 }}>
          <Image
            src={SITE.portrait}
            alt="Samridhi wearing pink sunglasses against a blue sky"
            width={960}
            height={1050}
            priority
            sizes="(max-width: 768px) 80vw, 420px"
            className="h-full w-full object-cover"
          />
        </motion.div>
      </motion.div>

      <motion.button
        type="button"
        style={near}
        aria-label="Wave hello"
        onClick={(event) => {
          sfx.coin();
          collect("hello");
          const box = event.currentTarget.getBoundingClientRect();
          confetti(box.left + box.width / 2, box.top + box.height / 2, 24);
        }}
        className="sticker absolute -left-1 top-[4%] grid h-20 w-20 place-items-center bg-pink text-4xl !rounded-full"
      >
        <span aria-hidden="true" className="wiggle inline-block">👋</span>
      </motion.button>

      <Image src="/media/burst.webp" alt="" width={96} height={96} aria-hidden="true" className="float absolute -right-2 top-[2%] w-20" style={{ ["--r" as string]: "10deg" }} />
      <Image src="/media/sparkle.webp" alt="" width={64} height={64} aria-hidden="true" className="float absolute right-[12%] bottom-[8%] w-12" style={{ ["--r" as string]: "-8deg", animationDelay: "1s" }} />
      <Image src="/media/heart.webp" alt="" width={64} height={52} aria-hidden="true" className="float absolute -left-3 bottom-[22%] w-14" style={{ ["--r" as string]: "-12deg", animationDelay: "2s" }} />

      <motion.button
        type="button"
        style={near}
        onClick={(event) => {
          collect("clock");
          const box = event.currentTarget.getBoundingClientRect();
          confetti(box.left + 30, box.top, 14);
        }}
        className="sticker absolute -bottom-3 left-[8%] flex items-center gap-3 bg-surface px-4 py-2.5 text-left !rounded-2xl"
      >
        <span aria-hidden="true" className="h-3 w-3 animate-pulse rounded-full bg-pink" />
        <span>
          <span className="label block !text-[0.65rem]">{SITE.city} · IST</span>
          <span className="font-display text-lg font-semibold">{time ?? "—"}</span>
        </span>
      </motion.button>
    </div>
  );
}
