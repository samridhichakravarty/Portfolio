'use client';

import { useMemo, useState } from 'react';
import { SITE, mailto, tidy } from '@/lib/site';

// Recruiter form: builds a plain, direct email draft. Nothing is sent from this page.
export function RoleBrief() {
  const [f, setF] = useState({ role: '', company: '', place: '', type: 'Full-time', stack: '', pay: '', link: '', next: 'A call', name: '', profile: '' });
  const [copied, setCopied] = useState(false);
  const set = (key: keyof typeof f) => (event: { target: { value: string } }) => setF(prev => ({ ...prev, [key]: event.target.value }));

  const { subject, lines } = useMemo(() => {
    const line = (label: string, value: string) => (value.trim() ? [`${label}: ${value.trim()}`] : []);
    return {
      subject: `Full-stack developer role: ${f.role.trim() || 'opening'} at ${f.company.trim() || 'our company'}`,
      lines: tidy([
        'Hi Samridhi,', '',
        "I'm hiring for a role you may fit.", '',
        ...line('Role', f.role), ...line('Company', f.company), ...line('Location / remote', f.place),
        ...line('Employment type', f.type), ...line('Stack', f.stack), ...line('Compensation range', f.pay),
        ...line('Job description', f.link), ...line('Preferred next step', f.next), '',
        ...line('Name', f.name), ...line('LinkedIn or company site', f.profile), '',
        'Source: Recruiter page',
      ]),
    };
  }, [f]);

  return (
    <div className="s-grid" style={{ alignItems: 'start' }}>
      <form className="s-card form" onSubmit={event => event.preventDefault()} aria-label="Share the role">
        <label>Role title<input value={f.role} onChange={set('role')} placeholder="Full-stack developer" autoComplete="off" /></label>
        <label>Company<input value={f.company} onChange={set('company')} autoComplete="organization" /></label>
        <label>Location or remote<input value={f.place} onChange={set('place')} placeholder="Jaipur, hybrid, remote..." /></label>
        <label>Employment type
          <select value={f.type} onChange={set('type')}><option>Full-time</option><option>Other (tell me in the email)</option></select>
        </label>
        <label>Main stack<input value={f.stack} onChange={set('stack')} placeholder="React, Node.js, PostgreSQL" /></label>
        <label>Compensation range <small>(optional)</small><input value={f.pay} onChange={set('pay')} /></label>
        <label>Link to the job description<input value={f.link} onChange={set('link')} type="url" placeholder="https://" /></label>
        <label>Preferred next step
          <select value={f.next} onChange={set('next')}><option>A call</option><option>Email me details</option><option>Send my résumé to you</option></select>
        </label>
        <label>Your name<input value={f.name} onChange={set('name')} autoComplete="name" /></label>
        <label>Your LinkedIn or company site <small>(optional)</small><input value={f.profile} onChange={set('profile')} /></label>
      </form>
      <aside className="s-card s-card--yellow s-stack" aria-label="Email draft">
        <p className="s-eyebrow">Your email draft</p>
        <pre className="draft" tabIndex={0}>{`To: ${SITE.email}\nSubject: ${subject}\n\n${lines.join('\n')}`}</pre>
        <div className="s-row">
          <a className="s-btn s-btn--ink" href={mailto(subject, lines)}>Open email draft</a>
          <button
            type="button"
            className="s-btn s-btn--paper"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(`To: ${SITE.email}\nSubject: ${subject}\n\n${lines.join('\n')}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              } catch {
                setCopied(false);
              }
            }}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <p className="s-muted" style={{ fontSize: '.9rem' }}>This opens your email app. Nothing is sent until you press send.</p>
      </aside>
    </div>
  );
}
