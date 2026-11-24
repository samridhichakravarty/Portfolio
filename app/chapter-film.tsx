'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Chapter = 'about' | 'work' | 'experience' | 'skills' | 'contact';

const motionQuery = '(min-width: 761px) and (prefers-reduced-motion: no-preference)';
const galleryQuery = '(min-width: 1000px) and (min-height: 720px)';
const clamp = gsap.utils.clamp(0, 1);

export default function ChapterFilm({
  chapter,
  className = '',
  open = false,
  onProjectChange,
}: {
  chapter: Chapter;
  className?: string;
  open?: boolean;
  onProjectChange?: (index: number) => void;
}) {
  const film = useRef<HTMLDivElement>(null);
  const player = useRef<HTMLVideoElement>(null);
  const changeEnvelope = useRef<((isOpen: boolean) => void) | null>(null);
  const isOpen = useRef(open);

  useEffect(() => {
    isOpen.current = open;
    changeEnvelope.current?.(open);
  }, [open]);

  useEffect(() => {
    const frame = film.current;
    const video = player.current;
    const section = frame?.closest<HTMLElement>('[data-chapter]');
    if (!frame || !video || !section) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ desktop: motionQuery, gallery: galleryQuery }, context => {
      if (!context.conditions?.desktop) return;

      const pinned = chapter === 'work' && context.conditions.gallery;
      const playhead = { value: 0 };
      let triggerProgress = 0;
      let lastIndex = -1;
      let envelopeTween: gsap.core.Tween | undefined;

      function seek() {
        if (!video || video.seeking || !Number.isFinite(video.duration) || video.error) return;
        const time = playhead.value * Math.max(0, video.duration - 0.075);
        if (Math.abs(video.currentTime - time) > 0.026) video.currentTime = time;
      }

      function showFirstFrame() {
        if (frame) frame.dataset.ready = 'true';
        seek();
      }

      function update(progress: number) {
        triggerProgress = progress;
        section?.style.setProperty('--chapter-progress', progress.toFixed(4));
        if (pinned) {
          const index = progress >= 0.5 ? 1 : 0;
          if (lastIndex !== index) {
            lastIndex = index;
            onProjectChange?.(index);
          }
        }
        if (envelopeTween?.isActive() || (chapter === 'contact' && isOpen.current)) return;
        playhead.value = chapter === 'contact' ? progress * 0.26 : clamp(progress * 1.09);
        seek();
      }

      const observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        observer.disconnect();
        video.preload = 'auto';
        video.src = '/media/chapters/' + chapter + '.mp4';
        video.load();
      }, { rootMargin: '300px 0px' });

      if (pinned) section.dataset.gallery = 'true';
      section.dataset.chapterMotion = 'true';
      observer.observe(frame);
      video.addEventListener('loadedmetadata', seek);
      video.addEventListener('seeked', seek);
      video.addEventListener('loadeddata', showFirstFrame);

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: pinned ? () => 'top top+=' + (document.querySelector('header')?.offsetHeight ?? 0) : 'top 76%',
        end: pinned ? 'bottom bottom' : 'bottom 34%',
        invalidateOnRefresh: true,
        onUpdate: self => update(self.progress),
        onRefresh: self => update(self.progress),
      });
      update(trigger.progress);

      if (chapter === 'contact') {
        changeEnvelope.current = next => {
          envelopeTween?.kill();
          envelopeTween = gsap.to(playhead, {
            value: next ? 0.95 : triggerProgress * 0.26,
            duration: next ? 1.35 : 0.55,
            ease: 'power2.inOut',
            onUpdate: seek,
            onComplete: () => update(triggerProgress),
          });
        };
        if (isOpen.current) changeEnvelope.current(true);
      }

      return () => {
        observer.disconnect();
        trigger.kill();
        envelopeTween?.kill();
        changeEnvelope.current = null;
        video.removeEventListener('loadedmetadata', seek);
        video.removeEventListener('seeked', seek);
        video.removeEventListener('loadeddata', showFirstFrame);
        video.pause();
        if (video.hasAttribute('src')) {
          video.removeAttribute('src');
          video.load();
        }
        delete frame.dataset.ready;
        delete section.dataset.gallery;
        delete section.dataset.chapterMotion;
        section.style.removeProperty('--chapter-progress');
      };
    });
    ScrollTrigger.refresh();

    return () => media.revert();
  }, [chapter, onProjectChange]);

  const still = chapter === 'contact' && open ? 'contact-open' : chapter;
  return (
    <div ref={film} className={'chapter-film ' + className} data-film={chapter} aria-hidden="true">
      <img src={'/media/chapters/' + still + '.webp'} alt="" width={1040} height={585} loading="lazy" decoding="async" />
      <video ref={player} muted playsInline preload="none" tabIndex={-1} onError={() => { if (film.current) delete film.current.dataset.ready; }} />
    </div>
  );
}
