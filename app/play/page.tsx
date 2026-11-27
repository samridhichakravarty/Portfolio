import type { Metadata } from "next";
import Link from "next/link";
import { AlbumGrid } from "@/components/games/AlbumGrid";
import { breadcrumbLd } from "@/lib/schema";
import { JsonLd } from "@/components/site/JsonLd";

export const metadata: Metadata = {
  title: "Play: Mini Games and Sticker Album",
  description: "Play Ship It!, Bug Pop and Stack Match, pull skill capsules and collect all 12 stickers hidden around Samridhi's portfolio.",
  alternates: { canonical: "/play" },
  openGraph: { url: "/play", title: "Play: Mini Games and Sticker Album", description: "Mini games and 12 hidden stickers." },
};

export default function PlayPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-10 pt-32 md:pt-40">
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Play", path: "/play" }])} />
      <p className="label">Playground</p>
      <h1 className="mt-3 max-w-3xl text-[clamp(2.4rem,6vw,4.6rem)] font-bold">
        Take a <span className="gradient-text">play break</span>
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-2">
        Games are totally optional. Each one drops a sticker into your album. Prefer calm? <Link href="/hire" className="text-pink-soft underline">Skip straight to the brief</Link>.
      </p>
      <section id="album" aria-labelledby="album-title" className="mt-16 scroll-mt-28">
        <h2 id="album-title" className="mb-6 text-3xl font-bold">Sticker album</h2>
        <AlbumGrid />
      </section>
    </div>
  );
}
