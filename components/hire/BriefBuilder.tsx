"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SITE } from "@/lib/site";
import { collect } from "@/lib/collectibles";
import { confetti, sfx } from "@/lib/fx";

const TYPES = ["Landing page", "Business website", "Web app", "Dashboard or admin panel", "AI chatbot or AI feature", "Not sure yet"];
const ADDONS = ["SEO setup", "Easy content editing", "Login and accounts", "Payments", "AI features", "Analytics", "Email automation"];
const TIMELINES = ["As soon as possible", "2 to 4 weeks", "1 to 2 months", "I'm flexible"];

const choice =
  "cursor-pointer select-none rounded-full border-2 border-border bg-surface px-4 py-2 font-display font-medium transition-all hover:border-pink-soft peer-checked:border-pink peer-checked:bg-pink/20 peer-checked:text-pink-soft peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-pink-soft";

// Visitors "build" their project; the result is a ready-to-send email. Nothing leaves the browser until they send it.
export function BriefBuilder() {
  const [type, setType] = useState("");
  const [addons, setAddons] = useState<string[]>([]);
  const [timeline, setTimeline] = useState("");
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [copied, setCopied] = useState(false);

  const progress = Math.min(100, (type ? 30 : 0) + Math.min(addons.length * 8, 32) + (timeline ? 18 : 0) + (details.trim() ? 20 : 0));

  const message = useMemo(() => {
    const lines = [
      "Hi Samridhi!",
      "",
      `I'd like to build: ${type || "something new (not sure of the type yet)"}`,
      `Extras I'm interested in: ${addons.length ? addons.join(", ") : "none picked yet"}`,
      `Timeline: ${timeline || "not decided"}`,
      "",
      "About my project:",
      details.trim() || "(I'll add details when we talk.)",
      "",
      name.trim() ? `Thanks, ${name.trim()}` : "Thanks!",
    ];
    return lines.join("\n");
  }, [type, addons, timeline, details, name]);

  const subject = `Project brief${type ? `: ${type}` : ""}${name.trim() ? ` from ${name.trim()}` : ""}`;
  const href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
      <form className="card grid gap-8 p-6 sm:p-8" onSubmit={(event) => event.preventDefault()}>
        <fieldset>
          <legend className="font-display text-xl font-semibold">1. What are we building?</legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {TYPES.map((item) => (
              <label key={item}>
                <input type="radio" name="type" value={item} checked={type === item} onChange={() => { setType(item); sfx.pop(); }} className="peer sr-only" />
                <span className={choice}>{item}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-display text-xl font-semibold">2. Any extras? <span className="text-sm font-normal text-muted-2">(pick as many as you like)</span></legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {ADDONS.map((item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  checked={addons.includes(item)}
                  onChange={() => { setAddons((list) => (list.includes(item) ? list.filter((value) => value !== item) : [...list, item])); sfx.pop(); }}
                  className="peer sr-only"
                />
                <span className={choice}>{item}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-display text-xl font-semibold">3. When would you like it?</legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {TIMELINES.map((item) => (
              <label key={item}>
                <input type="radio" name="timeline" value={item} checked={timeline === item} onChange={() => { setTimeline(item); sfx.pop(); }} className="peer sr-only" />
                <span className={choice}>{item}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-4">
          <label className="grid gap-2 font-display text-xl font-semibold" htmlFor="brief-details">
            4. Tell me a little more
            <textarea
              id="brief-details"
              rows={4}
              maxLength={1500}
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              placeholder="What is it, who is it for, and what should it do?"
              className="rounded-2xl border-2 border-border bg-bg/60 px-4 py-3 font-body text-base font-normal text-text placeholder:text-muted focus:border-pink"
            />
          </label>
          <label className="grid gap-2 font-display text-xl font-semibold" htmlFor="brief-name">
            Your name <span className="text-sm font-normal text-muted-2">(optional)</span>
            <input
              id="brief-name"
              autoComplete="name"
              maxLength={80}
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-2xl border-2 border-border bg-bg/60 px-4 py-3 font-body text-base font-normal text-text focus:border-pink"
            />
          </label>
        </div>
      </form>

      <aside className="lg:sticky lg:top-28 lg:self-start" aria-label="Your brief">
        <div className="sticker bg-surface p-6">
          <p className="label">Your build</p>
          <p className="mt-2 font-display text-3xl font-bold" aria-live="polite">{progress}% built</p>
          <div className="mt-3 h-4 overflow-hidden rounded-full bg-bg" role="progressbar" aria-label="Brief completeness" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <motion.div className="h-full rounded-full bg-gradient-to-r from-pink to-fuchsia" animate={{ width: `${progress}%` }} transition={{ type: "spring", stiffness: 120, damping: 16 }} />
          </div>
          <pre className="mt-5 max-h-64 overflow-auto whitespace-pre-wrap rounded-2xl bg-bg/70 p-4 font-mono text-xs leading-relaxed text-muted-2">{message}</pre>
          <div className="mt-5 grid gap-3">
            <a
              href={href}
              className="btn btn-primary"
              onClick={(event) => {
                collect("brief");
                sfx.win();
                const box = event.currentTarget.getBoundingClientRect();
                confetti(box.left + box.width / 2, box.top, 30);
              }}
            >
              Open email draft 💌
            </a>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(`To: ${SITE.email}\nSubject: ${subject}\n\n${message}`);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch {
                  setCopied(false);
                }
              }}
            >
              {copied ? "Copied! ✨" : "Copy brief"}
            </button>
          </div>
          <p className="mt-4 text-sm text-muted-2">This opens a draft in your email app addressed to {SITE.email}. Nothing is sent until you press send.</p>
        </div>
      </aside>
    </div>
  );
}
