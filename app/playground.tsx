'use client';

import { useState } from 'react';
import { ArrowUpRight, BarChart3, Bot, BriefcaseBusiness, Check, MessageCircle, Send, Users } from 'lucide-react';


const platformViews = [
  { label: 'Careers', Icon: BriefcaseBusiness, title: 'Careers overview', rows: ['Open roles', 'Applications', 'Interview pipeline'] },
  { label: 'EOR / HRO', Icon: BarChart3, title: 'Cost calculators', rows: ['Employment model', 'Estimated costs', 'Cost breakdown'] },
  { label: 'AI content', Icon: Bot, title: 'Content workspace', rows: ['Article topic', 'Generate draft', 'Review content'] },
];

export function PlatformPreview() {
  const [active, setActive] = useState(0);
  const current = platformViews[active];

  return (
    <div className="mock-window enterprise-window">
      <div className="mock-title"><i /><i /><i /><span>Platform concept</span></div>
      <div className="mock-layout">
        <div className="mock-nav" role="group" aria-label="Platform preview views">
          {platformViews.map(({ label, Icon }, index) => (
            <button key={label} type="button" aria-pressed={active === index} onClick={() => setActive(index)}>
              <Icon size={17} /><span>{label}</span>
            </button>
          ))}
        </div>
        <div className="mock-panel" aria-live="polite">
          <strong>{current.title}</strong>
          {current.rows.map((label, index) => (
            <div className="mock-row" key={label}><span>{label}</span><i style={{width: (34 - index * 6) + '%'}} /></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ChatPreview() {
  const [group, setGroup] = useState(false);
  return (
    <div className="mock-window chat-window">
      <div className="mock-title"><i /><i /><i /><span>Messaging concept</span></div>
      <div className="mock-layout">
        <div className="mock-nav" role="group" aria-label="Messaging preview views">
          <button type="button" aria-pressed={!group} onClick={() => setGroup(false)}><MessageCircle size={17} /><span>Direct</span></button>
          <button type="button" aria-pressed={group} onClick={() => setGroup(true)}><Users size={17} /><span>Group</span></button>
        </div>
        <div className="mock-panel" aria-live="polite">
          <strong>{group ? 'Project group' : 'Direct message'}</strong>
          <div key={group ? 'group-in' : 'direct-in'} className="bubble incoming">{group ? 'Ready for the demo?' : 'Hey! Are you online?'}</div>
          <div key={group ? 'group-out' : 'direct-out'} className="bubble outgoing">{group ? 'The files are in the chat.' : 'Yep, just sent the file!'} <Check size={12} /></div>
          <div className="typing"><i /><i /><i /><Send size={14} /></div>
        </div>
      </div>
    </div>
  );
}

export function RepoLink({href, label}: {href: string; label: string}) {
  return <a className="repo-link" href={href} target="_blank" rel="noreferrer" aria-label={label}>View repository <ArrowUpRight size={19} /></a>;
}
