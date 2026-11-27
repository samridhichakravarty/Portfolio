"use client";

import { getPrefs } from "./prefs";

// Tiny sound and confetti helpers. No assets, no libraries.
let audio: AudioContext | null = null;

export function blip(freq = 660, seconds = 0.08, type: OscillatorType = "triangle", volume = 0.04) {
  if (!getPrefs().sound) return;
  try {
    audio ??= new AudioContext();
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + seconds);
    osc.connect(gain).connect(audio.destination);
    osc.start();
    osc.stop(audio.currentTime + seconds);
  } catch {
    // Audio is optional.
  }
}

export const sfx = {
  jump: () => blip(520, 0.09, "square", 0.025),
  coin: () => {
    blip(880, 0.06);
    setTimeout(() => blip(1175, 0.09), 60);
  },
  hit: () => blip(140, 0.2, "sawtooth", 0.05),
  pop: () => blip(700 + Math.random() * 300, 0.06),
  win: () => [523, 659, 784, 1047].forEach((freq, index) => setTimeout(() => blip(freq, 0.14), index * 90)),
};

const COLORS = ["#ff69b4", "#ff2d8d", "#4561ff", "#ffe66d", "#c7a4ff"];

export function confetti(x: number, y: number, count = 26) {
  if (typeof document === "undefined" || getPrefs().calm) return;
  for (let index = 0; index < count; index += 1) {
    const piece = document.createElement("span");
    const size = 6 + Math.random() * 7;
    Object.assign(piece.style, {
      position: "fixed",
      left: `${x}px`,
      top: `${y}px`,
      width: `${size}px`,
      height: `${size * 0.6}px`,
      background: COLORS[index % COLORS.length],
      borderRadius: "2px",
      pointerEvents: "none",
      zIndex: "100",
    });
    document.body.appendChild(piece);
    const angle = Math.random() * Math.PI * 2;
    const distance = 60 + Math.random() * 140;
    const animation = piece.animate(
      [
        { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
        {
          transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance + 90}px) rotate(${Math.random() * 540}deg)`,
          opacity: 0,
        },
      ],
      { duration: 800 + Math.random() * 500, easing: "cubic-bezier(.2,.8,.3,1)" },
    );
    animation.onfinish = () => piece.remove();
  }
}
