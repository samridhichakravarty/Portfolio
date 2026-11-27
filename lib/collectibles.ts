"use client";

import { useSyncExternalStore } from "react";

// The sticker album: 12 things to find around the site. Saved in this browser only.
export const STICKERS = [
  { id: "hello", glyph: "👋", label: "Hello wave", hint: "Click the waving sticker in the hero." },
  { id: "clock", glyph: "⏰", label: "Time zone friend", hint: "Click the live clock in the hero." },
  { id: "cartridge", glyph: "🎮", label: "Cartridge", hint: "Open any project." },
  { id: "capsule", glyph: "🍬", label: "Lucky capsule", hint: "Pull a capsule from the skill machine." },
  { id: "runner", glyph: "🚀", label: "Shipped it", hint: "Score 10 or more in Ship It!" },
  { id: "bugpop", glyph: "🐞", label: "Bug squasher", hint: "Pop 15 bugs in Bug Pop." },
  { id: "match", glyph: "🧠", label: "Stack master", hint: "Win Stack Match." },
  { id: "brief", glyph: "💌", label: "Brief sender", hint: "Open a project brief in the builder." },
  { id: "konami", glyph: "🕹️", label: "Old school", hint: "Some codes are famous." },
  { id: "mascot", glyph: "💖", label: "Heart friend", hint: "Be kind to the heart in the footer." },
  { id: "night", glyph: "🌙", label: "Night owl", hint: "Visit late at night." },
  { id: "calm", glyph: "🧘", label: "Calm mode", hint: "Try calm mode." },
] as const;

export type StickerId = (typeof STICKERS)[number]["id"];

type Album = { stickers: StickerId[]; best: Record<string, number>; fresh: StickerId | null };

const KEY = "ship-it:album:v1";
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
    if (raw && typeof raw === "object") {
      const data = raw as { stickers?: unknown; best?: unknown };
      album = {
        stickers: Array.isArray(data.stickers) ? data.stickers.filter(valid) : [],
        best: data.best && typeof data.best === "object" ? (data.best as Record<string, number>) : {},
        fresh: null,
      };
    }
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
