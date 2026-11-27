import Link from "next/link";
import { PROJECTS } from "@/lib/data";
import { Reveal } from "@/components/site/Reveal";

export function WorkCartridges() {
  return (
    <section id="work" aria-labelledby="work-title" className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <p className="label">Selected work</p>
        <h2 id="work-title" className="mt-3 text-[clamp(2.2rem,5vw,3.8rem)] font-bold">
          Things I&apos;ve built <span className="gradient-text">(and shipped)</span>
        </h2>
        <p className="mt-4 max-w-2xl text-muted-2">Pick a cartridge to see how each project works, what it is made of and where the code lives.</p>
      </Reveal>
      <ul className="mt-10 grid gap-6 md:grid-cols-2">
        {PROJECTS.map((project, index) => (
          <li key={project.slug}>
            <Reveal delay={index * 0.1} className="h-full">
              <Link
                href={`/work/${project.slug}`}
                className="group card relative block h-full overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:rotate-[-0.6deg] hover:shadow-[0_30px_60px_-24px_var(--color-glow)]"
              >
                <div className={`relative flex h-44 items-end justify-between bg-gradient-to-br ${project.hue} p-6`}>
                  <span aria-hidden="true" className="font-display text-8xl font-bold leading-none text-white/90">{project.number}</span>
                  <span aria-hidden="true" className="mb-2 grid gap-1.5">
                    <i className="block h-1.5 w-16 rounded bg-white/70" />
                    <i className="block h-1.5 w-10 rounded bg-white/50" />
                    <i className="block h-1.5 w-12 rounded bg-white/30" />
                  </span>
                  <span aria-hidden="true" className="absolute left-1/2 top-0 h-3 w-16 -translate-x-1/2 rounded-b-xl bg-bg/70" />
                </div>
                <div className="p-6">
                  <p className="label">{project.category}</p>
                  <h3 className="mt-2 text-2xl font-semibold">{project.title}</h3>
                  <p className="mt-2 text-muted-2">{project.summary}</p>
                  <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">
                    {project.stack.slice(0, 5).map((tech) => (
                      <li key={tech} className="chip">{tech}</li>
                    ))}
                  </ul>
                  <span className="mt-5 inline-flex items-center gap-2 font-display font-semibold text-pink-soft">
                    Insert cartridge <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
