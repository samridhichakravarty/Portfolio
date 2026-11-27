import Link from "next/link";
import { Reveal } from "@/components/site/Reveal";

const GAMES = [
  { id: "runner", emoji: "🚀", title: "Ship It!", text: "Jump the bugs, grab the stars." },
  { id: "bugpop", emoji: "🐞", title: "Bug Pop", text: "Pop as many bugs as you can." },
  { id: "match", emoji: "🧠", title: "Stack Match", text: "Pair up my tech stack." },
];

export function PlayTeaser() {
  return (
    <section aria-labelledby="play-title" className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <p className="label">Playground</p>
        <h2 id="play-title" className="mt-3 text-[clamp(2.2rem,5vw,3.8rem)] font-bold">
          Take a <span className="gradient-text">play break</span>
        </h2>
        <p className="mt-4 max-w-2xl text-muted-2">Three tiny games and 12 hidden stickers. Totally optional, always fun.</p>
      </Reveal>
      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {GAMES.map((game, index) => (
          <li key={game.id}>
            <Reveal delay={index * 0.08} className="h-full">
              <Link href={`/play#${game.id}`} className="card group block h-full p-6 transition-all hover:-translate-y-2 hover:rotate-1 hover:shadow-[0_30px_60px_-24px_var(--color-glow)]">
                <span aria-hidden="true" className="float inline-block text-5xl" style={{ ["--r" as string]: "-6deg" }}>{game.emoji}</span>
                <h3 className="mt-3 text-2xl font-semibold">{game.title}</h3>
                <p className="mt-1 text-muted-2">{game.text}</p>
                <span className="mt-4 inline-flex items-center gap-2 font-display font-semibold text-pink-soft">
                  Play <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
