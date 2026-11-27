import type Lenis from 'lenis';

// One scroll engine for the whole page: the opening creates Lenis and registers it here.
// Every programmatic jump (nav, buttons, scroll cue) goes through scrollToY so it never fights wheel smoothing.
let lenis: Lenis | null = null;

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const headerHeight = () => document.querySelector('header')?.offsetHeight ?? 0;

export function scrollToY(top: number, behavior: 'smooth' | 'instant' = 'smooth') {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const instant = behavior === 'instant' || reduced;
  if (lenis) {
    const distance = Math.abs(top - lenis.scroll);
    lenis.scrollTo(top, {
      immediate: instant,
      duration: Math.min(2.4, Math.max(1.1, 0.9 + distance / 5000)),
      easing: easeInOut,
    });
    return;
  }
  window.scrollTo({ top, behavior: instant ? 'instant' : 'smooth' });
}

export function scrollToElement(target: HTMLElement, behavior: 'smooth' | 'instant' = 'smooth', gap = 0) {
  scrollToY(Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerHeight() - gap), behavior);
}
