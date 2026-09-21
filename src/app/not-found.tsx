import Link from "next/link";
import { LogoMark } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { navLinks } from "@/content/site";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-6 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]"
        style={{ background: "radial-gradient(circle, rgba(43,108,255,0.2), transparent 70%)" }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-noise opacity-20" />

      <div className="relative w-full max-w-2xl text-center">
        <LogoMark className="mx-auto h-12 w-12" glow id="notfound" />
        <p className="display mt-8 text-[clamp(4.5rem,18vw,9rem)] leading-none text-gradient">404</p>
        <h1 className="display mt-2 text-[clamp(1.4rem,3.4vw,2.2rem)] text-white">
          This page drifted off the map.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[0.95rem] leading-relaxed text-white/50">
          The link may be old or the page may have moved. Here is the way back into the MALHOT
          universe.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/" size="lg" icon="arrow">
            Back to home
          </ButtonLink>
          <ButtonLink href="/start" size="lg" variant="secondary" icon="arrowUpRight">
            Start a project
          </ButtonLink>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-white/8 pt-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[0.85rem] text-white/45 transition hover:text-brand-200"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
