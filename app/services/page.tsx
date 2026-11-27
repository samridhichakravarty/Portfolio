import type { Metadata } from "next";
import Link from "next/link";
import { SERVICES, PROCESS } from "@/lib/site";
import { breadcrumbLd } from "@/lib/schema";
import { JsonLd } from "@/components/site/JsonLd";

export const metadata: Metadata = {
  title: "Freelance Web Development & AI Services",
  description: "Freelance Next.js websites, web apps, AI chatbots and admin dashboards from a full-stack developer in Jaipur, India.",
  alternates: { canonical: "/services" },
  openGraph: { url: "/services", title: "Freelance Web Development & AI Services", description: "Websites, web apps, AI features and dashboards." },
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-10 pt-32 md:pt-40">
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }])} />
      <p className="label">Services</p>
      <h1 className="mt-3 max-w-3xl text-[clamp(2.4rem,6vw,4.6rem)] font-bold">
        What I can <span className="gradient-text">build for you</span>
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-2">
        Three ways I help startups and growing businesses: custom websites and web apps, AI features, and landing pages with admin dashboards.
      </p>

      <ul className="mt-12 grid gap-6 md:grid-cols-3">
        {SERVICES.map((service) => (
          <li key={service.slug}>
            <Link href={`/services/${service.slug}`} className="card group block h-full p-6 transition-all hover:-translate-y-2 hover:shadow-[0_30px_60px_-24px_var(--color-glow)]">
              <h2 className="text-2xl font-semibold">{service.title}</h2>
              <p className="mt-3 text-muted-2">{service.short}</p>
              <span className="mt-5 inline-flex items-center gap-2 font-display font-semibold text-pink-soft">
                See details <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <section aria-labelledby="process-title" className="mt-20">
        <h2 id="process-title" className="text-3xl font-bold">How it works</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((item, index) => (
            <li key={item.step} className="card p-5">
              <span className="font-display text-4xl font-bold text-pink">{index + 1}</span>
              <h3 className="mt-2 text-xl font-semibold">{item.step}</h3>
              <p className="mt-1 text-muted-2">{item.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10"><Link href="/hire" className="btn btn-primary">Start with a brief 🚀</Link></div>
      </section>
    </div>
  );
}
