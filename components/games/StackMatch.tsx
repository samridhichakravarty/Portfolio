'use client';

import { useRef, useState } from 'react';
import { GameShell } from './GameShell';
import { collect, reportScore, useAlbum } from '@/lib/collectibles';
import { confetti, sfx } from '@/lib/fx';

// Each pair is a need a client has and the tool that solves it, with a plain-English line.
const PAIRS = [
  { need: 'Real-time chat', tool: 'Socket.IO', note: 'Keeps a live connection open so messages and typing indicators arrive instantly. I used it in my Real-Time Chat Application.' },
  { need: 'AI assistant', tool: 'Groq API', note: 'A hosted AI model: your app sends a prompt and gets text back. I used Groq for AI-assisted blog drafting.' },
  { need: 'Secure login', tool: 'JWT', note: 'A signed token that proves who a user is without keeping a session on the server. Used in both of my projects.' },
  { need: 'Flexible data', tool: 'MongoDB', note: 'A document database that suits data that changes shape, like chat history.' },
  { need: 'Structured data', tool: 'MySQL', note: 'A relational database for tables, rules and reports. I used it during my ScaleneWorks internship.' },
  { need: 'Fast, findable site', tool: 'Next.js', note: 'A React framework that prepares pages ahead of time for speed and search. Used in my Enterprise Web Platform.' },
];

type Card = { pair: number; kind: 'need' | 'tool'; label: string };

function makeDeck(): Card[] {
  const deck: Card[] = PAIRS.flatMap((pair, index) => [
    { pair: index, kind: 'need' as const, label: pair.need },
    { pair: index, kind: 'tool' as const, label: pair.tool },
  ]);
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    const swap = deck[index] as Card;
    deck[index] = deck[other] as Card;
    deck[other] = swap;
  }
  return deck;
}

// Memory match: pair what a client needs with the tool that does it. Every match teaches one thing.
export default function StackMatch() {
  const { best } = useAlbum();
  const [deck, setDeck] = useState(makeDeck);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [learned, setLearned] = useState<number | null>(null);
  const locked = useRef(false);
  const holder = useRef<HTMLDivElement>(null);
  const won = matched.length === PAIRS.length;

  function flip(index: number) {
    const card = deck[index];
    if (locked.current || !card || open.includes(index) || matched.includes(card.pair) || won) return;
    const nextOpen = [...open, index];
    setOpen(nextOpen);
    sfx.pop();
    if (nextOpen.length < 2) return;

    const total = moves + 1;
    setMoves(total);
    const first = deck[nextOpen[0] as number] as Card;
    if (first.pair === card.pair) {
      const nextMatched = [...matched, card.pair];
      setMatched(nextMatched);
      setLearned(card.pair);
      setOpen([]);
      sfx.coin();
      if (nextMatched.length === PAIRS.length) {
        sfx.win();
        collect('match');
        reportScore('match', Math.max(1, 40 - total));
        const box = holder.current?.getBoundingClientRect();
        if (box) confetti(box.left + box.width / 2, box.top + 60, 40);
      }
    } else {
      locked.current = true;
      window.setTimeout(() => {
        setOpen([]);
        locked.current = false;
      }, 800);
    }
  }

  function reset() {
    setDeck(makeDeck());
    setOpen([]);
    setMatched([]);
    setMoves(0);
    setLearned(null);
    locked.current = false;
  }

  const bestMoves = best.match ? 40 - best.match : '-';
  const note = learned === null ? null : PAIRS[learned];

  return (
    <GameShell
      id="match"
      emoji="🧠"
      title="Stack Match"
      blurb="Pair what a client needs with the tool that does the job. Every match explains one tool in plain English. Win to earn a sticker."
      controls="Click, tap, or Tab to a card and press Enter"
      stats={[{ label: 'Moves', value: moves }, { label: 'Pairs', value: `${matched.length}/${PAIRS.length}` }, { label: 'Best', value: bestMoves }]}
      behind="A small React state machine with CSS 3D flips. Cards are real buttons with labels, so it works with a keyboard and a screen reader. The pairs are tools I have actually used."
    >
      <div ref={holder} className="s-stack">
        <ul className="cards">
          {deck.map((card, index) => {
            const shown = open.includes(index) || matched.includes(card.pair);
            return (
              <li key={`${card.kind}-${card.pair}`}>
                <button type="button" className="mcard" onClick={() => flip(index)} aria-label={shown ? `${card.kind === 'need' ? 'Need' : 'Tool'}: ${card.label}` : `Hidden card ${index + 1}`}>
                  <span style={{ transform: shown ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                    <i>?</i>
                    <b data-tool={card.kind === 'tool' ? '' : undefined} data-done={matched.includes(card.pair) ? '' : undefined}>{card.label}</b>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="s-row">
          <button type="button" className="s-btn" onClick={reset}>{won ? 'Play again' : 'Shuffle'}</button>
          <p style={{ fontWeight: 800 }} aria-live="polite">{won ? `You won in ${moves} moves!` : ''}</p>
        </div>
        <div className="s-card s-card--lav" aria-live="polite" style={{ minHeight: '5rem' }}>
          {note ? <><p className="s-eyebrow">{note.need} + {note.tool}</p><p style={{ marginTop: '.4rem' }}>{note.note}</p></> : <p className="s-muted">Match a pair to learn what the tool does.</p>}
        </div>
      </div>
    </GameShell>
  );
}
