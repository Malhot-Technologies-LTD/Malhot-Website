import { LogoMark } from "@/components/brand/Logo";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink">
      <div className="flex flex-col items-center">
        <div className="relative grid h-24 w-24 place-items-center">
          <span className="absolute inset-0 animate-pulse-glow rounded-full bg-[radial-gradient(circle,rgba(43,108,255,0.35),transparent_70%)]" />
          <span className="spin-slow absolute inset-2 rounded-full border-t border-brand-400/70" />
          <LogoMark className="h-10 w-10" id="loading" />
        </div>
        <p className="mt-6 text-[0.62rem] uppercase tracking-[0.4em] text-white/35">Loading</p>
        <div className="mt-5 h-px w-40 overflow-hidden bg-white/10">
          <span className="block h-full w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-brand-300 to-transparent" />
        </div>
      </div>
    </div>
  );
}
