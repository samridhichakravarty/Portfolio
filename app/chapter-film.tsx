'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Chapter = 'about' | 'work' | 'experience' | 'skills' | 'contact';
type Range = readonly [start: number, end: number];

const desktopQuery = '(min-width: 761px) and (prefers-reduced-motion: no-preference)';
const desktopPin = '(min-width: 1000px) and (min-height: 720px)';
const fps = 24;

const cuts = {
  about: { seconds: [0.08, 4.9], through: 0.72, join: [0.44, 0.75], leave: [0.83, 1] },
  work: { seconds: [0.06, 4.85], through: 0.76, join: [0.35, 0.8], leave: [0.86, 1] },
  experience: { seconds: [0.13, 6.9], through: 0.74, join: [0.39, 0.49], leave: [0.83, 1] },
  skills: { seconds: [0.08, 4.9], through: 0.52, join: [0.24, 0.54], leave: [0.76, 1] },
  contact: { seconds: [0.08, 5.65], through: 0.69, join: [0.45, 0.73], leave: [0.86, 1] },
} as const;

// Constant speed through the middle, with a short acceleration and brake.
function travelEase(progress: number) {
  const ramp = 0.08;
  const distance = 1 - ramp;
  if (progress < ramp) return progress * progress / (2 * ramp * distance);
  if (progress > 1 - ramp) return 1 - (1 - progress) ** 2 / (2 * ramp * distance);
  return (progress - ramp / 2) / distance;
}

function createVideoScrub(video: HTMLVideoElement, frame: HTMLElement) {
  let targetFrame = 0;
  let requestedFrame = -1;
  let scheduled = 0;
  let nearby = false;

  function showDecodedFrame() {
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) frame.dataset.ready = 'true';
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
  const intro = Math.round(Math.max(170, Math.min(270, travel * 0.19)));
  const hold = Math.round(Math.max(62, Math.min(93, travel * 0.065)));
  const release = Math.round(Math.max(115, Math.min(156, travel * 0.12)));
  const distance = intro + hold + travel + release;
  section.style.setProperty('--gallery-distance', distance + 'px');
  section.style.setProperty('--gallery-first', String(intro + hold * 0.5));
  section.style.setProperty('--gallery-second', String(intro + hold + travel + release * 0.28));
  return { travel, intro, hold, release, distance };
}

function measureArcadeRoute(section: HTMLElement): Range {
  const track = section.querySelector('.arcade-route')?.getBoundingClientRect();
  if (!track) return [0.24, 0.69];
  const chapter = section.getBoundingClientRect();
  const header = document.querySelector('header')?.offsetHeight ?? 0;
  const start = chapter.top - innerHeight * 0.74;
  const length = chapter.bottom - innerHeight * 0.46 - start;
  const markerY = track.top + track.height / 2;
  const depart = gsap.utils.clamp(0.06, 0.67, (markerY - innerHeight * 0.89 - start) / length);
  const arrive = gsap.utils.clamp(depart + 0.19, 0.94, (markerY - header - 25 - start) / length);
  return [depart, arrive];
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

    const cut = cuts[chapter];
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ desktop: desktopQuery, wide: desktopPin }, context => {
      if (!context.conditions?.desktop) return;

      const pinned = context.conditions.wide && (chapter === 'work' || chapter === 'about');
      const workGallery = pinned && chapter === 'work';
      const usesStage = chapter === 'skills' || chapter === 'contact';
      const triggerElement = pinned || chapter === 'experience' ? section : usesStage ? frame.parentElement ?? frame : frame;
      const scrubber = createVideoScrub(video, frame);
      const timeline = gsap.timeline({ paused: true });
      const motion = { clock: 0, seconds: cut.seconds[0] as number, join: 0, leave: 0, track: 0, route: 0, first: 0, second: 0 };
      const envelope = { open: 0 };
      const styleCache = new Map<string, string>();
      let progress = 0;
      let lastIndex = -1;
      let timingKey = '';
      let envelopeTween: gsap.core.Tween | undefined;

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
        const route = chapter === 'experience' ? measureArcadeRoute(section) : null;
        const key = gallery ? String(gallery.distance) : route ? route.map(value => value.toFixed(4)).join('/') : chapter;
        if (key === timingKey) return;
        timingKey = key;
        timeline.progress(0, true).clear();
        timeline.to(motion, { clock: 1, duration: 1, ease: 'none' }, 0);

        const lead = gallery ? gallery.intro / gallery.distance : 1;
        timeline.to(motion, {
          seconds: cut.seconds[1],
          duration: gallery ? lead : cut.through,
          ease: travelEase,
        }, 0);
        phase('join', gallery ? [lead * 0.51, lead] : cut.join);
        phase('leave', gallery ? [1 - gallery.release / gallery.distance, 1] : cut.leave, 'power1.in');

        if (gallery) {
          const start = lead + gallery.hold / gallery.distance;
          timeline.to(motion, { track: 1, duration: gallery.travel / gallery.distance, ease: travelEase }, start);
        }
        if (route) {
          const [depart, arrive] = route;
          const midpoint = (depart + arrive) / 2;
          phase('route', [depart, arrive], 'none');
          phase('first', [midpoint - 0.12, midpoint], 'power2.out');
          phase('second', [arrive - 0.15, arrive], 'power2.out');
        }
      }

      function render() {
        const playhead = chapter === 'contact' ? progress + (0.77 - progress) * envelope.open : progress;
        timeline.progress(chapter === 'contact' ? Math.max(progress, playhead) : playhead);
        write('--chapter-progress', progress);
        write('--chapter-handoff', motion.join);
        write('--chapter-exit', motion.leave);
        if (workGallery) {
          write('--gallery-progress', motion.track);
          const index = motion.track >= 0.5 ? 1 : 0;
          if (lastIndex !== index) {
            lastIndex = index;
            onProjectChange?.(index);
          }
        }
        if (chapter === 'experience') {
          write('--route-progress', motion.route);
          write('--milestone-first', motion.first);
          write('--milestone-second', motion.second);
        }
        scrubber.seek(motion.seconds);
      }

      if (pinned) section.dataset[chapter === 'work' ? 'gallery' : 'bookPin'] = 'true';
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

      const trigger = ScrollTrigger.create({
        trigger: triggerElement,
        start: pinned
          ? () => 'top top+=' + (document.querySelector('header')?.offsetHeight ?? 0)
          : usesStage ? 'top 63%' : 'top 74%',
        end: pinned ? 'bottom bottom' : chapter === 'experience' ? 'bottom 46%' : 'bottom 29%',
        invalidateOnRefresh: true,
        onRefreshInit: workGallery || chapter === 'experience' ? configure : undefined,
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
        delete section.dataset.chapterMotion;
        for (const key of styleCache.keys()) section.style.removeProperty(key);
        for (const name of ['--gallery-distance', '--gallery-first', '--gallery-second']) section.style.removeProperty(name);
      };
    });
    return () => media.revert();
  }, [chapter, onProjectChange]);

  const still = chapter === 'contact' && open ? 'contact-open' : chapter;
  return (
    <div ref={film} className={'chapter-film ' + className} data-film={chapter} aria-hidden="true">
      <picture>
        {chapter !== 'contact' && <source media={desktopQuery} srcSet={'/media/chapters/' + chapter + '-entry.webp'} />}
        <img src={'/media/chapters/' + still + '.webp'} alt="" width={1040} height={585} loading="lazy" decoding="async" />
      </picture>
      <video ref={player} muted playsInline preload="none" tabIndex={-1} onError={() => { if (film.current) delete film.current.dataset.ready; }} />
    </div>
  );
}
