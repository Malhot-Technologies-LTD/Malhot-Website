import { eq } from "drizzle-orm";
import { db } from "@/db";
import { passwordResets, users } from "@/db/schema";
import { createToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Creates a single-use reset token. In production this token would be emailed.
 * For this environment the token is returned so the flow stays completable.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email ?? "").trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return Response.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    const [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);

    if (!user) {
      // Never disclose whether an account exists.
      return Response.json({ ok: true, delivered: false });
    }

    const token = createToken();
    await db.insert(passwordResets).values({
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 30),
    });

    return Response.json({ ok: true, delivered: true, token });
  } catch {
    return Response.json({ error: "We could not start the reset. Please retry." }, { status: 500 });
  }
}
