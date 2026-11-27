import Link from "next/link";
import { SITE } from "@/lib/site";
import { HeroArt } from "./HeroArt";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-32 md:grid-cols-[1.1fr_0.9fr] md:pt-40">
      <div>
        <p className="chip rise" style={{ ["--d" as string]: "0.05s" }}>
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-pink" /> {SITE.availability}
        </p>
        <h1 id="hero-title" className="rise-soft mt-5 text-[clamp(2.8rem,7.2vw,5.5rem)] font-bold" style={{ ["--d" as string]: "0.1s" }}>
          Hi, I&apos;m Samridhi!
          <span className="gradient-text mt-2 block">I build websites that actually ship.</span>
        </h1>
        <p className="rise mt-6 max-w-xl text-lg text-muted-2" style={{ ["--d" as string]: "0.25s" }}>
          I&apos;m a <strong className="text-text">freelance full-stack developer in Jaipur, India</strong>. I turn ideas into fast Next.js
          websites, web apps and AI-powered features for startups and growing businesses.
        </p>
        <div className="rise mt-8 flex flex-wrap gap-3" style={{ ["--d" as string]: "0.38s" }}>
          <Link href="/hire" className="btn btn-primary">Start a project 🚀</Link>
          <Link href="/play" className="btn btn-ghost">Play the games 🎮</Link>
        </div>
        <ul className="rise mt-8 flex flex-wrap gap-2" aria-label="Quick facts" style={{ ["--d" as string]: "0.5s" }}>
          <li className="chip">Forward Deployment Engineer</li>
          <li className="chip">B.Tech · AI &amp; Data Science</li>
          <li className="chip">Next.js · React · Node.js</li>
        </ul>
      </div>
      <HeroArt />
    </section>
  );
}
