const WORDS = ["NEXT.JS", "REACT", "NODE.JS", "AI FEATURES", "TYPESCRIPT", "MONGODB", "SUPABASE", "SHIP IT"];

// Decorative ticker, hidden from assistive tech. The same words appear as real text elsewhere.
export function Marquee() {
  const row = WORDS.map((word) => `${word} ✦`).join("  ");
  return (
    <div aria-hidden="true" className="relative my-6 overflow-hidden border-y border-border bg-pink/10 py-3">
      <div className="marquee-track flex w-max whitespace-nowrap font-display text-2xl font-bold text-pink-soft sm:text-3xl">
        {[0, 1, 2, 3].map((index) => (
          <span key={index} className="px-4">{row}</span>
        ))}
      </div>
    </div>
  );
}
