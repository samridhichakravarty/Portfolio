import type { Metadata } from "next";
import { SITE, PROCESS } from "@/lib/site";
import { breadcrumbLd } from "@/lib/schema";
import { JsonLd } from "@/components/site/JsonLd";
import { BriefBuilder } from "@/components/hire/BriefBuilder";

export const metadata: Metadata = {
  title: "Hire a Freelance Web Developer in India",
  description: "Build your project brief in a minute and send it to Samridhi, a freelance full-stack developer in Jaipur. Websites, web apps and AI features.",
  alternates: { canonical: "/hire" },
  openGraph: { url: "/hire", title: "Hire a Freelance Web Developer in India", description: "Build your project brief in a minute and send it to Samridhi." },
};

export default function HirePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-10 pt-32 md:pt-40">
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Hire me", path: "/hire" }])} />
      <p className="label">Hire me</p>
      <h1 className="mt-3 max-w-3xl text-[clamp(2.4rem,6vw,4.6rem)] font-bold">
        Let&apos;s build <span className="gradient-text">your project</span>
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-2">
        I&apos;m a freelance full-stack developer in {SITE.city}, India. Pick what you need below and I&apos;ll turn it into a ready-to-send brief. {SITE.availability}.
      </p>
      <div className="mt-10"><BriefBuilder /></div>

      <section aria-labelledby="how-title" className="mt-20">
        <h2 id="how-title" className="text-3xl font-bold">How working together goes</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((item, index) => (
            <li key={item.step} className="card p-5">
              <span className="font-display text-4xl font-bold text-pink">{index + 1}</span>
              <h3 className="mt-2 text-xl font-semibold">{item.step}</h3>
              <p className="mt-1 text-muted-2">{item.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
