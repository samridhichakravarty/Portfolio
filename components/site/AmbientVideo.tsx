'use client';

import { useEffect, useRef } from 'react';

type Film = 'about' | 'work' | 'experience' | 'skills' | 'contact';

// One of your chapter films as a looping window. The still poster shows first; the film starts only when
// it is on screen, never with reduced motion or data saver, and pauses when scrolled away.
export function AmbientVideo({ name, label }: { name: Film; label: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const holder = frame.current;
    const player = video.current;
    if (!holder || !player) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      if (entry.isIntersecting) {
        if (!player.getAttribute('src')) player.src = `/media/chapters/${name}.mp4`;
        player.play().then(() => holder.setAttribute('data-playing', '')).catch(() => undefined);
      } else player.pause();
    }, { threshold: 0.25 });
    observer.observe(holder);
    return () => {
      observer.disconnect();
      player.pause();
    };
  }, [name]);

  return (
    <div ref={frame} className="s-film" role="img" aria-label={label}>
      <img src={`/media/chapters/${name}.webp`} alt="" width={1040} height={585} />
      <video ref={video} muted loop playsInline preload="none" tabIndex={-1} aria-hidden="true" />
    </div>
  );
}
