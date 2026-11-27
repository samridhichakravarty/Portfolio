"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { STICKERS, useAlbum } from "@/lib/collectibles";

// The sticker album. Hints are always visible so nobody has to guess.
export function AlbumGrid() {
  const { stickers } = useAlbum();
  const complete = stickers.length === STICKERS.length;

  return (
    <div>
      <p className="font-display text-2xl font-semibold" aria-live="polite">
        {stickers.length} of {STICKERS.length} stickers found
      </p>
      <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {STICKERS.map((sticker, index) => {
          const found = stickers.includes(sticker.id);
          return (
            <motion.li
              key={sticker.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03 }}
              className={`card p-4 text-center ${found ? "border-pink/60 shadow-[0_0_30px_-8px_var(--color-glow)]" : "opacity-85"}`}
            >
              <span aria-hidden="true" className={`block text-5xl ${found ? "" : "opacity-25 grayscale"}`}>{found ? sticker.glyph : "❔"}</span>
              <span className="mt-2 block font-display text-lg font-semibold">{found ? sticker.label : "Mystery sticker"}</span>
              <span className="mt-1 block text-sm text-muted-2">{found ? "Collected!" : sticker.hint}</span>
              <span className="sr-only">{found ? "Collected" : "Not found yet"}</span>
            </motion.li>
          );
        })}
      </ul>
      {complete && (
        <div className="sticker mt-8 bg-gradient-to-br from-pink to-fuchsia p-6 text-center">
          <p className="font-display text-2xl font-bold text-white">You found them all! 🎉</p>
          <p className="mt-2 text-white/90">Screenshot this page and send it with your brief. I&apos;d love to hear who found every sticker.</p>
          <Link href="/hire" className="btn mt-4 !bg-white !text-pink">Send a brief</Link>
        </div>
      )}
    </div>
  );
}
