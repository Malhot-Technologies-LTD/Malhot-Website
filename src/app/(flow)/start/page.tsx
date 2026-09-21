import type { Metadata } from "next";
import { StartFlow } from "@/components/start/StartFlow";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Start a Project",
  description:
    "Tell MALHOT about your project in six guided steps and get a response within one business day.",
};

export default async function StartProjectPage() {
  const user = await getCurrentUser();

  return (
    <StartFlow
      defaults={{
        contactName: user?.name ?? "",
        contactEmail: user?.email ?? "",
        company: user?.company ?? "",
      }}
      signedIn={Boolean(user)}
    />
  );
}
