"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Icon } from "@/components/brand/Icon";
import { LogoMark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px]"
        style={{ background: "radial-gradient(circle, rgba(43,108,255,0.18), transparent 70%)" }}
      />
      <div className="relative max-w-lg text-center">
        <LogoMark className="mx-auto h-12 w-12" glow id="error" />
        <p className="eyebrow mt-8 justify-center">
          <Icon name="alert" className="h-3.5 w-3.5 text-brand-300" />
          Unexpected error
        </p>
        <h1 className="display mt-5 text-[clamp(2rem,5vw,3rem)] text-white">
          Something interrupted the signal.
        </h1>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-white/50">
          The page could not finish loading. Try again — if it keeps happening, tell us and we
          will fix it fast.
        </p>
        {error.digest ? (
          <p className="mt-4 font-mono text-[0.72rem] text-white/25">ref: {error.digest}</p>
        ) : null}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={reset} icon="arrow" size="lg">
            Try again
          </Button>
          <Link
            href="/"
            className="rounded-full border border-white/12 px-6 py-3 text-[0.88rem] text-white/70 transition hover:border-brand-400/50 hover:text-white"
          >
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
