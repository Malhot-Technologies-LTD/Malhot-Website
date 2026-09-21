"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Icon } from "@/components/brand/Icon";
import { Button, ButtonLink } from "@/components/ui/Button";
import { FormStatus, TextField } from "@/components/ui/Field";
import { EASE } from "@/lib/motion";
import { isEmail } from "@/lib/utils";
import { media } from "@/content/site";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "sent">("idle");
  const [message, setMessage] = useState("");
  const [resetHref, setResetHref] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isEmail(email)) {
      setError("Enter a valid email address");
      return;
    }
    setError(undefined);
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error ?? "Something went wrong");
      setResetHref(data?.token ? `/reset-password?token=${data.token}` : null);
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <AuthShell
      align="left"
      image={media.flowPoster}
      badge="Account recovery"
      visualTitle="Reset. Rebuild. Move forward."
      visualCopy="It happens to everyone. We will get you back into your MALHOT workspace in under a minute."
    >
      <AnimatePresence mode="wait">
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE.soft }}
            className="flex min-h-[22rem] flex-col justify-center"
          >
            <span className="grid h-16 w-16 place-items-center rounded-2xl border border-brand-400/40 bg-brand-500/12 text-brand-200">
              <Icon name="mail" className="h-7 w-7" />
            </span>
            <h1 className="display mt-7 text-[1.8rem] text-white">Check your inbox</h1>
            <p className="mt-3 text-[0.92rem] leading-relaxed text-white/50">
              If an account exists for <span className="text-white">{email}</span>, we have sent
              reset instructions. The link expires in 30 minutes.
            </p>

            {resetHref ? (
              <div className="mt-7 rounded-2xl border border-brand-400/25 bg-brand-500/8 p-5">
                <p className="text-[0.72rem] uppercase tracking-[0.2em] text-brand-200">
                  Demo environment
                </p>
                <p className="mt-2 text-[0.85rem] text-white/55">
                  Email delivery is not configured here, so you can continue directly.
                </p>
                <div className="mt-4">
                  <ButtonLink href={resetHref} size="sm" icon="arrow">
                    Open reset link
                  </ButtonLink>
                </div>
              </div>
            ) : null}

            <div className="mt-8 flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                magnetic={false}
                onClick={() => {
                  setStatus("idle");
                  setResetHref(null);
                }}
              >
                Use another email
              </Button>
              <Link href="/login" className="text-[0.85rem] text-brand-300 transition hover:text-brand-200">
                Back to sign in
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h1 className="display text-[clamp(1.9rem,4vw,2.5rem)] text-white">Forgot password?</h1>
            <p className="mt-3 text-[0.92rem] text-white/45">
              No worries. Enter your email and we will send reset instructions.
            </p>

            <form onSubmit={submit} className="mt-9 space-y-5" noValidate>
              <FormStatus status={status === "error" ? "error" : "idle"} message={message} />
              <TextField
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(undefined);
                }}
                error={error}
                autoComplete="email"
              />
              <Button
                type="submit"
                size="lg"
                icon="arrow"
                loading={status === "loading"}
                className="w-full"
                magnetic={false}
              >
                {status === "loading" ? "Sending" : "Send reset link"}
              </Button>
            </form>

            <p className="mt-8 text-center text-[0.86rem] text-white/45">
              Remembered it?{" "}
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
