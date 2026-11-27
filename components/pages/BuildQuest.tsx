'use client';

import { useMemo, useState } from 'react';
import { SITE, mailto, tidy } from '@/lib/site';
import { collect, useAlbum } from '@/lib/collectibles';
import { confetti, sfx } from '@/lib/fx';

const TYPES = [
  { id: 'Web app', note: 'A product or portal people log in to', base: 5, asks: ['Who will use it, and what is the one job it must do well?', 'Do you already have designs or a reference product?', 'What should happen in the first version, and what can wait?'] },
  { id: 'AI feature or chatbot', note: 'Assistant, content tool or smart workflow', base: 4, asks: ['What should the AI do, and who checks its output?', 'What data will it use, and where does that data live?', 'How will you know it is working well enough?'] },
  { id: 'API or backend', note: 'Server, database, auth, real-time', base: 4, asks: ['Who or what will call this API?', 'Is there an existing database or system to connect to?', 'What are the expected users and traffic?'] },
  { id: 'Dashboard or internal tool', note: 'Admin panel, CRM, reporting', base: 4, asks: ['Who are the users, and what do they do today?', 'Where does the data come from?', 'Which reports or actions matter most?'] },
  { id: 'Website or landing page', note: 'Public site built for speed and search', base: 2, asks: ['What should visitors do on the page?', 'Do you have content, brand and images ready?', 'Which keywords or audiences matter?'] },
  { id: 'Automation', note: 'Connect tools and remove manual work', base: 3, asks: ['Which manual steps do you want to remove?', 'Which tools or systems are involved?', 'What happens when a step fails?'] },
  { id: 'Not sure yet', note: "We'll work it out together", base: 3, asks: ['What problem are you trying to solve?', 'Who is it for?', 'What does success look like in three months?'] },
] as const;

const FEATURES = [
  { id: 'Login and accounts', w: 2 }, { id: 'Payments', w: 3 }, { id: 'Real-time features', w: 3 }, { id: 'AI features', w: 3 },
  { id: 'Admin dashboard', w: 2 }, { id: 'Easy content editing', w: 2 }, { id: 'Third-party integrations', w: 2 },
  { id: 'Email and notifications', w: 1 }, { id: 'File uploads', w: 1 }, { id: 'SEO setup', w: 1 }, { id: 'Analytics', w: 1 },
] as const;

const TIMELINES = ['As soon as possible', 'Within a month', '1 to 3 months', "I'm flexible"];
const BUDGETS = ['Not decided', 'Under ₹50,000', '₹50,000 to ₹2,00,000', '₹2,00,000 and above'];
const LEVELS = ['Pick the build', 'Add features', 'Set the pace', 'Your brief'];

