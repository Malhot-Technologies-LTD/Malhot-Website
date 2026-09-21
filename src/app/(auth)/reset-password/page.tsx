import type { Metadata } from "next";
import { ResetView } from "./ResetView";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Choose a new password for your MALHOT account.",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return <ResetView token={token ?? ""} />;
}
