// The opening owns the site's Lenis instance. Let it finish a wheel gesture before starting native scrolling.
let cancelPending: (() => void) | undefined;

export function cancelChapterScroll() {
  cancelPending?.();
}

export function scrollAfterWheel(scroll: () => void) {
  cancelChapterScroll();

  const root = document.documentElement;
  if (!root.classList.contains('lenis-smooth')) {
    scroll();
    return;
  }

  const observer = new MutationObserver(() => {
    if (root.classList.contains('lenis-smooth')) return;
    cancel();
    scroll();
  });

  function cancel() {
    observer.disconnect();
    window.removeEventListener('wheel', cancel);
    window.removeEventListener('touchstart', cancel);
    window.removeEventListener('pagehide', cancel);
    cancelPending = undefined;
  }

  cancelPending = cancel;
  observer.observe(root, { attributes: true, attributeFilter: ['class'] });
  window.addEventListener('wheel', cancel, { passive: true });
  window.addEventListener('touchstart', cancel, { passive: true });
  window.addEventListener('pagehide', cancel);
}