export function BuildQuest() {
  const { best } = useAlbum();
  const [level, setLevel] = useState(1);
  const [type, setType] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [timeline, setTimeline] = useState('');
  const [budget, setBudget] = useState('Not decided');
  const [details, setDetails] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [score, setScore] = useState(false);
  const [copied, setCopied] = useState(false);

  const chosen = TYPES.find(item => item.id === type);
  const points = (chosen?.base ?? 0) + FEATURES.filter(item => features.includes(item.id)).reduce((sum, item) => sum + item.w, 0);
  const size = points <= 5 ? 'Small' : points <= 11 ? 'Medium' : 'Large';
  const percent = Math.min(100, points * 6);
  const runner = best.runner ?? 0;

  const { subject, lines } = useMemo(() => {
    const line = (label: string, value: string) => (value.trim() ? [`${label}: ${value.trim()}`] : []);
    return {
      subject: `Project inquiry: ${type || 'new project'}, ${size}${timeline ? ', ' + timeline : ''}`,
      lines: tidy([
        'Hi Samridhi,', '',
        "I'd like to discuss a project.", '',
        ...line('Project type', type),
        ...line('Features', features.join(', ')),
        `Size: ${size} (estimate from the Build Quest)`,
        ...line('Timeline', timeline),
        ...(budget !== 'Not decided' ? line('Budget', budget) : []),
        ...line('About the project', details), '',
        ...line('Name', name), ...line('Company', company),
        ...(score && runner > 0 ? [`Ship It! best: ${runner}`] : []), '',
        'Source: Build Quest',
      ]),
    };
  }, [type, features, size, timeline, budget, details, name, company, score, runner]);

  const draft = `To: ${SITE.email}\nSubject: ${subject}\n\n${lines.join('\n')}`;
  const finish = (target: HTMLElement) => {
    collect('sparkle');
    sfx.win();
    const box = target.getBoundingClientRect();
    confetti(box.left + box.width / 2, box.top, 36);
  };
  const next = () => { sfx.pop(); setLevel(value => Math.min(4, value + 1)); };

  return (
    <div>
      <ol className="quest-bar" aria-label="Quest progress">
        {LEVELS.map((label, index) => (
          <li key={label} data-state={level === index + 1 ? 'now' : level > index + 1 ? 'done' : 'todo'} aria-current={level === index + 1 ? 'step' : undefined}>
            Level {index + 1}: {label}
          </li>
        ))}
      </ol>

      <div className="quest-layout">
        <div className="s-card s-stack">
          {level === 1 && (
            <fieldset className="s-stack" style={{ border: 0, padding: 0, margin: 0 }}>
              <legend className="s-h2" style={{ marginBottom: '.8rem' }}>What are we building?</legend>
              <div className="opt-grid">
                {TYPES.map(item => (
                  <label key={item.id} className="opt">
                    <input type="radio" name="type" checked={type === item.id} onChange={() => { setType(item.id); sfx.pop(); }} />
                    <span><b>{item.id}</b>{item.note}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {level === 2 && (
            <fieldset className="s-stack" style={{ border: 0, padding: 0, margin: 0 }}>
              <legend className="s-h2" style={{ marginBottom: '.8rem' }}>Add features</legend>
              <p className="s-muted">Tap everything you expect. You can change it later.</p>
              <div className="opt-grid">
                {FEATURES.map(item => (
                  <label key={item.id} className="opt">
                    <input type="checkbox" checked={features.includes(item.id)} onChange={() => { setFeatures(list => (list.includes(item.id) ? list.filter(value => value !== item.id) : [...list, item.id])); sfx.pop(); }} />
                    <span><b>{item.id}</b></span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {level === 3 && (
            <div className="s-stack">
              <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
                <legend className="s-h2" style={{ marginBottom: '.8rem' }}>When do you need it?</legend>
                <div className="opt-grid">
                  {TIMELINES.map(item => (
                    <label key={item} className="opt">
                      <input type="radio" name="timeline" checked={timeline === item} onChange={() => { setTimeline(item); sfx.pop(); }} />
                      <span><b>{item}</b></span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="form">
                <label>Budget range <small>(optional)</small>
                  <select value={budget} onChange={event => setBudget(event.target.value)}>{BUDGETS.map(item => <option key={item}>{item}</option>)}</select>
                </label>
                <label>Tell me a little more <small>(optional)</small>
                  <textarea rows={4} maxLength={1500} value={details} onChange={event => setDetails(event.target.value)} placeholder="What is it, who is it for, and what must it do?" />
                </label>
              </div>
            </div>
          )}

          {level === 4 && (
            <div className="s-stack">
              <h2 className="s-h2">Your brief is ready</h2>
              <div className="form">
                <label>Your name<input value={name} onChange={event => setName(event.target.value)} autoComplete="name" /></label>
                <label>Company <small>(optional)</small><input value={company} onChange={event => setCompany(event.target.value)} autoComplete="organization" /></label>
                {runner > 0 && (
                  <label style={{ display: 'flex', gap: '.6rem', alignItems: 'center' }}>
                    <input type="checkbox" checked={score} onChange={event => setScore(event.target.checked)} /> Include my Ship It! score (just for fun)
                  </label>
                )}
              </div>
              <pre className="draft" tabIndex={0}>{draft}</pre>
              <div className="s-row">
                <a className="s-btn s-btn--ink" href={mailto(subject, lines)} onClick={event => finish(event.currentTarget)}>Open email draft</a>
                <button
                  type="button"
                  className="s-btn s-btn--paper"
                  onClick={async event => {
                    const button = event.currentTarget;
                    try {
                      await navigator.clipboard.writeText(draft);
                      finish(button);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    } catch {
                      setCopied(false);
                    }
                  }}
                >
                  {copied ? 'Copied' : 'Copy brief'}
                </button>
              </div>
              <p className="s-muted" style={{ fontSize: '.9rem' }}>This opens your email app. Nothing is sent until you press send.</p>
            </div>
          )}

          <div className="s-row" style={{ justifyContent: 'space-between', marginTop: '.6rem' }}>
            <button type="button" className="s-btn s-btn--paper" onClick={() => setLevel(value => Math.max(1, value - 1))} disabled={level === 1}>← Back</button>
            {level < 4 && <button type="button" className="s-btn" onClick={next} disabled={(level === 1 && !type) || (level === 3 && !timeline)}>Next level →</button>}
          </div>
        </div>

        <aside className="s-card s-card--pink s-stack quest-side" aria-label="Your build">
          <p className="s-eyebrow">Your build</p>
          <p className="s-h2" aria-live="polite">{type ? `${size} project` : 'Pick a build'}</p>
          <div className="meter" role="progressbar" aria-label="Build size" aria-valuenow={type ? percent : 0} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${type ? percent : 0}%` }} /></div>
          <p className="s-muted" style={{ fontSize: '.92rem' }}>Size is a rough guide to how much there is to build. It is not a price. I confirm scope and estimate in my reply.</p>
          {type && <p><b>{type}</b>{features.length > 0 && <>, with {features.join(', ').toLowerCase()}</>}.</p>}
          {chosen && (
            <div>
              <p className="s-eyebrow">Questions I will ask next</p>
              <ul className="s-checks" style={{ marginTop: '.6rem' }}>{chosen.asks.map(question => <li key={question}>{question}</li>)}</ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
