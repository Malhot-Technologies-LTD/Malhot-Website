"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Icon } from "@/components/brand/Icon";
import { Button, ButtonLink } from "@/components/ui/Button";
import { FormStatus, TextField } from "@/components/ui/Field";
import { EASE } from "@/lib/motion";
import { media } from "@/content/site";

export function ResetView({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next: typeof errors = {};
    if (password.length < 8) next.password = "Use at least 8 characters";
    if (confirm !== password) next.confirm = "Passwords do not match";
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error ?? "We could not reset your password");
      setStatus("success");
      setTimeout(() => router.push("/login"), 1600);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Reset failed");
    }
  };

  return (
    <AuthShell
      image={media.auth}
      badge="Secure reset"
      visualTitle="One new password. Everything back."
      visualCopy="Choose something strong. We hash every credential with a salted key derivation before it touches the database."
    >
      <AnimatePresence mode="wait">
        {!token ? (
          <motion.div
            key="invalid"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex min-h-[20rem] flex-col justify-center"
          >
            <span className="grid h-16 w-16 place-items-center rounded-2xl border border-rose-400/35 bg-rose-500/10 text-rose-200">
              <Icon name="alert" className="h-7 w-7" />
            </span>
            <h1 className="display mt-7 text-[1.7rem] text-white">This link is invalid</h1>
            <p className="mt-3 text-[0.92rem] text-white/50">
              The reset link is missing or has already been used. Request a fresh one and we will
              get you back in.
            </p>
            <div className="mt-8">
              <ButtonLink href="/forgot-password" icon="arrow" magnetic={false}>
                Request new link
              </ButtonLink>
            </div>
          </motion.div>
        ) : status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: EASE.soft }}
            className="flex min-h-[20rem] flex-col items-center justify-center text-center"
          >
            <span className="grid h-20 w-20 place-items-center rounded-full border border-brand-400/40 bg-brand-500/15 text-brand-200 shadow-[0_0_60px_-15px_rgba(43,108,255,1)]">
              <Icon name="check" className="h-8 w-8" strokeWidth={2.2} />
            </span>
            <h1 className="display mt-7 text-[1.6rem] text-white">Password updated</h1>
            <p className="mt-2 text-[0.88rem] text-white/45">Taking you to sign in…</p>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h1 className="display text-[clamp(1.9rem,4vw,2.5rem)] text-white">Set a new password</h1>
            <p className="mt-3 text-[0.92rem] text-white/45">
              Choose a password you have not used before.
            </p>

            <form onSubmit={submit} className="mt-9 space-y-5" noValidate>
              <FormStatus status={status === "error" ? "error" : "idle"} message={message} />
              <TextField
                label="New password"
                type="password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((p) => ({ ...p, password: undefined }));
                }}
                error={errors.password}
                autoComplete="new-password"
              />
              <TextField
                label="Confirm password"
                type="password"
                placeholder="••••••••••"
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value);
                  setErrors((p) => ({ ...p, confirm: undefined }));
                }}
                error={errors.confirm}
                autoComplete="new-password"
              />
              <Button
                type="submit"
                size="lg"
                icon="arrow"
                loading={status === "loading"}
                className="w-full"
                magnetic={false}
              >
                {status === "loading" ? "Updating" : "Update password"}
              </Button>
            </form>

            <p className="mt-8 text-center text-[0.86rem] text-white/45">
              <Link href="/login" className="text-brand-300 transition hover:text-brand-200">
                Back to sign in
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}
