import { JOURNEY } from "@/lib/data";
import { Reveal } from "@/components/site/Reveal";

export function Journey() {
  return (
    <section id="journey" aria-labelledby="journey-title" className="mx-auto max-w-4xl px-6 py-20">
      <Reveal>
        <p className="label">Level select</p>
        <h2 id="journey-title" className="mt-3 text-[clamp(2.2rem,5vw,3.8rem)] font-bold">
          My <span className="gradient-text">journey so far</span>
        </h2>
      </Reveal>
      <ol className="relative mt-12 grid gap-8 border-l-2 border-dashed border-pink/40 pl-8">
        {JOURNEY.map((item, index) => (
          <li key={`${item.org}-${item.title}`} className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-[2.6rem] top-5 grid h-9 w-9 place-items-center rounded-full border-4 border-text bg-pink text-sm font-bold text-white"
            >
              {index + 1}
            </span>
            <Reveal delay={0.05}>
              <article className="card p-6">
                <p className="label">{item.dates}</p>
                <h3 className="mt-2 text-xl font-semibold sm:text-2xl">{item.title}</h3>
                <p className="mt-1 font-semibold text-pink-soft">
                  {item.org} <span className="text-muted-2">· {item.place}</span>
                </p>
                <p className="mt-3 text-muted-2">{item.text}</p>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
