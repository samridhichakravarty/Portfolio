'use client';

import { useEffect, useRef } from 'react';
import { ArrowDown, Clapperboard } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { registerLenis, scrollToElement, scrollToY } from './smooth-scroll';

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const range = (value: number, start: number, end: number) => clamp((value - start) / (end - start));
const smooth = (value: number) => value * value * (3 - 2 * value);

function bindVideo(video: HTMLVideoElement) {
  let target = 0;

  const seek = () => {
    if (video.seeking || !Number.isFinite(video.duration) || video.duration <= 0) return;
    const time = target * Math.max(0, video.duration - 0.055);
    if (Math.abs(video.currentTime - time) >= 0.026) video.currentTime = time;
  };

  video.addEventListener('loadedmetadata', seek);
  video.addEventListener('seeked', seek);
  return {
    scrub(progress: number) {
      target = progress;
      seek();
    },
    destroy() {
      video.removeEventListener('loadedmetadata', seek);
      video.removeEventListener('seeked', seek);
    },
  };
}

export default function Cinema() {
  const story = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLVideoElement>(null);
  const second = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const root = story.current;
    const videos = [first.current, second.current];
    if (!root || !videos[0] || !videos[1]) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const clipOne = videos[0]!;
      const clipTwo = videos[1]!;
      const scrubOne = bindVideo(clipOne);
      const scrubTwo = bindVideo(clipTwo);
      clipOne.preload = 'auto';
      clipTwo.preload = 'auto';
      const desktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      const lenis = desktop ? new Lenis({ lerp: 0.14, smoothWheel: true }) : null;
      const tick = (time: number) => lenis?.raf(time * 1000);
      if (lenis) {
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        lenis.on('scroll', ScrollTrigger.update);
        registerLenis(lenis);
      }

      root.dataset.scrub = 'true';
      const update = (p: number) => {
        const reveal = smooth(range(p, 0.37, 0.51));
        const expand = smooth(range(p, 0.09, 0.38));
        const exit = smooth(range(p, 0.83, 1));
        const introCut = smooth(range(p, 0.075, 0.19));
        const phrase = smooth(range(p, 0.16, 0.22)) * (1 - smooth(range(p, 0.33, 0.41)));
        const personality = smooth(range(p, 0.46, 0.55)) * (1 - smooth(range(p, 0.66, 0.73)));
        const closer = smooth(range(p, 0.66, 0.75)) * (1 - smooth(range(p, 0.85, 0.96)));
        const css = {
          '--intro': 1 - introCut,
          '--phrase': phrase,
          '--personality': personality,
          '--closer': closer,
          '--expand': expand,
          '--reveal': reveal,
          '--exit': exit,
          '--progress': p,
        };
        for (const [key, value] of Object.entries(css)) root.style.setProperty(key, String(value));
        root.dataset.reel = p >= 0.45 ? '2' : '1';
        scrubOne.scrub(range(p, 0, 0.44));
        scrubTwo.scrub(range(p, 0.38, 0.93));
      };

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: () => 'top top+=' + (document.querySelector('header')?.offsetHeight ?? 72),
        end: 'bottom bottom',
        invalidateOnRefresh: true,
        onUpdate: self => update(self.progress),
        onRefresh: self => update(self.progress),
      });
      update(trigger.progress);
      return () => {
        trigger.kill();
        scrubOne.destroy();
        scrubTwo.destroy();
        clipOne.pause();
        clipTwo.pause();
        if (lenis) {
          registerLenis(null);
          gsap.ticker.remove(tick);
          gsap.ticker.lagSmoothing(500, 33);
          lenis.destroy();
        }
        delete root.dataset.scrub;
        delete root.dataset.reel;
        root.removeAttribute('style');
      };
    });

    return () => media.revert();
  }, []);

  function stepIntoStory() {
    const root = story.current;
    const about = document.getElementById('about');
    if (root?.dataset.scrub !== 'true') {
      if (about) scrollToElement(about, 'instant');
      return;
    }
    const headerHeight = document.querySelector('header')?.offsetHeight ?? 0;
    const top = window.scrollY + root.getBoundingClientRect().top - headerHeight;
    const distance = root.offsetHeight - window.innerHeight + headerHeight;
    const nextStep = Math.min(1, Math.max(0, (window.scrollY - top) / distance) + 0.24);
    if (nextStep >= 0.99) {
      if (about) scrollToElement(about);
      return;
    }
    scrollToY(top + distance * nextStep);
  }

  return (
    <div ref={story} className="cinema" id="top">
      <section className="stage" aria-labelledby="intro-title">
        <div className="stage-paper" aria-hidden="true" />
        <div className="screen" aria-hidden="true">
          <div className="film film-one">
            <video ref={first} src="/media/technology.mp4" poster="/media/technology.webp" preload="none" muted playsInline tabIndex={-1} onError={event => { event.currentTarget.hidden = true; }} />
          </div>
          <div className="film film-two">
            <video ref={second} src="/media/sunglasses.mp4" poster="/media/sunglasses.webp" preload="none" muted playsInline tabIndex={-1} onError={event => { event.currentTarget.hidden = true; }} />
          </div>
          <div className="film-shade" />
        </div>

        <div className="intro-copy">
          <p className="intro-kicker"><span /> DEVELOPER PORTFOLIO</p>
          <h1 id="intro-title">Hey, I’m<br /><em>Samridhi.</em></h1>
          <p className="intro-subtitle">I build things for the internet.</p>
        </div>

        <div className="intertitle intertitle-one" aria-hidden="true">I build things<br />for the <em>internet.</em></div>
        <div className="intertitle intertitle-two" aria-hidden="true">Code. Create.<br /><em>Repeat.</em></div>
        <div className="intertitle intertitle-three" aria-hidden="true">A little tech.<br /><em>A lot of personality.</em></div>

        <div className="intro-stickers" aria-hidden="true">
          <img className="hero-daisy" src="/media/daisy.webp" alt="" />
          <img className="hero-bolt" src="/media/bolt.webp" alt="" />
          <img className="hero-sparkle" src="/media/sparkle.webp" alt="" />
          <img className="hero-heart" src="/media/heart.webp" alt="" />
        </div>

        <div className="scene-controls">
          <button className="scroll-cue" onClick={stepIntoStory}><span><ArrowDown size={18} /></span><b className="scrub-label">Scroll to play</b><b className="still-label">Explore portfolio</b></button>
          <div className="scene-meter" aria-hidden="true">
            <div><Clapperboard size={15} /> <span className="reel-one">Scene 01</span><span className="reel-two">Scene 02</span><span className="scene-count">/ 02</span></div>
            <span className="meter-track"><i /></span>
          </div>
          <a href="#about" className="skip-cinema">Skip intro</a>
        </div>
      </section>
      <div className="still-two" aria-hidden="true">
        <img src="/media/sunglasses.webp" alt="" />
        <p>Code. Create. <em>Repeat.</em></p>
      </div>
    </div>
  );
}
