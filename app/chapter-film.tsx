'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Chapter = 'about' | 'work' | 'experience' | 'skills' | 'contact';
type Range = readonly [start: number, end: number];

export type ChapterMoment = { seconds: number; lift: number };

const desktopQuery = '(min-width: 761px) and (prefers-reduced-motion: no-preference)';
const desktopPin = '(min-width: 1000px) and (min-height: 720px)';
const fps = 24;

const cuts = {
  about: { seconds: [0.08, 16 / 3], through: 0.47, join: [0.425, 0.58], lift: [0.54, 0.87], leave: [0.87, 1] },
  work: { seconds: [0.06, 2.5], through: 0.72, join: [0.47, 0.8], lift: [0.52, 0.87], leave: [0.86, 1] },
  experience: { seconds: [0.13, 6.67], through: 0.94, join: [0.39, 0.49], lift: [0.72, 0.96], leave: [0.89, 1] },
  skills: { seconds: [0.08, 19 / 3], through: 0.71, join: [0.57, 0.89], lift: [0.64, 0.94], leave: [0.87, 1] },
  contact: { seconds: [0.08, 6], through: 0.65, join: [0.645, 0.79], lift: [0.77, 0.94], leave: [0.94, 1] },
} as const;

const landings = [
  { frame: 7 / 3, approach: [0, 0.20], enter: [0.15, 0.235], exit: [0.31, 0.389] },
  { frame: 3, approach: [0.325, 0.465], enter: [0.418, 0.50], exit: [0.57, 0.64] },
  { frame: 6, approach: [0.59, 0.768], enter: [0.72, 0.809], exit: [0.929, 0.995] },
] as const;

export const careerStops = [0.264, 0.528, 0.854] as const;

// Constant speed through the middle, with a short acceleration and brake.
function travelEase(progress: number) {
  const ramp = 0.08;
  const distance = 1 - ramp;
  if (progress < ramp) return progress * progress / (2 * ramp * distance);
  if (progress > 1 - ramp) return 1 - (1 - progress) ** 2 / (2 * ramp * distance);
  return (progress - ramp / 2) / distance;
}

function createVideoScrub(video: HTMLVideoElement, frame: HTMLElement, presented: (seconds: number) => void) {
  let targetFrame = 0;
  let requestedFrame = -1;
  let scheduled = 0;
  let nearby = false;
  let lastPresentedFrame = -1;

  function showDecodedFrame() {
    if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
    frame.dataset.ready = 'true';
    const index = Math.floor(video.currentTime * fps + 0.001);
    if (lastPresentedFrame === index) return;
    lastPresentedFrame = index;
    presented(index / fps);
  }

  function flush() {
    scheduled = 0;
    if (!nearby || video.seeking || video.error || !Number.isFinite(video.duration) || video.duration <= 0) return;
    const lastFrame = Math.max(0, Math.floor((video.duration - 0.045) * fps));
    const index = Math.min(targetFrame, lastFrame);
    if (index !== requestedFrame) {
      requestedFrame = index;
      if (Math.floor(video.currentTime * fps + 0.001) !== index) {
        video.currentTime = (index + 0.2) / fps;
        return;
      }
    }
    showDecodedFrame();
  }

  function schedule() {
    if (nearby && !scheduled) scheduled = requestAnimationFrame(flush);
  }

  function onSeeked() {
    showDecodedFrame();
    schedule();
  }

  video.addEventListener('loadedmetadata', schedule);
  video.addEventListener('loadeddata', schedule);
  video.addEventListener('seeked', onSeeked);
  return {
    seek(seconds: number) {
      const index = Math.max(0, Math.round(seconds * fps));
      if (targetFrame === index) return;
      targetFrame = index;
      schedule();
    },
    setNearby(value: boolean) {
      nearby = value;
      if (value) schedule();
    },
    destroy() {
      cancelAnimationFrame(scheduled);
      video.removeEventListener('loadedmetadata', schedule);
      video.removeEventListener('loadeddata', schedule);
      video.removeEventListener('seeked', onSeeked);
    },
  };
}

function measureGallery(section: HTMLElement) {
  const rail = section.querySelector<HTMLElement>('.project-rail');
  const travel = Math.max(1, rail ? rail.scrollWidth - rail.clientWidth : 1);
  const intro = Math.round(Math.max(295, Math.min(420, travel * 0.3)));
  const hold = Math.round(Math.max(62, Math.min(93, travel * 0.065)));
  const release = Math.round(Math.max(115, Math.min(156, travel * 0.12)));
  const distance = intro + hold + travel + release;
  section.style.setProperty('--gallery-distance', distance + 'px');
  section.style.setProperty('--gallery-first', String(intro + hold * 0.5));
  section.style.setProperty('--gallery-second', String(intro + hold + travel + release * 0.28));
  return { travel, intro, hold, release, distance };
}

