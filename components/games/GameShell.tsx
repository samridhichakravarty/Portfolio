import type { ReactNode } from 'react';

// Shared frame for every game: title, how to play, live stats, and a "behind the game" note.
export function GameShell({ id, emoji, title, blurb, controls, stats, behind, children }: {
  id: string;
  emoji: string;
  title: string;
  blurb: string;
  controls: string;
  stats: { label: string; value: string | number }[];
  behind: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="game s-stack">
      <header className="game-head">
        <div style={{ maxWidth: '40rem' }}>
          <h2 id={`${id}-title`} className="s-h2"><span aria-hidden="true">{emoji}</span> {title}</h2>
          <p style={{ marginTop: '.5rem', fontWeight: 600 }}>{blurb}</p>
          <p className="s-eyebrow" style={{ marginTop: '.6rem' }}>{controls}</p>
        </div>
        <dl className="game-stats">
          {stats.map(stat => <div key={stat.label}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>)}
        </dl>
      </header>
      {children}
      <div className="s-faq">
        <details>
          <summary>Behind the game</summary>
          <p>{behind}</p>
        </details>
      </div>
    </section>
  );
}
