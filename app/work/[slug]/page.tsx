import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECTS } from "@/lib/data";
import { breadcrumbLd } from "@/lib/schema";
import { JsonLd } from "@/components/site/JsonLd";
import { CollectOnMount } from "@/components/site/CollectOnMount";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((item) => item.slug === slug);
  if (!project) return {};
  const title = `${project.title}: ${project.category} case study`;
  return {
    title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { url: `/work/${project.slug}`, title, description: project.summary },
  };
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const project = PROJECTS.find((item) => item.slug === slug);
  if (!project) notFound();
  const next = PROJECTS.find((item) => item.slug !== project.slug);

  return (
    <article className="mx-auto max-w-4xl px-6 pb-10 pt-32 md:pt-40">
      <CollectOnMount id="cartridge" />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Work", path: "/#work" },
          { name: project.title, path: `/work/${project.slug}` },
        ])}
      />
      <p className="label">Case study {project.number} · {project.category}</p>
      <h1 className="mt-3 text-[clamp(2.3rem,5.6vw,4.2rem)] font-bold"><span className="gradient-text">{project.title}</span></h1>
      <p className="mt-5 text-lg text-muted-2">{project.description}</p>

      <div className={`sticker mt-10 grid h-52 place-items-center bg-gradient-to-br ${project.hue}`}>
        <span aria-hidden="true" className="font-display text-9xl font-bold text-white/90">{project.number}</span>
      </div>

      <section aria-labelledby="highlights" className="mt-12">
        <h2 id="highlights" className="text-3xl font-bold">What it does</h2>
        <ul className="mt-5 grid gap-3">
          {project.highlights.map((item) => (
            <li key={item} className="card flex items-start gap-3 p-4">
              <span aria-hidden="true" className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-pink text-sm text-white">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="stack" className="mt-12">
        <h2 id="stack" className="text-3xl font-bold">Built with</h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {project.stack.map((tech) => <li key={tech} className="chip !text-base">{tech}</li>)}
        </ul>
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        <a href={project.repo} target="_blank" rel="noreferrer" className="btn btn-primary">View the code ↗</a>
        {next && <Link href={`/work/${next.slug}`} className="btn btn-ghost">Next: {next.title} →</Link>}
        <Link href="/hire" className="btn btn-ghost">Build something similar</Link>
      </div>
    </article>
  );
}
