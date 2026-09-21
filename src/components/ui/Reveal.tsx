"use client";

import type { ElementType, ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EASE, fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  blur?: boolean;
  as?: ElementType;
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  blur = true,
}: RevealProps) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: blur ? "blur(8px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={viewportOnce}
      transition={{ duration: 0.85, ease: EASE.soft, delay }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerGroup({
  children,
  className,
  amount = 0.08,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={stagger(amount, delay)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}

type TextRevealProps = {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  highlight?: string[];
};

/**
 * Word-by-word mask reveal used for major headings only.
 */
export function TextReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  as = "h2",
  highlight = [],
}: TextRevealProps) {
  const reduced = useReducedMotion();
  const Tag = motion[as] as typeof motion.h2;
  const words = text.split(" ");
  const highlightSet = new Set(highlight.map((w) => w.toLowerCase()));

  if (reduced) {
    const Static = as;
    return (
      <Static className={className}>
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className={cn(
              highlightSet.has(word.toLowerCase().replace(/[.,]/g, "")) && "text-gradient",
            )}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </Static>
    );
  }

  return (
    <Tag
      className={cn("flex flex-wrap", className)}
      variants={stagger(0.055, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="relative overflow-hidden py-[0.06em] pr-[0.26em]">
          <motion.span
            className={cn(
              "inline-block will-change-transform",
              highlightSet.has(word.toLowerCase().replace(/[.,]/g, "")) && "text-gradient",
              wordClassName,
            )}
            variants={{
              hidden: { y: "108%", opacity: 0 },
              show: {
                y: "0%",
                opacity: 1,
                transition: { duration: 0.95, ease: EASE.soft },
              },
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "left",
  highlight,
  className,
  children,
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
  highlight?: string[];
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <Reveal>
          <span className="eyebrow">
            <span className="h-[5px] w-[5px] rounded-full bg-brand-400 shadow-[0_0_12px_2px_rgba(43,108,255,0.8)]" />
            {eyebrow}
          </span>
        </Reveal>
      ) : null}
      <TextReveal
        text={title}
        highlight={highlight}
        className={cn(
          "display text-balance text-[clamp(2rem,4.6vw,3.9rem)] text-white",
          align === "center" && "justify-center",
        )}
      />
      {copy ? (
        <Reveal delay={0.1}>
          <p
            className={cn(
              "max-w-2xl text-[0.98rem] leading-relaxed text-white/55",
              align === "center" && "mx-auto text-center",
            )}
          >
            {copy}
          </p>
        </Reveal>
      ) : null}
      {children}
    </div>
  );
}
