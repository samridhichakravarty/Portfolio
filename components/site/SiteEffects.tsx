"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePrefs } from "@/lib/prefs";
import { collect } from "@/lib/collectibles";
import { confetti } from "@/lib/fx";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

// Page-wide behaviours with no visible markup: smooth scrolling, calm mode flag, easter eggs.
export function SiteEffects() {
  const { calm } = usePrefs();

  useEffect(() => {
    document.documentElement.toggleAttribute("data-calm", calm);
  }, [calm]);

  useEffect(() => {
    if (calm || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1, anchors: { offset: -96 } });
    return () => lenis.destroy();
  }, [calm]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 5) collect("night");

    let progress = 0;
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      progress = key === KONAMI[progress] ? progress + 1 : key === KONAMI[0] ? 1 : 0;
      if (progress === KONAMI.length) {
        progress = 0;
        collect("konami");
        confetti(window.innerWidth / 2, window.innerHeight / 2, 60);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return null;
}
