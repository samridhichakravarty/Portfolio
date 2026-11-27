"use client";

import { useSyncExternalStore } from "react";

// The sticker album: 12 stickers to find. Saved in this browser only.
// Seven use your sticker art, five are ink-outlined badges.
export const STICKERS = [
  { id: "daisy", art: "/media/daisy.webp", label: "Daisy", hint: "Collect the daisy in the About chapter." },
  { id: "burst", art: "/media/burst.webp", label: "Starburst", hint: "Collect the starburst in the Work chapter." },
  { id: "heart", art: "/media/heart.webp", label: "Heart", hint: "Collect the heart in the Contact chapter." },
  { id: "bolt", art: "/media/bolt.webp", label: "Bolt", hint: "Score 10 in Ship It!" },
  { id: "sparkle", art: "/media/sparkle.webp", label: "Sparkle", hint: "Finish a Build Quest brief." },
  { id: "smile", art: "/media/smile.webp", label: "Smile", hint: "Pull a capsule from the skill machine." },
  { id: "wink", art: "/media/wink.webp", label: "Wink", hint: "Some codes are famous." },
  { id: "match", glyph: "🧠", label: "Stack master", hint: "Win Stack Match." },
  { id: "bugpop", glyph: "🐞", label: "Bug squasher", hint: "Pop 15 bugs in Bug Pop." },
  { id: "recruiter", glyph: "📄", label: "Résumé reader", hint: "Open the recruiter page." },
  { id: "case", glyph: "🔍", label: "Case closed", hint: "Read a case study." },
  { id: "night", glyph: "🌙", label: "Night owl", hint: "Visit late at night." },
] as const;

export type StickerId = (typeof STICKERS)[number]["id"];

type Album = { stickers: StickerId[]; best: Record<string, number>; fresh: StickerId | null };

const KEY = "ship-it:album:v2";
const LEGACY_KEY = "portfolio-stickers";
const EMPTY: Album = { stickers: [], best: {}, fresh: null };
const valid = (id: unknown): id is StickerId => STICKERS.some((sticker) => sticker.id === id);

let album: Album = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(KEY) ?? "null");
    const legacy: unknown = JSON.parse(localStorage.getItem(LEGACY_KEY) ?? "[]");
    const data = (raw && typeof raw === "object" ? raw : {}) as { stickers?: unknown; best?: unknown };
    const found = new Set<StickerId>(Array.isArray(data.stickers) ? data.stickers.filter(valid) : []);
    // Keep stickers earned on the earlier 3-sticker book.
    if (Array.isArray(legacy)) for (const name of legacy) if (valid(name)) found.add(name);
    album = {
      stickers: [...found],
      best: data.best && typeof data.best === "object" ? (data.best as Record<string, number>) : {},
      fresh: null,
    };
  } catch {
    // Private mode or bad data: the album still works for this visit.
  }
}

function commit(next: Album) {
  album = next;
  try {
    localStorage.setItem(KEY, JSON.stringify({ stickers: next.stickers, best: next.best }));
  } catch {
    // Keep the in-memory album.
  }
  listeners.forEach((listener) => listener());
}

export function collect(id: StickerId) {
  load();
  if (album.stickers.includes(id)) return;
  commit({ ...album, stickers: [...album.stickers, id], fresh: id });
}

export function reportScore(game: string, score: number) {
  load();
  if (score <= (album.best[game] ?? 0)) return;
  commit({ ...album, best: { ...album.best, [game]: score } });
}

export function clearFresh() {
  if (album.fresh) commit({ ...album, fresh: null });
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useAlbum() {
  return useSyncExternalStore(
    subscribe,
    () => {
      load();
      return album;
    },
    () => EMPTY,
  );
}
