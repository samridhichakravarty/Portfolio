import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE, SERVICES } from "@/lib/site";
import { breadcrumbLd, faqLd } from "@/lib/schema";
import { JsonLd } from "@/components/site/JsonLd";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find((item) => item.slug === slug);
  if (!service) return {};
  return {
    title: service.seoTitle,
    description: service.short,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { url: `/services/${service.slug}`, title: service.seoTitle, description: service.short },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = SERVICES.find((item) => item.slug === slug);
  if (!service) notFound();

  return (
    <article className="mx-auto max-w-4xl px-6 pb-10 pt-32 md:pt-40">
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.title, path: `/services/${service.slug}` },
          ]),
          faqLd(service.faqs),
        ]}
      />
      <p className="label"><Link href="/services" className="hover:underline">Services</Link> / {service.title}</p>
      <h1 className="mt-3 text-[clamp(2.3rem,5.6vw,4.2rem)] font-bold">
        <span className="gradient-text">{service.seoTitle}</span>
      </h1>
      <p className="mt-5 text-lg text-muted-2">{service.intro}</p>

      <section aria-labelledby="get-title" className="mt-12">
        <h2 id="get-title" className="text-3xl font-bold">What you get</h2>
        <ul className="mt-5 grid gap-3">
          {service.deliverables.map((item) => (
            <li key={item} className="card flex items-start gap-3 p-4">
              <span aria-hidden="true" className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-pink text-sm text-white">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="faq-title" className="mt-12">
        <h2 id="faq-title" className="text-3xl font-bold">Questions people ask</h2>
        <div className="mt-5 grid gap-3">
          {service.faqs.map((faq) => (
            <details key={faq.q} className="card group p-5">
              <summary className="cursor-pointer list-none font-display text-lg font-semibold marker:content-none">
                <span className="mr-2 inline-block text-pink transition-transform group-open:rotate-45">+</span>
                {faq.q}
              </summary>
              <p className="mt-3 text-muted-2">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="sticker mt-14 bg-gradient-to-br from-pink to-fuchsia p-8 text-center">
        <h2 className="text-3xl font-bold text-white">Want this for your project?</h2>
        <p className="mt-2 text-white/90">{SITE.availability}. Send me a quick brief and I&apos;ll reply with next steps.</p>
        <Link href="/hire" className="btn mt-6 !bg-white !text-pink">Build my brief</Link>
      </div>
    </article>
  );
}
