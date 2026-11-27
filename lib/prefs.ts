"use client";

import { useSyncExternalStore } from "react";
import { collect } from "./collectibles";

// Calm mode turns off decorative motion, the cursor trail and game timers. Sound is off by default.
type Prefs = { calm: boolean; sound: boolean };

const KEY = "ship-it:prefs:v1";
const SERVER: Prefs = { calm: false, sound: false };

let prefs: Prefs = SERVER;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  prefs = { calm: reduced, sound: false };
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (raw && typeof raw === "object") {
      const data = raw as Partial<Prefs>;
      prefs = { calm: data.calm ?? prefs.calm, sound: data.sound ?? false };
    }
  } catch {
    // Use defaults.
  }
}

export function getPrefs() {
  load();
  return prefs;
}

export function setPref(key: keyof Prefs, value: boolean) {
  load();
  prefs = { ...prefs, [key]: value };
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {
    // Keep in memory.
  }
  if (key === "calm" && value) collect("calm");
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function usePrefs() {
  return useSyncExternalStore(subscribe, getPrefs, () => SERVER);
}
