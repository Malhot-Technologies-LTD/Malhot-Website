import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "@/db";
import { passwordResets, users } from "@/db/schema";
import { hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = String(body?.token ?? "").trim();
    const password = String(body?.password ?? "");

    if (!token) {
      return Response.json({ error: "This reset link is invalid." }, { status: 400 });
    }
    if (password.length < 8) {
      return Response.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const [record] = await db
      .select()
      .from(passwordResets)
      .where(
        and(
          eq(passwordResets.token, token),
          gt(passwordResets.expiresAt, new Date()),
          isNull(passwordResets.usedAt),
        ),
      )
      .limit(1);

    if (!record) {
      return Response.json({ error: "This reset link has expired." }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    await db.update(users).set({ passwordHash }).where(eq(users.id, record.userId));
    await db
      .update(passwordResets)
      .set({ usedAt: new Date() })
      .where(eq(passwordResets.token, token));

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "We could not reset your password." }, { status: 500 });
  }
}
