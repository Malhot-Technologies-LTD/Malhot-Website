import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignupView } from "./SignupView";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your MALHOT workspace and start building.",
};

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");
  return <SignupView />;
}
