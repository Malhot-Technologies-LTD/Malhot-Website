import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { ProcessStory } from "@/components/sections/ProcessStory";
import { ServicesShowcase } from "@/components/sections/ServicesShowcase";
import { StatsBand } from "@/components/sections/StatsBand";
import { Testimonials } from "@/components/sections/Testimonials";
import { WorkShowcase } from "@/components/sections/WorkShowcase";

export default function HomePage() {
  return (
    <div className="relative">
      <Hero />

      {/* The page pulls up over the pinned hero — square edge, full bleed. */}
      <div className="relative z-10 bg-ink shadow-[0_-50px_90px_-40px_rgba(0,0,0,0.85)]">
        <Marquee />
        <AboutTeaser />
        <ServicesShowcase />
        <ProcessStory />
        <WorkShowcase />
        <StatsBand />
        <Testimonials />
      </div>
    </div>
  );
}
