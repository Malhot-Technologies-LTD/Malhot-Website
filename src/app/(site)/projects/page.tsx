import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ProjectsGrid } from "@/components/sections/ProjectsGrid";
import { Testimonials } from "@/components/sections/Testimonials";
import { ButtonLink } from "@/components/ui/Button";
import { media } from "@/content/site";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected MALHOT work — web platforms, mobile apps, design systems and campaigns built for real businesses.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Our projects"
        title="Real solutions. Real impact."
        highlight="impact."
        copy="A selection of products we designed, engineered and launched. Every one of them is live, measured and still evolving."
        video={media.gridVideo}
        poster={media.gridPoster}
      >
        <ButtonLink href="/start" size="lg" icon="arrowUpRight">
          Start your project
        </ButtonLink>
      </PageHero>

      <ProjectsGrid />
      <Testimonials />
    </>
  );
}
