'use client';

import Link from '@/components/site/Link';
import { STICKERS, useAlbum } from '@/lib/collectibles';

// The sticker album. Hints are always visible so nobody has to guess.
export function AlbumGrid() {
  const { stickers } = useAlbum();
  const complete = stickers.length === STICKERS.length;
  return (
    <div>
      <p className="s-h3" aria-live="polite">{stickers.length} of {STICKERS.length} stickers found</p>
      <ul className="album">
        {STICKERS.map(sticker => {
          const found = stickers.includes(sticker.id);
          return (
            <li key={sticker.id} data-found={found ? '' : undefined}>
              {'art' in sticker ? <img src={sticker.art} alt="" width={68} height={68} /> : <span className="badge" aria-hidden="true">{sticker.glyph}</span>}
              <b>{found ? sticker.label : 'Mystery sticker'}</b>
              <span style={{ fontSize: '.85rem', fontWeight: 600 }}>{found ? 'Collected!' : sticker.hint}</span>
            </li>
          );
        })}
      </ul>
      {complete && (
        <div className="s-card s-card--pink s-stack" style={{ marginTop: '1.4rem' }}>
          <p className="s-h3">You found them all!</p>
          <p>Screenshot this page and send it with your brief. I would love to hear who found every sticker.</p>
          <div className="s-row"><Link className="s-btn" href="/freelance/start">Start a project</Link></div>
        </div>
      )}
    </div>
  );
}
