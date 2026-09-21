"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AuthShell, SocialAuthRow } from "@/components/auth/AuthShell";
import { Icon } from "@/components/brand/Icon";
import { Button } from "@/components/ui/Button";
import { Checkbox, FormStatus, TextField } from "@/components/ui/Field";
import { EASE } from "@/lib/motion";
import { isEmail } from "@/lib/utils";
import { media } from "@/content/site";

type Errors = Partial<Record<"name" | "email" | "password" | "confirm" | "terms", string>>;

function strengthOf(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return Math.min(score, 4);
}

const strengthLabels = ["Too short", "Weak", "Fair", "Strong", "Excellent"];

export function SignupView() {
  const router = useRouter();
  const [values, setValues] = useState({
    name: "",
    email: "",
    company: "",
    password: "",
    confirm: "",
  });
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");

  const strength = useMemo(() => strengthOf(values.password), [values.password]);

  const update = (key: keyof typeof values) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [key]: event.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next: Errors = {};
    if (values.name.trim().length < 2) next.name = "Enter your full name";
    if (!isEmail(values.email)) next.email = "Enter a valid email address";
    if (values.password.length < 8) next.password = "Use at least 8 characters";
    if (values.confirm !== values.password) next.confirm = "Passwords do not match";
    if (!terms) next.terms = "Please accept the terms to continue";
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error ?? "We could not create your account");

      setStatus("success");
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 950);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Signup failed");
    }
  };

  return (
    <AuthShell
      align="left"
      image={media.gridPoster}
      badge="More than just technology"
      visualTitle="We build ideas, brands and opportunities."
      visualCopy="Create your account to brief projects, follow progress and keep every deliverable in one place."
    >
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: EASE.soft }}
            className="flex min-h-[24rem] flex-col items-center justify-center text-center"
          >
            <span className="grid h-20 w-20 place-items-center rounded-full border border-brand-400/40 bg-brand-500/15 text-brand-200 shadow-[0_0_60px_-15px_rgba(43,108,255,1)]">
              <Icon name="check" className="h-8 w-8" strokeWidth={2.2} />
            </span>
            <h1 className="display mt-7 text-[1.6rem] text-white">Account created</h1>
            <p className="mt-2 text-[0.88rem] text-white/45">
              Welcome to MALHOT, {values.name.split(" ")[0]}. Preparing your workspace…
            </p>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h1 className="display text-[clamp(1.9rem,4vw,2.5rem)] text-white">Create account</h1>
            <p className="mt-3 text-[0.92rem] text-white/45">
              Join MALHOT and start building your future.
            </p>

            <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
              <FormStatus status={status === "error" ? "error" : "idle"} message={message} />

              <TextField
                label="Full name"
                placeholder="John Doe"
                value={values.name}
                onChange={update("name")}
                error={errors.name}
                autoComplete="name"
              />
              <TextField
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={values.email}
                onChange={update("email")}
                error={errors.email}
                autoComplete="email"
              />
              <TextField
                label="Company"
                hint="optional"
                placeholder="Company or team"
                value={values.company}
                onChange={update("company")}
                autoComplete="organization"
              />

              <div>
                <TextField
                  label="Password"
                  type="password"
                  placeholder="••••••••••"
                  value={values.password}
                  onChange={update("password")}
                  error={errors.password}
                  autoComplete="new-password"
                />
                {values.password ? (
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex flex-1 gap-1.5">
                      {[0, 1, 2, 3].map((i) => (
                        <motion.span
                          key={i}
                          animate={{
                            backgroundColor:
                              i < strength ? "rgb(43 108 255)" : "rgba(255,255,255,0.12)",
                          }}
                          transition={{ duration: 0.35 }}
                          className="h-1 flex-1 rounded-full"
                        />
                      ))}
                    </div>
                    <span className="text-[0.7rem] text-white/40">{strengthLabels[strength]}</span>
                  </div>
                ) : null}
              </div>

              <TextField
                label="Confirm password"
                type="password"
                placeholder="••••••••••"
                value={values.confirm}
                onChange={update("confirm")}
                error={errors.confirm}
                autoComplete="new-password"
              />

              <div>
                <Checkbox
                  checked={terms}
                  onChange={(value) => {
                    setTerms(value);
                    setErrors((p) => ({ ...p, terms: undefined }));
                  }}
                  label={
                    <span>
                      I agree to the{" "}
                      <span className="text-brand-300">Terms &amp; Conditions</span>
                    </span>
                  }
                />
                {errors.terms ? (
                  <p className="mt-2 text-[0.75rem] text-rose-300">{errors.terms}</p>
                ) : null}
              </div>

              <Button
                type="submit"
                size="lg"
                icon="arrow"
                loading={status === "loading"}
                className="w-full"
                magnetic={false}
              >
                {status === "loading" ? "Creating account" : "Create account"}
              </Button>
            </form>

            <SocialAuthRow
              onNotice={() => {
                setStatus("error");
                setMessage("Google sign-up is arriving soon — use your email for now.");
              }}
            />

            <p className="mt-8 text-center text-[0.86rem] text-white/45">
              Already have an account?{" "}
              <Link href="/login" className="text-brand-300 transition hover:text-brand-200">
                Sign in
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}
