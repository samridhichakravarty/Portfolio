"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";

// Games load only when they scroll near the screen, so they never slow down the first page view.
function OnView({ children, minHeight }: { children: ReactNode; minHeight: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minHeight: seen ? undefined : minHeight }}>
      {seen ? children : null}
    </div>
  );
}

const loading = () => <p className="p-6 text-muted-2">Loading game...</p>;
const Runner = dynamic(() => import("./ShipItRunner").then((m) => m.ShipItRunner), { ssr: false, loading });
const Pop = dynamic(() => import("./BugPop").then((m) => m.BugPop), { ssr: false, loading });
const Match = dynamic(() => import("./StackMatch").then((m) => m.StackMatch), { ssr: false, loading });

export function Games() {
  return (
    <div className="grid gap-8">
      <OnView minHeight={560}><Runner /></OnView>
      <OnView minHeight={560}><Pop /></OnView>
      <OnView minHeight={560}><Match /></OnView>
    </div>
  );
}
