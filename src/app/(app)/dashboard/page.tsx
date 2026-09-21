import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { desc, eq, or } from "drizzle-orm";
import { db } from "@/db";
import { contactMessages, projectRequests } from "@/db/schema";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your MALHOT client workspace.",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const requests = await db
    .select()
    .from(projectRequests)
    .where(or(eq(projectRequests.userId, user.id), eq(projectRequests.contactEmail, user.email)))
    .orderBy(desc(projectRequests.createdAt))
    .limit(12);

  const messages = await db
    .select()
    .from(contactMessages)
    .where(eq(contactMessages.email, user.email))
    .orderBy(desc(contactMessages.createdAt))
    .limit(8);

  return (
    <DashboardView
      user={{
        name: user.name,
        email: user.email,
        company: user.company,
        memberSince: user.createdAt.toISOString(),
      }}
      requests={requests.map((request) => ({
        id: request.id,
        reference: request.reference,
        title: request.title,
        description: request.description,
        status: request.status,
        budget: request.budget,
        timeline: request.timeline,
        projectTypes: request.projectTypes ?? [],
        createdAt: request.createdAt.toISOString(),
      }))}
      messages={messages.map((message) => ({
        id: message.id,
        subject: message.subject,
        message: message.message,
        createdAt: message.createdAt.toISOString(),
      }))}
    />
  );
}
