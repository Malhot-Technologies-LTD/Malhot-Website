import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginView } from "./LoginView";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your MALHOT client workspace.",
};

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");
  return <LoginView />;
}
