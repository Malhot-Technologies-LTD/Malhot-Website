import { db } from "@/db";
import { contactMessages } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const subject = String(body?.subject ?? "").trim();
    const message = String(body?.message ?? "").trim();

    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || message.length < 12) {
      return Response.json({ error: "Please complete every required field." }, { status: 400 });
    }

    const [row] = await db
      .insert(contactMessages)
      .values({ name, email, subject: subject || null, message })
      .returning({ id: contactMessages.id });

    return Response.json({ ok: true, id: row.id });
  } catch {
    return Response.json({ error: "We could not send your message. Please retry." }, { status: 500 });
  }
}
