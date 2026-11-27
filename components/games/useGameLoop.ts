"use client";

import { useEffect, useRef } from "react";

// Fixed-timestep loop. Runs only while `running`, and pauses when the tab is hidden.
export function useGameLoop(update: (dt: number) => void, draw: () => void, running: boolean) {
  const updateRef = useRef(update);
  const drawRef = useRef(draw);

  useEffect(() => {
    updateRef.current = update;
    drawRef.current = draw;
  });

  useEffect(() => {
    if (!running) return;
    const STEP = 1 / 60;
    let raf = 0;
    let last = performance.now();
    let acc = 0;

    const frame = (now: number) => {
      acc += Math.min(0.1, (now - last) / 1000);
      last = now;
      while (acc >= STEP) {
        updateRef.current(STEP);
        acc -= STEP;
      }
      drawRef.current();
      raf = requestAnimationFrame(frame);
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    raf = requestAnimationFrame(frame);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [running]);
}
