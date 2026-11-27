import { ImageResponse } from "next/og";

export const alt = "Samridhi Chakravarty, freelance full-stack developer in Jaipur, India";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "#fff5fa",
          background: "#08000f",
          backgroundImage:
            "radial-gradient(circle at 88% 0%, rgba(255,45,120,0.6), transparent 55%), radial-gradient(circle at 0% 100%, rgba(217,70,239,0.45), transparent 52%)",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 6, color: "#ff7eb3" }}>
          FREELANCE FULL-STACK DEVELOPER
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 118, fontWeight: 800, lineHeight: 1 }}>Hi, I&apos;m Samridhi!</div>
          <div style={{ fontSize: 54, marginTop: 20, color: "#ff2d78" }}>I build websites that actually ship.</div>
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#caa3bf" }}>
          Next.js · React · AI features · Jaipur, India
        </div>
      </div>
    ),
    size,
  );
}
