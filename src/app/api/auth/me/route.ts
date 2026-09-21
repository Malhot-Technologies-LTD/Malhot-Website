import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Who is signed in, if anyone.
 *
 * This exists so the marketing pages can be static. Reading the session in the
 * `(site)` layout forced every public page to render per request — and to hit
 * the database — purely so the navbar could show a name. Now the pages are
 * prerendered and the navbar asks for the session once, after hydration.
 *
 * Never cached: a stale answer here would show the wrong person's name.
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    return NextResponse.json(
      { user: user ? { name: user.name, email: user.email } : null },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    // A database outage must not break the public site: signed out is the safe
    // answer, and the navbar simply shows "Sign in".
    return NextResponse.json({ user: null }, { headers: { "Cache-Control": "no-store" } });
  }
}
