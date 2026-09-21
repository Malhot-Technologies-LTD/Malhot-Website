"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { Icon } from "@/components/brand/Icon";
import { projects } from "@/content/site";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

const filters = ["All", "Web", "Mobile", "Design", "Marketing"] as const;

export function ProjectsGrid() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const visible = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  );

  return (
    <section className="relative py-16 sm:py-20">
      <div className="shell">
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((item) => {
            const active = item === filter;
            const count =
              item === "All"
                ? projects.length
                : projects.filter((p) => p.category === item).length;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={cn(
                  "relative rounded-full px-5 py-2.5 text-[0.82rem] font-medium transition-colors duration-300",
                  active ? "text-white" : "text-white/50 hover:text-white/80",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full border border-brand-400/45 bg-brand-500/15 shadow-[0_0_30px_-12px_rgba(43,108,255,0.9)]"
                    transition={{ duration: 0.45, ease: EASE.swift }}
                  />
                ) : (
                  <span className="absolute inset-0 rounded-full border border-white/8 bg-white/[0.02]" />
                )}
                <span className="relative flex items-center gap-2">
                  {item}
                  <span className="font-mono text-[0.66rem] text-white/35">{count}</span>
                </span>
              </button>
            );
          })}
        </div>

        <LayoutGroup>
          <motion.div layout className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visible.map((project, index) => (
                <ProjectCard key={project.slug} project={project} index={index} compact />
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

        {visible.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 flex flex-col items-center gap-4 rounded-[1.5rem] border border-dashed border-white/12 bg-white/[0.02] py-20 text-center"
          >
            <span className="grid h-14 w-14 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/40">
              <Icon name="grid" className="h-6 w-6" />
            </span>
            <p className="display text-[1.3rem] text-white">Nothing here yet</p>
            <p className="max-w-sm text-[0.88rem] text-white/45">
              We are still publishing work in this category. Try another filter — or tell us
              about the project you have in mind.
            </p>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
