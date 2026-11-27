import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { WorkCartridges } from "@/components/home/WorkCartridges";
import { Skills } from "@/components/home/Skills";
import { Journey } from "@/components/home/Journey";
import { PlayTeaser } from "@/components/home/PlayTeaser";
import { ContactCta } from "@/components/home/ContactCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <WorkCartridges />
      <Skills />
      <PlayTeaser />
      <Journey />
      <ContactCta />
    </>
  );
}
