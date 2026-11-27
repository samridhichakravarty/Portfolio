'use client';

import Link from '@/components/site/Link';
import { useEffect, useState } from 'react';
import { STICKERS, clearFresh, collect, useAlbum } from '@/lib/collectibles';
import { confetti, sfx } from '@/lib/fx';

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

// Site-wide extras with no layout of their own: sticker toast, friend-challenge banner, easter egg, night owl.
export default function SiteExtras() {
  const { fresh, stickers } = useAlbum();
  const sticker = STICKERS.find(item => item.id === fresh);
  const [challenge, setChallenge] = useState<number | null>(null);

  useEffect(() => {
    const match = /^ship-(\d{1,3})$/.exec(new URLSearchParams(window.location.search).get('challenge') ?? '');
    if (match) setChallenge(Number(match[1]));

    const hour = new Date().getHours();
    if (hour >= 22 || hour < 5) collect('night');

    let progress = 0;
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      progress = key === KONAMI[progress] ? progress + 1 : key === KONAMI[0] ? 1 : 0;
      if (progress === KONAMI.length) {
        progress = 0;
        collect('wink');
        confetti(window.innerWidth / 2, window.innerHeight / 2, 60);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!fresh) return;
    confetti(window.innerWidth / 2, window.innerHeight - 90, 24);
    sfx.win();
    const timer = setTimeout(clearFresh, 3600);
    return () => clearTimeout(timer);
  }, [fresh]);

  return (
    <>
      {challenge !== null && (
        <div className="banner" role="note">
          <span>A friend scored {challenge} in Ship It! Think you can beat them?</span>
          <Link className="s-btn s-btn--paper" href="/play#runner">Play now</Link>
        </div>
      )}
      <div className="toast" role="status" aria-live="polite">
        {sticker && (
          <div key={sticker.id}>
            {'art' in sticker ? <img src={sticker.art} alt="" width={40} height={40} /> : <span className="badge" aria-hidden="true">{sticker.glyph}</span>}
            <span>
              <b style={{ display: 'block', fontSize: '.7rem', letterSpacing: '.12em', textTransform: 'uppercase' }}>New sticker {stickers.length}/{STICKERS.length}</b>
              <b style={{ fontSize: '1.05rem' }}>{sticker.label}</b>
            </span>
          </div>
        )}
      </div>
    </>
  );
}
