import { randomBytes } from "node:crypto";
import { db } from "@/db";
import { projectRequests } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await getCurrentUser();

    const need = String(body?.need ?? "").trim();
    const projectTypes: string[] = Array.isArray(body?.projectTypes)
      ? body.projectTypes.map((item: unknown) => String(item)).slice(0, 8)
      : [];
    const title = String(body?.title ?? "").trim();
    const description = String(body?.description ?? "").trim();
    const budget = String(body?.budget ?? "").trim();
    const timeline = String(body?.timeline ?? "").trim();
    const contactName = String(body?.contactName ?? "").trim();
    const contactEmail = String(body?.contactEmail ?? "").trim().toLowerCase();
    const contactPhone = String(body?.contactPhone ?? "").trim();
    const company = String(body?.company ?? "").trim();

    const valid =
      need &&
      projectTypes.length > 0 &&
      title.length >= 3 &&
      description.length >= 12 &&
      budget &&
      timeline &&
      contactName.length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contactEmail);

    if (!valid) {
      return Response.json(
        { error: "Some details are missing. Please review the steps." },
        { status: 400 },
      );
    }

    const reference = `MAL-${randomBytes(3).toString("hex").toUpperCase()}`;

    await db.insert(projectRequests).values({
      reference,
      userId: user?.id ?? null,
      need,
      projectTypes,
      title,
      description,
      budget,
      timeline,
      contactName,
      contactEmail,
      contactPhone: contactPhone || null,
      company: company || null,
    });

    return Response.json({ ok: true, reference });
  } catch {
    return Response.json(
      { error: "We could not submit your brief. Please try again." },
      { status: 500 },
    );
  }
}
