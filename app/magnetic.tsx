'use client';

import { useEffect } from 'react';

const targets = '.nav-contact, .intro-actions .s-btn, .post-submit, .post-links a, .post-email, .scroll-cue';
const pull = 0.25;
const limit = 7;

// A small pull toward the pointer on call-to-action links. Fine pointers only, never with reduced motion.
export default function Magnetic() {
  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    if (!query.matches) return;
    const cleanups: Array<() => void> = [];

    for (const element of document.querySelectorAll<HTMLElement>(targets)) {
      const move = (event: PointerEvent) => {
        const box = element.getBoundingClientRect();
        const x = Math.max(-limit, Math.min(limit, (event.clientX - box.left - box.width / 2) * pull));
        const y = Math.max(-limit, Math.min(limit, (event.clientY - box.top - box.height / 2) * pull));
        element.style.translate = x.toFixed(1) + 'px ' + y.toFixed(1) + 'px';
      };
      const reset = () => { element.style.translate = ''; };
      element.classList.add('magnetic');
      element.addEventListener('pointermove', move);
      element.addEventListener('pointerleave', reset);
      cleanups.push(() => {
        element.removeEventListener('pointermove', move);
        element.removeEventListener('pointerleave', reset);
        element.classList.remove('magnetic');
        reset();
      });
    }
    return () => cleanups.forEach(run => run());
  }, []);

  return null;
}
