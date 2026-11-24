'use client';

import { useImperativeHandle, useRef, type Ref } from 'react';
import type { ChapterMoment } from './chapter-film';

type Point = readonly [x: number, y: number, radius: number];

const tracks = [
  { name: 'Python', tone: 0, points: [[.105,.555,.052],[.186,.614,.055],[.337,.696,.052],[.453,.729,.046],[.542,.743,.044],[.608,.730,.040],[.656,.706,.039],[.691,.666,.036],[.706,.624,.035]] },
  { name: 'JavaScript', tone: 0, points: [[.828,.566,.057],[.822,.568,.053],[.799,.540,.050],[.777,.507,.042],[.749,.477,.040],[.720,.437,.035],[.688,.406,.033],[.657,.375,.031],[.623,.350,.028]] },
  { name: 'React.js', tone: 1, points: [[.414,.602,.058],[.563,.686,.061],[.678,.684,.054],[.719,.671,.051],[.739,.635,.047],[.746,.599,.047],[.741,.548,.044],[.727,.511,.039],[.714,.465,.033]] },
  { name: 'Next.js', tone: 1, points: [[.755,.470,.043],[.731,.415,.033],[.672,.370,.022],[.584,.336,.024],[.564,.310,.034],[.519,.303,.035],[.469,.290,.035],[.437,.288,.030],[.409,.341,.029]] },
  { name: 'Node.js', tone: 2, points: [[.224,.602,.062],[.350,.661,.054],[.489,.729,.051],[.587,.740,.045],[.670,.718,.043],[.699,.684,.042],[.722,.650,.036],[.731,.593,.036],[.718,.540,.032]] },
  { name: 'MongoDB', tone: 2, points: [[.032,.669,0],[.129,.633,0],[.236,.647,.044],[.312,.685,.047],[.400,.725,.050],[.471,.752,.047],[.542,.753,.046],[.596,.739,.044],[.637,.732,.042]] },
] as const satisfies readonly { name: string; tone: number; points: readonly Point[] }[];

// These centers were measured every eight frames of the 24 fps source.
const firstFrame = 88;
const sampleStride = 8;
const frameRate = 24;
const clamp = (value: number) => Math.min(1, Math.max(0, value));
const mix = (from: number, to: number, weight: number) => from + (to - from) * weight;

function sample(points: readonly Point[], seconds: number): Point {
  const time = Math.max(0, Math.min(points.length - 1, (seconds * frameRate - firstFrame) / sampleStride));
  const index = Math.floor(time);
  const a = points[index];
  const b = points[Math.min(points.length - 1, index + 1)];
  return [mix(a[0], b[0], time - index), mix(a[1], b[1], time - index), mix(a[2], b[2], time - index)];
}

type Anchors = {
  width: number;
  height: number;
  targets: { x: number; y: number; badgeWidth: number }[];
  badges: HTMLElement[];
  masks: SVGEllipseElement[];
};

export default function SkillFlight({ ref }: { ref: Ref<(moment: ChapterMoment) => void> }) {
  const layer = useRef<HTMLDivElement>(null);
  const anchors = useRef<Anchors | null>(null);

  useImperativeHandle(ref, () => ({ seconds, lift }) => {
    const plane = layer.current;
    const board = plane?.parentElement;
    if (!plane || !board) return;

    const appear = clamp((seconds - 3.58) / 0.43);
    const dissolve = clamp((lift - 0.82) / 0.18);
    if (appear <= 0 || dissolve >= 1 || board.closest('[data-engaged]')) {
      delete plane.dataset.flight;
      if (anchors.current) for (const shape of anchors.current.masks) shape.setAttribute('opacity', '0');
      return;
    }

    const width = board.clientWidth;
    const height = board.clientHeight;
    if (!width || !height) return;
    if (!anchors.current || anchors.current.width !== width || anchors.current.height !== height) {
      const bounds = board.getBoundingClientRect();
      const badges = Array.from(plane.querySelectorAll<HTMLElement>('.skill-flight-badge'));
      const masks = Array.from(plane.querySelectorAll<SVGEllipseElement>('ellipse'));
      const targets = tracks.map(({ name }, index) => {
        const target = board.querySelector<HTMLElement>('[data-flight-target="' + name + '"]')?.getBoundingClientRect();
        return {
          x: target ? target.left - bounds.left - board.clientLeft + target.width / 2 : width / 2,
          y: target ? target.top - bounds.top - board.clientTop + target.height / 2 : height / 2,
          badgeWidth: badges[index]?.offsetWidth || 100,
        };
      });
      anchors.current = { width, height, targets, badges, masks };
    }

    const { targets, badges, masks } = anchors.current;
    const sourceWidth = Math.max(width, height * 16 / 9);
    const sourceHeight = sourceWidth * 9 / 16;
    const xOffset = (width - sourceWidth) / 2;
    const yOffset = (height - sourceHeight) / 2;
    if (!plane.hasAttribute('data-flight')) plane.dataset.flight = 'true';

    tracks.forEach(({ points }, index) => {
      const [x, y, radius] = sample(points, seconds);
      const sourceX = x * sourceWidth + xOffset;
      const sourceY = y * sourceHeight + yOffset;
      const target = targets[index];
      const radiusPixels = radius * sourceWidth;
      const visible = appear * clamp(radius / 0.025);
      const scale = Math.min(1.1, Math.max(0.66, radiusPixels * 2.1 / target.badgeWidth));
      const badge = badges[index];
      badge.style.transform = 'translate3d(' + mix(sourceX, target.x, lift).toFixed(1) + 'px,' + mix(sourceY, target.y, lift).toFixed(1)
        + 'px,0) translate(-50%,-50%) rotate(' + ((index % 2 ? 5 : -5) * (1 - lift)).toFixed(2) + 'deg) scale('
        + mix(scale, 1, lift).toFixed(3) + ')';
      badge.style.opacity = (visible * (1 - dissolve)).toFixed(3);

      const mask = masks[index];
      mask.setAttribute('cx', (sourceX / width).toFixed(4));
      mask.setAttribute('cy', (sourceY / height).toFixed(4));
      mask.setAttribute('rx', (radiusPixels * 1.16 / width).toFixed(4));
      mask.setAttribute('ry', (radiusPixels * 1.16 / height).toFixed(4));
      mask.setAttribute('opacity', (visible * (1 - lift)).toFixed(3));
    });
  }, []);

  return (
    <div ref={layer} className="skill-flight" aria-hidden="true">
      <svg className="skill-flight-mask" width="0" height="0">
        <defs>
          <radialGradient id="skill-mask-edge">
            <stop offset="73%" stopColor="black" />
            <stop offset="100%" stopColor="white" />
          </radialGradient>
          <mask id="skill-shape-mask" maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox" x="0" y="0" width="1" height="1">
            <rect width="1" height="1" fill="white" />
            {tracks.map(({ name }) => <ellipse key={name} cx="0" cy="0" rx="0" ry="0" fill="url(#skill-mask-edge)" opacity="0" />)}
          </mask>
        </defs>
      </svg>
      {tracks.map(({ name, tone }) => (
        <span className={'skill-flight-badge orbit-badge orbit-tone-' + tone} key={name}><span />{name}</span>
      ))}
    </div>
  );
}
