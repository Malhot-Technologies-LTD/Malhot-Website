"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Icon } from "@/components/brand/Icon";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { EASE } from "@/lib/motion";
import { media } from "@/content/site";

export function AuthShell({
  children,
  visualTitle,
  visualCopy,
  badge,
  image = media.auth,
  align = "right",
}: {
  children: ReactNode;
  visualTitle: string;
  visualCopy: string;
  badge: string;
  image?: string;
  align?: "left" | "right";
}) {
  return (
    <div className="relative min-h-screen lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      {/* visual side */}
      <motion.aside
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: EASE.soft }}
        className={`relative hidden overflow-hidden lg:block ${align === "left" ? "lg:order-2" : ""}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-[linear-gradient(200deg,rgba(6,15,40,0.55),rgba(4,7,15,0.94))]" />
        <div aria-hidden className="absolute inset-0 grid-noise opacity-20" />
        <motion.div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px]"
          animate={{ opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: "radial-gradient(circle, rgba(43,108,255,0.32), transparent 68%)" }}
        />

        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          <Link href="/" className="w-fit">
            <Logo />
          </Link>

          <div className="max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE.soft, delay: 0.25 }}
            >
              <LogoMark className="h-16 w-16" glow id="auth-visual" />
              <p className="eyebrow mt-8">{badge}</p>
              <h2 className="display mt-4 text-[clamp(2rem,3.4vw,2.9rem)] text-white">
                {visualTitle}
              </h2>
              <p className="mt-5 text-[0.95rem] leading-relaxed text-white/50">{visualCopy}</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex items-center gap-6 text-[0.72rem] uppercase tracking-[0.22em] text-white/30"
          >
            <span className="flex items-center gap-2">
              <Icon name="spark" className="h-3.5 w-3.5 text-brand-400" /> Build
            </span>
            <span className="flex items-center gap-2">
              <Icon name="spark" className="h-3.5 w-3.5 text-brand-400" /> Innovate
            </span>
            <span className="flex items-center gap-2">
              <Icon name="spark" className="h-3.5 w-3.5 text-brand-400" /> Grow
            </span>
          </motion.div>
        </div>
      </motion.aside>

      {/* form side */}
      <div className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-14 sm:px-10 lg:px-14 xl:px-20">
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-25%] top-[-15%] h-[30rem] w-[30rem] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(43,108,255,0.16), transparent 70%)" }}
        />
        <div className="absolute left-6 top-7 flex w-[calc(100%-3rem)] items-center justify-between lg:hidden">
          <Link href="/">
            <Logo markClassName="h-7 w-7" />
          </Link>
          <Link
            href="/"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/50 transition hover:border-brand-400/60 hover:text-white"
            aria-label="Back to site"
          >
            <Icon name="close" className="h-4 w-4" />
          </Link>
        </div>

        <Link
          href="/"
          className="group absolute right-8 top-8 hidden items-center gap-2 text-[0.78rem] text-white/40 transition hover:text-white lg:flex"
        >
          <Icon name="arrowLeft" className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1" />
          Back to site
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE.soft, delay: 0.1 }}
          className="relative mx-auto w-full max-w-[26rem]"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

export function SocialAuthRow({ onNotice }: { onNotice: () => void }) {
  return (
    <>
      <div className="my-7 flex items-center gap-4">
        <span className="h-px flex-1 bg-white/10" />
        <span className="text-[0.68rem] uppercase tracking-[0.22em] text-white/25">or</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>
      <button
        type="button"
        onClick={onNotice}
        className="group flex w-full items-center justify-center gap-3 rounded-full border border-white/12 bg-white/[0.03] px-6 py-3.5 text-[0.86rem] text-white/75 transition-all duration-500 hover:border-brand-400/50 hover:bg-white/[0.06] hover:text-white"
      >
        <Icon name="google" className="h-4.5 w-4.5" />
        Continue with Google
      </button>
    </>
  );
}
