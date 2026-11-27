"use client";

import { useRef, useState } from "react";
import { GameShell } from "./GameShell";
import { collect, reportScore, useAlbum } from "@/lib/collectibles";
import { confetti, sfx } from "@/lib/fx";

const LABELS = ["Next.js", "React", "Node.js", "MongoDB", "MySQL", "Python"];

function makeDeck() {
  const deck = LABELS.flatMap((label) => [label, label]);
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [deck[index], deck[other]] = [deck[other] as string, deck[index] as string];
  }
  return deck;
}

// Memory match with the tech stack. Fewer moves is better.
export function StackMatch() {
  const { best } = useAlbum();
  const [deck, setDeck] = useState(makeDeck);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const locked = useRef(false);
  const holder = useRef<HTMLDivElement>(null);
  const won = matched.length === LABELS.length;

  function flip(index: number) {
    const label = deck[index];
    if (locked.current || !label || open.includes(index) || matched.includes(label) || won) return;
    const nextOpen = [...open, index];
    setOpen(nextOpen);
    sfx.pop();
    if (nextOpen.length < 2) return;

    const total = moves + 1;
    setMoves(total);
    const [first, second] = nextOpen;
    if (deck[first as number] === deck[second as number]) {
      const nextMatched = [...matched, label];
      setMatched(nextMatched);
      setOpen([]);
      sfx.coin();
      if (nextMatched.length === LABELS.length) {
        sfx.win();
        collect("match");
        reportScore("match", Math.max(1, 40 - total));
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
    locked.current = false;
  }

  const bestMoves = best.match ? 40 - best.match : "-";

  return (
    <GameShell
      id="match"
      emoji="🧠"
      title="Stack Match"
      blurb="Flip the cards and find all six matching pairs of my tech stack. Win to earn a sticker."
      controls="Click, tap, or Tab to a card and press Enter"
      stats={[{ label: "Moves", value: moves }, { label: "Pairs", value: `${matched.length}/${LABELS.length}` }, { label: "Best", value: bestMoves }]}
    >
      <div ref={holder}>
        <ul className="mx-auto grid max-w-xl grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4">
          {deck.map((label, index) => {
            const shown = open.includes(index) || matched.includes(label);
            return (
              <li key={`${label}-${index}`} className="[perspective:700px]">
                <button
                  type="button"
                  onClick={() => flip(index)}
                  aria-label={shown ? label : `Hidden card ${index + 1}`}
                  className="relative aspect-[3/4] w-full"
                >
                  <span
                    className="absolute inset-0 transition-transform duration-500 [transform-style:preserve-3d]"
                    style={{ transform: shown ? "rotateY(180deg)" : "rotateY(0deg)" }}
                  >
                    <span className="absolute inset-0 grid place-items-center rounded-2xl border-2 border-pink/50 bg-gradient-to-br from-pink to-fuchsia font-display text-3xl font-bold text-white [backface-visibility:hidden]">
                      ?
                    </span>
                    <span
                      className={`absolute inset-0 grid place-items-center rounded-2xl border-2 bg-surface px-1 text-center font-display text-base font-semibold [backface-visibility:hidden] sm:text-lg ${
                        matched.includes(label) ? "border-pink text-pink-soft" : "border-border"
                      }`}
                      style={{ transform: "rotateY(180deg)" }}
                    >
                      {label}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" className="btn btn-primary" onClick={reset}>{won ? "Play again" : "Shuffle"}</button>
          <p className="font-display text-lg" aria-live="polite">{won ? `You won in ${moves} moves! 🎉` : ""}</p>
        </div>
      </div>
    </GameShell>
  );
}