export default function ChapterFilm({
  chapter,
  className = '',
  open = false,
  onProjectChange,
  onCareerChange,
  onMotion,
}: {
  chapter: Chapter;
  className?: string;
  open?: boolean;
  onProjectChange?: (index: number) => void;
  onCareerChange?: (index: number) => void;
  onMotion?: (moment: ChapterMoment) => void;
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

    const cut = cuts[chapter];
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ desktop: desktopQuery, wide: desktopPin }, context => {
      if (!context.conditions?.desktop) return;

      const arcade = context.conditions.wide && chapter === 'experience';
      const letter = context.conditions.wide && chapter === 'contact';
      const pinned = context.conditions.wide && (chapter === 'work' || chapter === 'about' || arcade);
      const workGallery = pinned && chapter === 'work';
      const usesStage = chapter === 'skills' || chapter === 'contact';
      const triggerElement = pinned || chapter === 'experience' ? section : usesStage ? frame.parentElement ?? frame : frame;
      const timeline = gsap.timeline({ paused: true });
      const motion = { clock: 0, seconds: cut.seconds[0] as number, join: 0, lift: 0, leave: 0, track: 0 };
      const cards = [0, 1, 2].map(() => ({ visibility: 0 }));
      const envelope = { open: 0 };
      const styleCache = new Map<string, string>();
      let progress = 0;
      let lastIndex = -2;
      let displayedSeconds: number = cut.seconds[0];
      let timingKey = '';
      let envelopeTween: gsap.core.Tween | undefined;
      const scrubber = createVideoScrub(video, frame, seconds => {
        displayedSeconds = seconds;
        onMotion?.({ seconds, lift: motion.lift });
      });

      function write(name: string, value: number) {
        const rounded = value.toFixed(4);
        if (styleCache.get(name) === rounded) return;
        section?.style.setProperty(name, rounded);
        styleCache.set(name, rounded);
      }

      function phase(key: keyof typeof motion, [start, finish]: Range, ease = 'power1.inOut') {
        timeline.to(motion, { [key]: 1, duration: finish - start, ease }, start);
      }

      function configure() {
        if (!section) return;
        const gallery = workGallery ? measureGallery(section) : null;
        const key = gallery ? String(gallery.distance) : chapter;
        if (key === timingKey) return;
        timingKey = key;
        timeline.progress(0, true).clear();
        timeline.to(motion, { clock: 1, duration: 1, ease: 'none' }, 0);

        const lead = gallery ? gallery.intro / gallery.distance : 1;
        if (arcade) {
          landings.forEach((landing, index) => {
            const [start, end] = landing.approach;
            timeline.to(motion, { seconds: landing.frame, duration: end - start, ease: travelEase }, start);
            timeline.to(cards[index], { visibility: 1, duration: landing.enter[1] - landing.enter[0], ease: 'power2.out' }, landing.enter[0]);
            timeline.to(cards[index], { visibility: 0, duration: landing.exit[1] - landing.exit[0], ease: 'power1.in' }, landing.exit[0]);
          });
          timeline.to(motion, { seconds: 6.67, duration: 0.07, ease: travelEase }, 0.93);
        } else if (chapter === 'skills') {
          timeline.to(motion, { seconds: 11 / 3, duration: 0.32, ease: travelEase }, 0);
          timeline.to(motion, { seconds: cut.seconds[1], duration: cut.through - 0.32, ease: 'none' }, 0.32);
        } else {
          timeline.to(motion, { seconds: cut.seconds[1], duration: gallery ? lead * 0.72 : cut.through, ease: travelEase }, 0);
        }
        phase('join', gallery ? [lead * 0.57, lead * 0.96] : cut.join);
        phase('lift', gallery ? [lead * 0.62, lead] : cut.lift, 'power2.inOut');
        phase('leave', gallery ? [1 - gallery.release / gallery.distance, 1] : cut.leave, 'power1.in');

        if (gallery) {
          const start = lead + gallery.hold / gallery.distance;
          timeline.to(motion, { track: 1, duration: gallery.travel / gallery.distance, ease: travelEase }, start);
        }
      }

      function render() {
        const playhead = chapter === 'contact' ? progress + (0.95 - progress) * envelope.open : progress;
        timeline.progress(chapter === 'contact' ? Math.max(progress, playhead) : playhead);
        write('--chapter-progress', progress);
        write('--chapter-handoff', motion.join);
        write('--chapter-lift', motion.lift);
        write('--chapter-exit', motion.leave);
        if (workGallery) {
          write('--gallery-progress', motion.track);
          const index = motion.track >= 0.5 ? 1 : 0;
          if (lastIndex !== index) {
            lastIndex = index;
            onProjectChange?.(index);
          }
        }
        if (arcade) {
          cards.forEach((card, index) => write('--career-' + index, card.visibility));
          const index = cards.findIndex(card => card.visibility > 0.5);
          if (lastIndex !== index) {
            lastIndex = index;
            onCareerChange?.(index);
          }
        }
        if (pinned && chapter === 'about') section?.toggleAttribute('data-book-ready', motion.lift > 0.84);
        if (chapter === 'skills') section?.toggleAttribute('data-skill-ready', motion.lift > 0.9);
        if (letter) section?.toggleAttribute('data-letter-ready', motion.join > 0.95);
        onMotion?.({ seconds: displayedSeconds, lift: motion.lift });
        scrubber.seek(motion.seconds);
      }

      if (pinned) section.dataset[workGallery ? 'gallery' : arcade ? 'arcadePin' : 'bookPin'] = 'true';
      if (letter) section.dataset.letterScene = 'true';
      section.dataset.chapterMotion = 'true';
      configure();

      const observer = new IntersectionObserver(([entry]) => {
        if (!entry) return;
        scrubber.setNearby(entry.isIntersecting);
        if (entry.isIntersecting && !video.hasAttribute('src')) {
          video.preload = 'auto';
          video.src = '/media/chapters/' + chapter + '.mp4';
          video.load();
        }
      }, { rootMargin: '440px 0px' });
      observer.observe(frame.parentElement ?? frame);

      const finishesInView = chapter === 'skills' || letter;
      const trigger = ScrollTrigger.create({
        trigger: triggerElement,
        start: pinned
          ? () => 'top top+=' + (document.querySelector('header')?.offsetHeight ?? 0)
          : finishesInView ? 'top 65%' : usesStage ? 'top 63%' : 'top 74%',
        end: pinned ? 'bottom bottom' : finishesInView
          ? () => 'top top+=' + ((document.querySelector('header')?.offsetHeight ?? 0) + 22)
          : chapter === 'experience' ? 'bottom 46%' : 'bottom 29%',
        invalidateOnRefresh: true,
        onRefreshInit: workGallery ? configure : undefined,
        onUpdate: self => { progress = self.progress; render(); },
        onRefresh: self => { progress = self.progress; render(); },
      });
      progress = trigger.progress;
      render();

      if (chapter === 'contact') {
        changeEnvelope.current = next => {
          envelopeTween?.kill();
          envelopeTween = gsap.to(envelope, {
            open: next ? 1 : 0,
            duration: next ? 0.94 : 0.55,
            ease: 'power1.inOut',
            onUpdate: render,
          });
        };
        if (isOpen.current) changeEnvelope.current(true);
      }

      return () => {
        observer.disconnect();
        scrubber.destroy();
        trigger.kill();
        timeline.kill();
        envelopeTween?.kill();
        changeEnvelope.current = null;
        video.pause();
        if (video.hasAttribute('src')) {
          video.removeAttribute('src');
          video.load();
        }
        delete frame.dataset.ready;
        delete section.dataset.gallery;
        delete section.dataset.bookPin;
        delete section.dataset.bookReady;
        delete section.dataset.arcadePin;
        delete section.dataset.skillReady;
        delete section.dataset.letterScene;
        delete section.dataset.letterReady;
        delete section.dataset.chapterMotion;
        for (const key of styleCache.keys()) section.style.removeProperty(key);
        for (const name of ['--gallery-distance', '--gallery-first', '--gallery-second']) section.style.removeProperty(name);
      };
    });
    return () => media.revert();
  }, [chapter, onProjectChange, onCareerChange, onMotion]);

  const landingStill = chapter === 'about' || chapter === 'contact' ? chapter + '-open' : null;
  return (
    <div ref={film} className={'chapter-film ' + className} data-film={chapter} data-open={chapter === 'contact' && open || undefined} aria-hidden="true">
      <picture>
        {chapter !== 'contact' && <source media={desktopQuery} srcSet={'/media/chapters/' + chapter + '-entry.webp'} />}
        <img src={'/media/chapters/' + chapter + '.webp'} alt="" width={1040} height={585} loading="lazy" decoding="async" />
      </picture>
      <video ref={player} muted playsInline preload="none" tabIndex={-1} onError={() => { if (film.current) delete film.current.dataset.ready; }} />
      {landingStill && <img className="chapter-landing-frame" src={'/media/chapters/' + landingStill + '.webp'} alt="" width={1040} height={585} loading="lazy" />}
    </div>
  );
}
