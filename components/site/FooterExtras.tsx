"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { usePrefs, setPref } from "@/lib/prefs";
import { collect } from "@/lib/collectibles";
import { confetti, sfx } from "@/lib/fx";

// Footer controls: a heart friend to be kind to, plus calm mode and sound switches.
export function FooterExtras() {
  const { calm, sound } = usePrefs();
  const taps = useRef(0);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <motion.button
        type="button"
        whileTap={{ scale: 0.8, rotate: -10 }}
        whileHover={{ scale: 1.15 }}
        className="grid h-11 w-11 place-items-center rounded-full border border-border text-xl"
        aria-label="Heart friend. Be kind to it."
        onClick={(event) => {
          sfx.pop();
          const box = event.currentTarget.getBoundingClientRect();
          confetti(box.left + box.width / 2, box.top, 10);
          taps.current += 1;
          if (taps.current >= 5) collect("mascot");
        }}
      >
        <span aria-hidden="true">💖</span>
      </motion.button>
      <button
        type="button"
        aria-pressed={calm}
        onClick={() => setPref("calm", !calm)}
        className="rounded-full border border-border px-4 py-2 font-mono text-xs text-muted-2 transition-colors hover:bg-pink/10 aria-pressed:bg-pink/15 aria-pressed:text-pink-soft"
      >
        Calm mode: {calm ? "on" : "off"}
      </button>
      <button
        type="button"
        aria-pressed={sound}
        onClick={() => setPref("sound", !sound)}
        className="rounded-full border border-border px-4 py-2 font-mono text-xs text-muted-2 transition-colors hover:bg-pink/10 aria-pressed:bg-pink/15 aria-pressed:text-pink-soft"
      >
        Sound: {sound ? "on" : "off"}
      </button>
    </div>
  );
}
