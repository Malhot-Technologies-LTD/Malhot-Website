"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AuthShell, SocialAuthRow } from "@/components/auth/AuthShell";
import { Icon } from "@/components/brand/Icon";
import { Button } from "@/components/ui/Button";
import { Checkbox, FormStatus, TextField } from "@/components/ui/Field";
import { EASE } from "@/lib/motion";
import { isEmail } from "@/lib/utils";

export function LoginView() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!isEmail(email)) nextErrors.email = "Enter a valid email address";
    if (password.length < 1) nextErrors.password = "Enter your password";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error ?? "Sign in failed");

      setStatus("success");
      setMessage(`Welcome back, ${String(data.name).split(" ")[0]}.`);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 850);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Sign in failed");
    }
  };

  return (
    <AuthShell
      badge="Client workspace"
      visualTitle="Build your dreams with us."
      visualCopy="Track every project, milestone and conversation with MALHOT in one calm workspace. Innovation today, success tomorrow."
    >
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: EASE.soft }}
            className="flex min-h-[24rem] flex-col items-center justify-center text-center"
          >
            <span className="grid h-20 w-20 place-items-center rounded-full border border-brand-400/40 bg-brand-500/15 text-brand-200 shadow-[0_0_60px_-15px_rgba(43,108,255,1)]">
              <Icon name="check" className="h-8 w-8" strokeWidth={2.2} />
            </span>
            <h1 className="display mt-7 text-[1.6rem] text-white">{message}</h1>
            <p className="mt-2 text-[0.88rem] text-white/45">Opening your workspace…</p>
            <div className="mt-8 h-px w-40 overflow-hidden bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-brand-500 to-white"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.85, ease: "linear" }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h1 className="display text-[clamp(1.9rem,4vw,2.5rem)] text-white">Welcome back</h1>
            <p className="mt-3 text-[0.92rem] text-white/45">
              Please enter your details to sign in to your MALHOT workspace.
            </p>

            <form onSubmit={submit} className="mt-9 space-y-5" noValidate>
              <FormStatus status={status === "error" ? "error" : "idle"} message={message} />

              <TextField
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                autoComplete="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((p) => ({ ...p, email: undefined }));
                }}
                error={errors.email}
              />
              <TextField
                label="Password"
                type="password"
                placeholder="••••••••••"
                value={password}
                autoComplete="current-password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((p) => ({ ...p, password: undefined }));
                }}
                error={errors.password}
              />

              <div className="flex items-center justify-between pt-1">
                <Checkbox label="Remember me" checked={remember} onChange={setRemember} />
                <Link
                  href="/forgot-password"
                  className="text-[0.82rem] text-brand-300 transition hover:text-brand-200"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                size="lg"
                icon="arrow"
                loading={status === "loading"}
                className="w-full"
                magnetic={false}
              >
                {status === "loading" ? "Signing in" : "Sign in"}
              </Button>
            </form>

            <SocialAuthRow
              onNotice={() => {
                setStatus("error");
                setMessage("Google sign-in is arriving soon — use your email for now.");
              }}
            />

            <p className="mt-8 text-center text-[0.86rem] text-white/45">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-brand-300 transition hover:text-brand-200">
                Sign up
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}
