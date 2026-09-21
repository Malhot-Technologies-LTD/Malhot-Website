import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";

export default function FlowLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-ink">
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="shell flex h-[4.6rem] items-center justify-between">
          <Link href="/" aria-label="MALHOT home">
            <Logo markClassName="h-7 w-7" />
          </Link>
          <Link
            href="/"
            className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[0.78rem] text-white/55 backdrop-blur-md transition hover:border-brand-400/50 hover:text-white"
          >
            Save &amp; continue later
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
