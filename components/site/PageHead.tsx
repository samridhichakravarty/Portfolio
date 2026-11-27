import type { ReactNode } from 'react';

// Pink dotted header used by every sub-page: kicker, big title, one-line lede, actions, optional film.
export function PageHead({ kicker, title, lede, actions, aside }: {
  kicker: string;
  title: ReactNode;
  lede?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <header className="s-head">
      <div className={'s-head-inner' + (aside ? ' has-aside' : '')}>
        <div className="s-stack">
          <p className="s-kicker">{kicker}</p>
          <h1 className="s-h1">{title}</h1>
          {lede && <p className="s-lede">{lede}</p>}
          {actions && <div className="s-row">{actions}</div>}
        </div>
        {aside}
      </div>
    </header>
  );
}
