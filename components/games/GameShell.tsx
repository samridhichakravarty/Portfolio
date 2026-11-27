import type { ReactNode } from "react";

// Shared frame for every game: title, how to play, live stats.
export function GameShell({
  id,
  emoji,
  title,
  blurb,
  controls,
  stats,
  children,
}: {
  id: string;
  emoji: string;
  title: string;
  blurb: string;
  controls: string;
  stats: { label: string; value: string | number }[];
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="card scroll-mt-28 p-5 sm:p-7">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-xl">
          <h2 id={`${id}-title`} className="text-3xl font-bold">
            <span aria-hidden="true">{emoji}</span> {title}
          </h2>
          <p className="mt-1 text-muted-2">{blurb}</p>
          <p className="mt-2 font-mono text-xs text-pink-soft">{controls}</p>
        </div>
        <dl className="flex gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="min-w-[4.5rem] rounded-2xl border border-border bg-bg/60 px-4 py-2 text-center">
              <dt className="label !text-[0.65rem]">{stat.label}</dt>
              <dd className="font-display text-2xl font-bold">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </header>
      <div className="mt-5">{children}</div>
    </section>
  );
}
