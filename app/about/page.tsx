import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { ABOUT } from "@/lib/data";
import { breadcrumbLd } from "@/lib/schema";
import { JsonLd } from "@/components/site/JsonLd";
import { Journey } from "@/components/home/Journey";
import { Skills } from "@/components/home/Skills";

export const metadata: Metadata = {
  title: "About Samridhi, Full-Stack Developer in Jaipur",
  description: "Meet Samridhi Chakravarty: AI and Data Science student, Forward Deployment Engineer and freelance full-stack developer in Jaipur, India.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about", title: "About Samridhi, Full-Stack Developer in Jaipur", description: ABOUT.lead },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
      <section className="mx-auto grid max-w-5xl items-center gap-10 px-6 pt-32 md:grid-cols-[0.8fr_1.2fr] md:pt-40">
        <div className="sticker mx-auto w-full max-w-sm -rotate-2 overflow-hidden bg-surface">
          <Image src={SITE.portrait} alt="Samridhi wearing pink sunglasses against a blue sky" width={960} height={1050} priority sizes="(max-width: 768px) 80vw, 380px" className="h-full w-full object-cover" />
        </div>
        <div>
          <p className="label">About me</p>
          <h1 className="mt-3 text-[clamp(2.3rem,5.6vw,4.2rem)] font-bold">
            Hi, I&apos;m <span className="gradient-text">Samridhi!</span>
          </h1>
          <p className="mt-5 text-lg text-muted-2">{ABOUT.lead}</p>
          <p className="mt-4 text-lg text-muted-2">{ABOUT.body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/hire" className="btn btn-primary">Work with me 🚀</Link>
            <a href={SITE.resume} download className="btn btn-ghost">Download résumé</a>
          </div>
        </div>
      </section>
      <Journey />
      <Skills />
    </>
  );
}
