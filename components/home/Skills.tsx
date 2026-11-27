import { SKILL_GROUPS } from "@/lib/data";
import { Reveal } from "@/components/site/Reveal";

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <p className="label">Skills</p>
        <h2 id="skills-title" className="mt-3 text-[clamp(2.2rem,5vw,3.8rem)] font-bold">
          What I <span className="gradient-text">work with</span>
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SKILL_GROUPS.map((group, index) => (
          <Reveal key={group.name} delay={index * 0.08} className="h-full">
            <section className="card h-full p-6" aria-labelledby={`skills-${index}`}>
              <h3 id={`skills-${index}`} className="text-xl font-semibold text-pink-soft">{group.name}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className="chip">{item}</li>
                ))}
              </ul>
            </section>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
