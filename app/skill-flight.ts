import type { ChapterMoment } from './chapter-film';
import skillPaths from './skill-paths.json';

const { frames, fps, tracks, units } = skillPaths;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;

type Anchor = {
  element: HTMLElement;
  slot: number;
  x: number;
  y: number;
  halfWidth: number;
  halfHeight: number;
};

type Position = {
  x: number;
  y: number;
  halfWidth: number;
  halfHeight: number;
  turn: number;
  scale: number;
  opacity: number;
};

function measureAnchors(grid: HTMLElement): Anchor[] {
  return Array.from(grid.querySelectorAll<HTMLElement>('[data-flight-slot]'), element => ({
    element,
    slot: Number(element.dataset.flightSlot),
    x: grid.offsetLeft + element.offsetLeft + element.offsetWidth / 2,
    y: grid.offsetTop + element.offsetTop + element.offsetHeight / 2,
    halfWidth: element.offsetWidth / 2,
    halfHeight: element.offsetHeight / 2,
  }));
}

// Labels take up more room than the original solids. Make room with small local shifts.
function separate(positions: Position[], width: number, height: number) {
  const visible = positions.filter(point => point.opacity > 0.12
    && point.x > -point.halfWidth && point.x < width + point.halfWidth
    && point.y > -point.halfHeight && point.y < height + point.halfHeight);
  for (let pass = 0; pass < 6; pass++) {
    for (let i = 0; i < visible.length; i++) {
      const a = visible[i];
      for (let j = i + 1; j < visible.length; j++) {
        const b = visible[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const overlapX = a.halfWidth + b.halfWidth + 5 - Math.abs(dx);
        const overlapY = a.halfHeight + b.halfHeight + 4 - Math.abs(dy);
        if (overlapX <= 0 || overlapY <= 0) continue;
        if (overlapX < overlapY * 1.35) {
          const push = Math.sign(dx || 1) * overlapX * .46;
          a.x -= push;
          b.x += push;
        } else {
          const push = Math.sign(dy || 1) * overlapY * .46;
          a.y -= push;
          b.y += push;
        }
      }
    }
  }
}

export function createSkillFlight() {
  let layout: { width: number; height: number; anchors: Anchor[] } | undefined;
  let previousMoment = -1;
  let previousLift = -1;

  return (board: HTMLElement, { seconds, lift }: ChapterMoment) => {
    if (board.closest('[data-engaged]')) return;
    if (lift >= .9999) {
      delete board.dataset.flight;
      return;
    }

    const width = board.clientWidth;
    const height = board.clientHeight;
    const grid = board.querySelector<HTMLElement>('.orbit-grid');
    if (!width || !height || !grid) return;
    const resized = !layout || layout.width !== width || layout.height !== height || !board.hasAttribute('data-flight');
    if (resized) layout = { width, height, anchors: measureAnchors(grid) };
    if (!layout || (!resized && previousMoment === seconds && previousLift === lift)) return;
    previousMoment = seconds;
    previousLift = lift;

    const frame = seconds * fps;
    const start = Math.min(Math.floor(frame / 8), frames.length - 2);
    const amount = clamp((frame - frames[start]) / (frames[start + 1] - frames[start]), 0, 1);
    const dock = clamp(lift, 0, 1);
    const spread = mix(1.08, 1.46, clamp((seconds - 2.6) / 2.3, 0, 1));
    const sourceWidth = Math.max(width, height * 16 / 9);
    const sourceHeight = sourceWidth * 9 / 16;
    const stageScale = clamp(width / 920 + .13, .8, 1);

    const positions = layout.anchors.map(({ slot, halfWidth, halfHeight }): Position => {
      const [ax, ay, ar] = tracks[slot][start];
      const [bx, by, br] = tracks[slot][start + 1];
      const radius = mix(ar, br, amount);
      const scale = clamp(.59 + radius / 185, .59, 1.04) * stageScale;
      const turn = (slot % 2 ? 1 : -1) * (5 + slot % 4) + Math.sin(seconds * 1.55 + slot) * 2.4;
      return {
        x: width / 2 + (mix(ax, bx, amount) / units - .5) * sourceWidth * spread,
        y: height * .52 + (mix(ay, by, amount) / units - .52) * sourceHeight * spread,
        halfWidth: (halfWidth + halfHeight * .13) * scale,
        halfHeight: (halfHeight + halfWidth * .13) * scale,
        turn, scale,
        opacity: clamp(radius / 13, 0, 1),
      };
    });
    separate(positions, width, height);

    layout.anchors.forEach(({ element, x, y }, index) => {
      const point = positions[index];
      element.style.setProperty('--skill-x', mix(point.x - x, 0, dock).toFixed(1) + 'px');
      element.style.setProperty('--skill-y', mix(point.y - y, 0, dock).toFixed(1) + 'px');
      element.style.setProperty('--skill-turn', mix(point.turn, 0, dock).toFixed(2) + 'deg');
      element.style.setProperty('--skill-scale', mix(point.scale, 1, dock).toFixed(3));
      element.style.setProperty('--skill-alpha', mix(point.opacity, 1, dock).toFixed(3));
      element.style.setProperty('--skill-depth', String(Math.round(point.scale * 100)));
    });
    board.dataset.flight = 'true';
  };
}
