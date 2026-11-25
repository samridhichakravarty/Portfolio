import { bookFrames } from './book-frames';
import type { ChapterMoment } from './chapter-film';

const lastFrame = bookFrames[bookFrames.length - 1][0];
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;

function trackAt(frame: number, slot: 1 | 2) {
  const next = bookFrames.findIndex(([time]) => time >= frame);
  const end = bookFrames[next];
  const start = bookFrames[next - 1];
  if (!end?.[slot]) return null;
  if (!start?.[slot]) return end[0] === frame ? end[slot] : null;

  const amount = (frame - start[0]) / (end[0] - start[0]);
  return start[slot].map((value, index) => mix(value, end[slot]![index], amount));
}

function restingCorners(width: number, height: number, angle: number) {
  const x = width / 2;
  const y = height / 2;
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  return [[-x, -y], [x, -y], [x, y], [-x, y]].flatMap(([u, v]) => [
    x + u * cosine - v * sine,
    y + u * sine + v * cosine,
  ]);
}

// Map the card's rectangle to four points on the turning book page.
function project(width: number, height: number, quad: readonly number[]) {
  const [x0, y0, x1, y1, x2, y2, x3, y3] = quad;
  const dx1 = x1 - x2;
  const dx2 = x3 - x2;
  const dy1 = y1 - y2;
  const dy2 = y3 - y2;
  const sx = x0 - x1 + x2 - x3;
  const sy = y0 - y1 + y2 - y3;
  const area = dx1 * dy2 - dx2 * dy1;
  const g = (sx * dy2 - dx2 * sy) / area;
  const h = (dx1 * sy - sx * dy1) / area;

  const values = [
    (x1 - x0 + g * x1) / width, (y1 - y0 + g * y1) / width, 0, g / width,
    (x3 - x0 + h * x3) / height, (y3 - y0 + h * y3) / height, 0, h / height,
    0, 0, 1, 0,
    x0, y0, 0, 1,
  ];
  return 'matrix3d(' + values.map(value => value.toFixed(8)).join(',') + ')';
}

export function placeBookCards(portrait: HTMLElement, bio: HTMLElement, { seconds, lift }: ChapterMoment) {
  const pages = portrait.parentElement;
  const film = pages?.nextElementSibling;
  if (!(film instanceof HTMLElement) || !pages?.closest('[data-book-pin]') || !film.clientWidth) return;

  const frame = lift > 0 ? lastFrame : Math.min(lastFrame, Math.round(seconds * 24));
  const filmWidth = film.clientWidth;
  const filmHeight = film.clientHeight;
  const borderX = film.clientLeft;
  const borderY = film.clientTop;
  const faces = [
    { card: portrait, slot: 1, angle: -Math.PI / 90, start: 35 },
    { card: bio, slot: 2, angle: 0, start: 29 },
  ] as const;
  const placements = faces.map(({ card, slot, angle, start }) => {
    const measured = trackAt(frame, slot);
    const width = card.offsetWidth;
    const height = card.offsetHeight;
    if (!measured || !width || !height) return { card, opacity: '0', matrix: '' };

    const x = card.offsetLeft;
    const y = card.offsetTop;
    const resting = restingCorners(width, height, angle);
    const corners = measured.map((point, index) => {
      const inPage = index % 2 === 0
        ? borderX + point / 1280 * filmWidth - x
        : borderY + point / 720 * filmHeight - y;
      return mix(inPage, resting[index], lift);
    });
    return {
      card,
      opacity: frame === start ? '0.92' : '1',
      matrix: project(width, height, corners),
    };
  });

  for (const { card, opacity, matrix } of placements) {
    card.style.setProperty('--book-face-opacity', opacity);
    if (matrix) card.style.setProperty('--book-face-transform', matrix);
  }
}
