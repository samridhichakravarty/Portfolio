import Link from "next/link";
import { SITE } from "@/lib/site";
import { Reveal } from "@/components/site/Reveal";

export function ContactCta() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="mx-auto max-w-5xl px-6 py-20">
      <Reveal>
        <div className="sticker relative overflow-hidden bg-gradient-to-br from-pink to-fuchsia p-8 text-center sm:p-14">
          <span aria-hidden="true" className="float absolute -left-4 top-6 text-5xl" style={{ ["--r" as string]: "-12deg" }}>✨</span>
          <span aria-hidden="true" className="float absolute -right-2 bottom-8 text-5xl" style={{ ["--r" as string]: "10deg", animationDelay: "1.2s" }}>💖</span>
          <p className="label !text-white/85">Let&apos;s work together</p>
          <h2 id="contact-title" className="mt-3 text-[clamp(2.2rem,5.4vw,4.2rem)] font-bold text-white">
            Got an idea? Let&apos;s build something fun!
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
            I&apos;m taking on freelance projects: websites, web apps and AI features. Tell me what you have in mind and I&apos;ll reply with next steps.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/hire" className="btn !bg-white !text-pink hover:-translate-y-1">Build my project brief</Link>
            <a href={`mailto:${SITE.email}`} className="btn border-2 border-white/80 text-white hover:bg-white/15">Email {SITE.short}</a>
          </div>
          <p className="mt-6 font-mono text-sm text-white/85">{SITE.email}</p>
        </div>
      </Reveal>
    </section>
  );
}
