"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Icon } from "@/components/brand/Icon";
import { Aurora, VideoBackground } from "@/components/ui/Atmosphere";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  highlight,
  copy,
  video,
  poster,
  image,
  breadcrumb,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  copy?: string;
  video?: string;
  poster?: string;
  image?: string;
  breadcrumb?: { label: string; href: string };
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative isolate flex min-h-[64svh] items-end overflow-hidden pb-16 pt-40 sm:min-h-[70svh] sm:pb-24",
        className,
      )}
    >
      {video && poster ? (
        <VideoBackground
          src={video}
          poster={poster}
          opacity={0.42}
          parallax
          overlayClassName="bg-[linear-gradient(180deg,rgba(4,7,15,0.88)_0%,rgba(4,7,15,0.7)_45%,rgba(4,7,15,0.97)_100%)]"
        />
      ) : image ? (
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" aria-hidden className="h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,7,15,0.85),rgba(4,7,15,0.97))]" />
        </div>
      ) : (
        <Aurora />
      )}
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-noise opacity-25" />

      <div className="shell relative">
        {breadcrumb ? (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: EASE.soft }}
            className="mb-7"
          >
            <Link
              href={breadcrumb.href}
              className="group inline-flex items-center gap-2 text-[0.8rem] text-white/50 transition hover:text-white"
            >
              <Icon
                name="arrowLeft"
                className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1"
              />
              {breadcrumb.label}
            </Link>
          </motion.div>
        ) : null}

        <motion.span
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE.soft, delay: 0.1 }}
          className="eyebrow"
        >
          <span className="h-[5px] w-[5px] rounded-full bg-brand-400 shadow-[0_0_12px_2px_rgba(43,108,255,0.8)]" />
          {eyebrow}
        </motion.span>

        <h1 className="display mt-6 flex max-w-5xl flex-wrap text-[clamp(2.4rem,6.4vw,5.2rem)] text-white">
          {title.split(" ").map((word, index) => (
            <span key={`${word}-${index}`} className="overflow-hidden pb-[0.05em] pr-[0.26em]">
              <motion.span
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 1, ease: EASE.soft, delay: 0.2 + index * 0.07 }}
                className={cn(
                  "inline-block",
                  highlight && word.toLowerCase().includes(highlight.toLowerCase()) && "text-gradient",
                )}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        {copy ? (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE.soft, delay: 0.5 }}
            className="mt-7 max-w-2xl text-[1rem] leading-relaxed text-white/55"
          >
            {copy}
          </motion.p>
        ) : null}

        {children ? (
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE.soft, delay: 0.62 }}
            className="mt-10"
          >
            {children}
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
