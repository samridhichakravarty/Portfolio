import Link from "next/link";
import { SITE, SERVICES } from "@/lib/site";
import { PROJECTS } from "@/lib/data";
import { FooterExtras } from "./FooterExtras";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-bold">samridhi<span className="text-pink">.</span></p>
          <p className="mt-3 max-w-xs text-muted-2">
            Freelance full-stack developer in {SITE.city}, India. Building fast, friendly websites and AI features.
          </p>
          <a href={`mailto:${SITE.email}`} className="mt-4 inline-block font-semibold text-pink-soft hover:underline">
            {SITE.email}
          </a>
        </div>
        <nav aria-label="Services">
          <p className="label mb-3">Services</p>
          <ul className="grid gap-2">
            {SERVICES.map((service) => (
              <li key={service.slug}>
                <Link className="text-muted-2 hover:text-pink-soft" href={`/services/${service.slug}`}>
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Work">
          <p className="label mb-3">Work</p>
          <ul className="grid gap-2">
            {PROJECTS.map((project) => (
              <li key={project.slug}>
                <Link className="text-muted-2 hover:text-pink-soft" href={`/work/${project.slug}`}>
                  {project.title}
                </Link>
              </li>
            ))}
            <li><Link className="text-muted-2 hover:text-pink-soft" href="/play">Play the games</Link></li>
          </ul>
        </nav>
        <nav aria-label="Elsewhere">
          <p className="label mb-3">Elsewhere</p>
          <ul className="grid gap-2">
            <li><a className="text-muted-2 hover:text-pink-soft" href={SITE.github} target="_blank" rel="noreferrer">GitHub</a></li>
            <li><a className="text-muted-2 hover:text-pink-soft" href={SITE.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
            <li><a className="text-muted-2 hover:text-pink-soft" href={SITE.resume} download>Résumé (PDF)</a></li>
            <li><Link className="text-muted-2 hover:text-pink-soft" href="/about">About me</Link></li>
          </ul>
        </nav>
      </div>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-border px-6 py-6">
        <p className="font-mono text-xs text-muted-2">© {new Date().getFullYear()} {SITE.name} · {SITE.city}, India</p>
        <FooterExtras />
      </div>
    </footer>
  );
}
