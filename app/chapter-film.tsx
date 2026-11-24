'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Chapter = 'about' | 'work' | 'experience' | 'skills' | 'contact';
type Beat = readonly [progress: number, seconds: number];

const desktopQuery = '(min-width: 761px) and (prefers-reduced-motion: no-preference)';
const wideQuery = '(min-width: 1000px) and (min-height: 720px)';
const clamp = gsap.utils.clamp(0, 1);
export const projectStops = [0.37, 0.81] as const;

// The clips hold their final compositions. Each cut ends at the frame that matches its interface.
const storyboard = {
  about: { frames: [[0, 0.08], [0.24, 2.15], [0.51, 4.4], [0.68, 5.9]], handoff: [0.32, 0.61] },
  work: { frames: [[0, 0.06], [0.12, 1.7], [0.25, 3.8], [0.38, 5.25]], handoff: [0.18, 0.38] },
  experience: { frames: [[0, 0.13], [0.24, 2.0], [0.53, 4.3], [0.89, 7.03]], handoff: [0.25, 0.69] },
  skills: { frames: [[0, 0.05], [0.15, 1.65], [0.32, 3.8], [0.49, 5.2]], handoff: [0.27, 0.48] },
  contact: { frames: [[0, 0.08], [0.19, 1.55], [0.38, 3.45], [0.57, 5.6]], handoff: [0.34, 0.57] },
} as const;

function phase(progress: number, start: number, end: number) {
  const value = clamp((progress - start) / (end - start));
  return value * value * (3 - 2 * value);
}

function mediaTime(progress: number, frames: readonly Beat[]) {
  for (let index = 1; index < frames.length; index += 1) {
    const [end, finish] = frames[index];
    if (progress <= end) {
      const [start, begin] = frames[index - 1];
      return begin + (finish - begin) * clamp((progress - start) / (end - start));
    }
  }
  return frames[frames.length - 1][1];
}

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

    const story = storyboard[chapter];
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ desktop: desktopQuery, wide: wideQuery }, context => {
      if (!context.conditions?.desktop) return;

      const pinned = context.conditions.wide && (chapter === 'work' || chapter === 'about');
      const action = { open: 0 };
      let near = false;
      let progress = 0;
      let lastIndex = -1;
      let envelopeTween: gsap.core.Tween | undefined;

      function seek() {
        if (!near || !video || video.seeking || !Number.isFinite(video.duration) || video.error) return;
        const base = mediaTime(progress, story.frames);
        const time = Math.min(base + (5.9 - base) * action.open, video.duration - 0.06);
        if (Math.abs(video.currentTime - time) >= 0.035) video.currentTime = time;
      }

      function markReady() {
        if (frame) frame.dataset.ready = 'true';
        seek();
      }

      function render() {
        const handoff = phase(progress, story.handoff[0], story.handoff[1]);
        section?.style.setProperty('--chapter-progress', progress.toFixed(4));
        section?.style.setProperty('--chapter-handoff', Math.max(handoff, phase(action.open, 0.54, 0.98)).toFixed(4));
        if (chapter === 'work') {
          const track = phase(progress, 0.43, 0.76);
          section?.style.setProperty('--gallery-progress', track.toFixed(4));
          const index = track >= 0.5 ? 1 : 0;
          if (lastIndex !== index) {
            lastIndex = index;
            onProjectChange?.(index);
          }
        }
        seek();
      }

      const observer = new IntersectionObserver(entries => {
        near = entries.some(entry => entry.isIntersecting);
        if (!near) return;
        if (!video.hasAttribute('src')) {
          video.preload = 'auto';
          video.src = '/media/chapters/' + chapter + '.mp4';
          video.load();
        }
        seek();
      }, { rootMargin: '240px 0px' });

      if (pinned) section.dataset[chapter === 'work' ? 'gallery' : 'bookPin'] = 'true';
      section.dataset.chapterMotion = 'true';
      observer.observe(frame);
      video.addEventListener('loadedmetadata', seek);
      video.addEventListener('seeked', seek);
      video.addEventListener('loadeddata', markReady);

      const usesStage = chapter === 'skills' || chapter === 'contact';
      const triggerElement = pinned || chapter === 'experience' ? section : usesStage ? frame.parentElement ?? frame : frame;
      const trigger = ScrollTrigger.create({
        trigger: triggerElement,
        start: pinned
          ? () => 'top top+=' + (document.querySelector('header')?.offsetHeight ?? 0)
          : usesStage ? 'top 48%' : 'top 74%',
        end: pinned ? 'bottom bottom' : chapter === 'experience' ? 'bottom 46%' : 'bottom 29%',
        invalidateOnRefresh: true,
        onUpdate: self => { progress = self.progress; render(); },
        onRefresh: self => { progress = self.progress; render(); },
      });
      progress = trigger.progress;
      render();

      if (chapter === 'contact') {
        changeEnvelope.current = next => {
          envelopeTween?.kill();
          envelopeTween = gsap.to(action, { open: next ? 1 : 0, duration: next ? 1.1 : 0.6, ease: 'power2.inOut', onUpdate: render });
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
        video.removeEventListener('loadeddata', markReady);
        video.pause();
        if (video.hasAttribute('src')) {
          video.removeAttribute('src');
          video.load();
        }
        delete frame.dataset.ready;
        delete section.dataset.gallery;
        delete section.dataset.bookPin;
        delete section.dataset.chapterMotion;
        for (const key of ['--chapter-progress', '--chapter-handoff', '--gallery-progress']) section.style.removeProperty(key);
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
