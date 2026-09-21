import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

/**
 * The public shell. It reads nothing per request, so every page underneath is
 * prerendered and served from the edge.
 *
 * It used to call `getCurrentUser()` here and carry `force-dynamic`, which made
 * the whole marketing site render on demand — and touch the database — just so
 * the navbar could show a name. The navbar now asks `/api/auth/me` itself once
 * after hydration. Do not reintroduce a session read at this level.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
