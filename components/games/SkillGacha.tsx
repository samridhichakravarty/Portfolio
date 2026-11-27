'use client';

import Link from '@/components/site/Link';
import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { SKILL_GROUPS, SKILL_PROOF } from '@/lib/data';
import { collect } from '@/lib/collectibles';
import { confetti, sfx } from '@/lib/fx';

const ALL = SKILL_GROUPS.flatMap(group => group.items.map(name => ({ name, group: group.name })));
const CHEERS = ['Nice pull!', 'Ooh, sparkly!', 'Lucky you!', 'Capsule cracked!', 'Fresh from the machine!'];
const DOTS = ['#ff69b4', '#ffe66d', '#4561ff', '#c7a4ff', '#ff2d8d', '#ffe66d', '#c7a4ff', '#ff69b4', '#4561ff'];

type Pull = { name: string; group: string; cheer: string; id: number };

// Every capsule is a skill plus proof of where I used it. The same list is plain text on the recruiter page.
export default function SkillGacha() {
  const reduce = useReducedMotion();
  const [pulled, setPulled] = useState<string[]>([]);
  const [current, setCurrent] = useState<Pull | null>(null);
  const [rolling, setRolling] = useState(false);
  const counter = useRef(0);
  const button = useRef<HTMLButtonElement>(null);

  function pull() {
    if (rolling) return;
    const pool = ALL.filter(skill => !pulled.includes(skill.name));
    const list = pool.length ? pool : ALL;
    const pick = list[Math.floor(Math.random() * list.length)] ?? ALL[0];
    if (!pick) return;
    setRolling(true);
    setCurrent(null);
    sfx.pop();
    window.setTimeout(() => {
      counter.current += 1;
      setCurrent({ ...pick, cheer: CHEERS[counter.current % CHEERS.length] ?? 'Nice pull!', id: counter.current });
      setPulled(items => (items.includes(pick.name) ? items : [...items, pick.name]));
      setRolling(false);
      collect('smile');
      sfx.coin();
      const box = button.current?.getBoundingClientRect();
      if (box) confetti(box.left + box.width / 2, box.top, 18);
    }, reduce ? 0 : 900);
  }

  const proof = current ? SKILL_PROOF[current.name] : undefined;

  return (
    <section className="game s-stack" aria-labelledby="capsule-title">
      <h2 id="capsule-title" className="s-h2"><span aria-hidden="true">🍬</span> Skill capsule machine</h2>
      <p style={{ fontWeight: 600 }}>Pull a capsule to meet one of my skills, with proof of where I used it.</p>
      <div className="machine">
        <div className="s-card s-card--lav s-stack" style={{ textAlign: 'center' }}>
          <div className="dome" aria-hidden="true">
            {DOTS.map((color, index) => (
              <motion.i
                key={index}
                style={{ background: color }}
                animate={rolling && !reduce ? { y: [0, -8, 4, 0], rotate: [0, 12, -12, 0] } : {}}
                transition={{ duration: 0.5, repeat: rolling ? 1 : 0, delay: index * 0.03 }}
              />
            ))}
          </div>
          <button ref={button} type="button" className="s-btn" onClick={pull} disabled={rolling}>{rolling ? 'Rolling...' : 'Pull a capsule'}</button>
          <p className="s-eyebrow">{pulled.length} of {ALL.length} skills met</p>
        </div>
        <div style={{ minHeight: '11rem' }} aria-live="polite">
          <AnimatePresence mode="wait">
            {current ? (
              <motion.div
                key={current.id}
                className="prize"
                initial={reduce ? false : { opacity: 0, y: -50, rotate: -8, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 260, damping: 16 }}
              >
                <p className="s-eyebrow">{current.cheer}</p>
                <p className="s-h1" style={{ fontSize: 'clamp(2rem,6vw,3.6rem)', margin: '.4rem 0' }}>{current.name}</p>
                <p style={{ fontWeight: 650 }}>{current.group}. {proof?.text}</p>
                {proof?.href && <p style={{ marginTop: '.6rem' }}><Link className="s-link" href={proof.href}>Read the case study →</Link></p>}
              </motion.div>
            ) : (
              <p key="hint" className="s-h3">{rolling ? 'Here it comes...' : 'Pull the lever to meet a skill!'}</p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
