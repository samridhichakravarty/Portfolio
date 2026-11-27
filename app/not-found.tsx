import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-10 pt-40 text-center">
      <p className="label">Error 404</p>
      <h1 className="mt-3 text-[clamp(2.6rem,7vw,5rem)] font-bold">
        Oops, this page <span className="gradient-text">wandered off</span>
      </h1>
      <p className="mt-5 text-lg text-muted-2">The link may be old or mistyped. Let&apos;s get you back to the fun.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">Back home 🏠</Link>
        <Link href="/play" className="btn btn-ghost">Play a game 🎮</Link>
      </div>
    </div>
  );
}
