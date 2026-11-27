"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { STICKERS, clearFresh, useAlbum } from "@/lib/collectibles";
import { confetti, sfx } from "@/lib/fx";

// Announces a newly collected sticker. role="status" so screen readers hear it too.
export function StickerToast() {
  const { fresh, stickers } = useAlbum();
  const sticker = STICKERS.find((item) => item.id === fresh);

  useEffect(() => {
    if (!fresh) return;
    confetti(window.innerWidth / 2, window.innerHeight - 90, 22);
    sfx.win();
    const timer = setTimeout(clearFresh, 3600);
    return () => clearTimeout(timer);
  }, [fresh]);

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-[95] flex justify-center px-4">
      <AnimatePresence>
        {sticker && (
          <motion.div
            key={sticker.id}
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="sticker pointer-events-auto flex items-center gap-3 bg-surface px-5 py-3"
          >
            <span aria-hidden="true" className="text-3xl">{sticker.glyph}</span>
            <span>
              <span className="label block">New sticker {stickers.length}/{STICKERS.length}</span>
              <span className="font-display text-lg font-semibold">{sticker.label}</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
