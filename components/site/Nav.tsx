"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_LINKS } from "@/lib/site";
import { STICKERS, useAlbum } from "@/lib/collectibles";

function Logo() {
  return (
    <span className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
      <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff2d78" />
            <stop offset="1" stopColor="#d946ef" />
          </linearGradient>
        </defs>
        <path d="M16 3c1.2 6.6 3.4 8.8 10 10-6.6 1.2-8.8 3.4-10 10-1.2-6.6-3.4-8.8-10-10 6.6-1.2 8.8-3.4 10-10Z" fill="url(#logo-grad)" />
        <circle cx="25" cy="25" r="3" fill="#ff7eb3" />
      </svg>
      <span>samridhi<span className="text-pink">.</span></span>
    </span>
  );
}

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { stickers } = useAlbum();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:px-6">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-border bg-surface/75 px-4 py-2.5 shadow-[0_10px_40px_-20px_var(--color-glow)] backdrop-blur-xl"
      >
        <Link href="/" aria-label="Samridhi, home" className="rounded-full">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = link.href.startsWith("/#") ? false : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-4 py-2 font-display text-[0.98rem] font-medium transition-colors hover:bg-pink/10 hover:text-pink-soft ${
                    active ? "bg-pink/15 text-pink-soft" : "text-text"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="/play#album"
            className="hidden rounded-full border border-border px-3 py-1.5 font-mono text-xs text-pink-soft transition-colors hover:bg-pink/10 sm:inline-flex"
            aria-label={`Sticker album, ${stickers.length} of ${STICKERS.length} collected`}
          >
            ★ {stickers.length}/{STICKERS.length}
          </Link>
          <Link href="/hire" className="btn btn-primary hidden !px-5 !py-2.5 !text-[0.95rem] sm:inline-flex">
            Hire me
          </Link>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-border md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            <span aria-hidden="true" className="relative block h-3 w-5">
              <span className={`absolute left-0 top-0 h-0.5 w-5 rounded bg-text transition-transform ${open ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`absolute left-0 top-[10px] h-0.5 w-5 rounded bg-text transition-transform ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="card mx-auto mt-2 max-w-6xl p-4 md:hidden"
          >
            <ul className="grid gap-1">
              {[...NAV_LINKS, { href: "/hire", label: "Hire me ✨" }].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="block rounded-2xl px-4 py-3 font-display text-lg font-semibold hover:bg-pink/10">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
