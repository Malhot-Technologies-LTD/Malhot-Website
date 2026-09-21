"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "@/components/brand/Icon";
import { LogoMark } from "@/components/brand/Logo";
import { Button, ButtonLink } from "@/components/ui/Button";
import { FormStatus, TextArea, TextField } from "@/components/ui/Field";
import { Aurora } from "@/components/ui/Atmosphere";
import {
  budgetOptions,
  needOptions,
  timelineOptions,
  typeOptions,
} from "@/content/site";
import { EASE } from "@/lib/motion";
import { cn, isEmail } from "@/lib/utils";

type FormState = {
  need: string;
  projectTypes: string[];
  title: string;
  description: string;
  budget: string;
  timeline: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  company: string;
};

const STORAGE_KEY = "malhot:project-brief";

const steps = [
  { id: 0, label: "What do you need?", hint: "Select what you're looking for" },
  { id: 1, label: "Project type", hint: "Pick everything that applies" },
  { id: 2, label: "Project details", hint: "Give us the shape of the work" },
  { id: 3, label: "Budget & timeline", hint: "Helps us scope realistically" },
  { id: 4, label: "Contact information", hint: "Where should we reply?" },
  { id: 5, label: "Review & submit", hint: "One last look" },
];

export function StartFlow({
  defaults,
  signedIn,
}: {
  defaults: Pick<FormState, "contactName" | "contactEmail" | "company">;
  signedIn: boolean;
}) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState<FormState>({
    need: "",
    projectTypes: [],
    title: "",
    description: "",
    budget: "",
    timeline: "",
    contactPhone: "",
    ...defaults,
  });
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [reference, setReference] = useState("");

  const progress = ((step + (status === "success" ? 1 : 0)) / steps.length) * 100;

  // "Save & continue later" is real: the brief survives a reload.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved) as { form?: Partial<FormState>; step?: number };
      const draft = parsed.form;
      if (draft) {
        setForm((prev) => ({
          ...prev,
          ...draft,
          contactName: draft.contactName || prev.contactName,
          contactEmail: draft.contactEmail || prev.contactEmail,
        }));
      }
      if (typeof parsed.step === "number") {
        setStep(Math.max(0, Math.min(steps.length - 1, parsed.step)));
      }
    } catch {
      /* ignore malformed drafts */
    }
  }, []);

  useEffect(() => {
    if (status === "success") {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    const id = window.setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ form, step }));
      } catch {
        /* storage unavailable */
      }
    }, 400);
    return () => window.clearTimeout(id);
  }, [form, step, status]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  const toggleType = (value: string) => {
    setForm((prev) => ({
      ...prev,
      projectTypes: prev.projectTypes.includes(value)
        ? prev.projectTypes.filter((item) => item !== value)
        : [...prev.projectTypes, value],
    }));
    setError("");
  };

  const validateStep = (index: number) => {
    switch (index) {
      case 0:
        if (!form.need) return "Choose the option that fits best.";
        return "";
      case 1:
        if (form.projectTypes.length === 0) return "Select at least one project type.";
        return "";
      case 2:
        if (form.title.trim().length < 3) return "Give your project a short name.";
        if (form.description.trim().length < 12) return "Tell us a little more about the goal.";
        return "";
      case 3:
        if (!form.budget) return "Select a budget range.";
        if (!form.timeline) return "Select a timeline.";
        return "";
      case 4:
        if (form.contactName.trim().length < 2) return "Please enter your name.";
        if (!isEmail(form.contactEmail)) return "Enter a valid email address.";
        return "";
      default:
        return "";
    }
  };

  const go = (next: number) => {
    if (next > step) {
      const message = validateStep(step);
      if (message) {
        setError(message);
        return;
      }
    }
    setDirection(next > step ? 1 : -1);
    setStep(Math.max(0, Math.min(steps.length - 1, next)));
    setError("");
  };

  const submit = async () => {
    for (let i = 0; i < steps.length - 1; i += 1) {
      const message = validateStep(i);
      if (message) {
        setDirection(-1);
        setStep(i);
        setError(message);
        return;
      }
    }

    setStatus("loading");
    setError("");
    try {
      const response = await fetch("/api/project-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error ?? "Submission failed");
      setReference(data.reference);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Submission failed");
    }
  };

  const summary = useMemo(
    () => [
      { label: "Need", value: needOptions.find((o) => o.value === form.need)?.label },
      {
        label: "Type",
        value: form.projectTypes
          .map((value) => typeOptions.find((o) => o.value === value)?.label)
          .filter(Boolean)
          .join(", "),
      },
      { label: "Project", value: form.title },
      { label: "Budget", value: budgetOptions.find((o) => o.value === form.budget)?.label },
      { label: "Timeline", value: timelineOptions.find((o) => o.value === form.timeline)?.label },
      { label: "Contact", value: form.contactEmail },
    ],
    [form],
  );

  if (status === "success") {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-32">
        <Aurora intensity={1.4} />
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.85, ease: EASE.soft }}
          className="relative w-full max-w-xl text-center"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE.soft, delay: 0.1 }}
            className="mx-auto grid h-24 w-24 place-items-center rounded-full border border-brand-400/40 bg-brand-500/12 shadow-[0_0_80px_-18px_rgba(43,108,255,1)]"
          >
            <LogoMark className="h-11 w-11" glow id="success" />
          </motion.div>
          <h1 className="display mt-9 text-[clamp(2rem,5vw,3rem)] text-white">Brief received</h1>
          <p className="mt-4 text-[0.98rem] leading-relaxed text-white/55">
            Thank you, {form.contactName.split(" ")[0]}. Your project is in our queue and a
            strategist will reply within one business day.
          </p>
          <div className="mx-auto mt-8 inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.04] px-5 py-3">
            <span className="text-[0.72rem] uppercase tracking-[0.2em] text-white/40">
              Reference
            </span>
            <span className="font-mono text-[0.95rem] text-brand-200">{reference}</span>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href={signedIn ? "/dashboard" : "/signup"} icon="arrowUpRight" size="lg">
              {signedIn ? "Open dashboard" : "Create an account to track it"}
            </ButtonLink>
            <ButtonLink href="/projects" variant="secondary" size="lg" icon="arrow">
              Explore our work
            </ButtonLink>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-clip pb-16 pt-28 sm:pt-32">
      <Aurora />
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-noise opacity-20" />

      <div className="shell relative grid gap-10 lg:grid-cols-[22rem_1fr] lg:gap-14">
        {/* process column */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <span className="eyebrow">
            <span className="h-[5px] w-[5px] rounded-full bg-brand-400 shadow-[0_0_12px_2px_rgba(43,108,255,0.8)]" />
            Start a project
          </span>
          <h1 className="display mt-5 text-[clamp(2rem,4.6vw,2.9rem)] text-white">
            Let&apos;s create <span className="text-gradient">something amazing</span>
          </h1>

          <div className="mt-8 h-[3px] w-full overflow-hidden rounded-full bg-white/8">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-brand-600 via-brand-400 to-brand-200"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: EASE.swift }}
            />
          </div>
          <p className="mt-3 text-[0.75rem] uppercase tracking-[0.2em] text-white/35">
            Step {step + 1} of {steps.length}
          </p>

          <ol className="mt-8 hidden space-y-1 lg:block">
            {steps.map((item, index) => {
              const done = index < step;
              const active = index === step;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => go(index)}
                    disabled={index > step}
                    className={cn(
                      "group flex w-full items-center gap-3.5 rounded-xl px-3 py-3 text-left transition-all duration-500",
                      active && "border border-brand-400/35 bg-brand-500/10",
                      !active && "border border-transparent hover:bg-white/[0.03]",
                      index > step && "cursor-not-allowed opacity-45",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[0.7rem] font-semibold transition-all duration-500",
                        done
                          ? "border-brand-400/60 bg-brand-500 text-white"
                          : active
                            ? "border-brand-400 bg-brand-500/20 text-brand-100"
                            : "border-white/15 text-white/40",
                      )}
                    >
                      {done ? <Icon name="check" className="h-3.5 w-3.5" strokeWidth={3} /> : index + 1}
                    </span>
                    <span className="min-w-0">
                      <span
                        className={cn(
                          "block truncate text-[0.88rem] transition-colors",
                          active ? "text-white" : "text-white/55",
                        )}
                      >
                        {item.label}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* live summary */}
          <div className="mt-8 rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <p className="text-[0.7rem] uppercase tracking-[0.2em] text-white/35">Your brief</p>
            <dl className="mt-4 space-y-3">
              {summary.map((row) => (
                <div key={row.label} className="flex items-start justify-between gap-4 text-[0.82rem]">
                  <dt className="shrink-0 text-white/35">{row.label}</dt>
                  <AnimatePresence mode="wait">
                    <motion.dd
                      key={row.value || "empty"}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "truncate text-right",
                        row.value ? "text-white/80" : "text-white/20",
                      )}
                    >
                      {row.value || "—"}
                    </motion.dd>
                  </AnimatePresence>
                </div>
              ))}
            </dl>
          </div>
        </aside>

        {/* step column */}
        <section className="relative">
          <div className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#070d1d]/85 p-6 backdrop-blur-xl sm:p-9">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full blur-[110px]"
              style={{ background: "radial-gradient(circle, rgba(43,108,255,0.2), transparent 70%)" }}
            />

            <div className="relative flex items-start justify-between gap-6">
              <div>
                <p className="font-mono text-[0.72rem] text-brand-300">
                  STEP {String(step + 1).padStart(2, "0")}
                </p>
                <h2 className="display mt-2.5 text-[clamp(1.4rem,3vw,2rem)] text-white">
                  {steps[step].label}
                </h2>
                <p className="mt-2 text-[0.88rem] text-white/45">{steps[step].hint}</p>
              </div>
              <div className="hidden gap-1.5 sm:flex">
                {steps.map((s, i) => (
                  <span
                    key={s.id}
                    className={cn(
                      "h-1 rounded-full transition-all duration-500",
                      i === step ? "w-7 bg-brand-400" : i < step ? "w-3 bg-brand-600" : "w-3 bg-white/15",
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="relative mt-8 min-h-[22rem]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 36, filter: "blur(8px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: direction * -36, filter: "blur(8px)" }}
                  transition={{ duration: 0.5, ease: EASE.swift }}
                >
                  {step === 0 ? (
                    <div className="grid gap-3">
                      {needOptions.map((option) => (
                        <OptionCard
                          key={option.value}
                          selected={form.need === option.value}
                          onClick={() => set("need", option.value)}
                          title={option.label}
                          hint={option.hint}
                        />
                      ))}
                    </div>
                  ) : null}

                  {step === 1 ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {typeOptions.map((option) => (
                        <OptionCard
                          key={option.value}
                          selected={form.projectTypes.includes(option.value)}
                          onClick={() => toggleType(option.value)}
                          title={option.label}
                          hint={option.hint}
                          icon={option.icon}
                          multi
                        />
                      ))}
                    </div>
                  ) : null}

                  {step === 2 ? (
                    <div className="space-y-5">
                      <TextField
                        label="Project name"
                        placeholder="e.g. Nexus Circle Pulse"
                        value={form.title}
                        onChange={(e) => set("title", e.target.value)}
                      />
                      <TextArea
                        label="What are you trying to achieve?"
                        placeholder="Describe the product, the users, the problem and anything that already exists."
                        value={form.description}
                        onChange={(e) => set("description", e.target.value)}
                      />
                      <p className="text-[0.76rem] text-white/30">
                        Tip: the sharper the goal, the sharper our first response.
                      </p>
                    </div>
                  ) : null}

                  {step === 3 ? (
                    <div className="space-y-8">
                      <div>
                        <p className="mb-3 text-[0.72rem] uppercase tracking-[0.2em] text-white/40">
                          Budget range
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {budgetOptions.map((option) => (
                            <OptionCard
                              key={option.value}
                              selected={form.budget === option.value}
                              onClick={() => set("budget", option.value)}
                              title={option.label}
                              compact
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="mb-3 text-[0.72rem] uppercase tracking-[0.2em] text-white/40">
                          Timeline
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {timelineOptions.map((option) => (
                            <OptionCard
                              key={option.value}
                              selected={form.timeline === option.value}
                              onClick={() => set("timeline", option.value)}
                              title={option.label}
                              compact
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {step === 4 ? (
                    <div className="grid gap-5 sm:grid-cols-2">
                      <TextField
                        label="Full name"
                        placeholder="John Doe"
                        value={form.contactName}
                        onChange={(e) => set("contactName", e.target.value)}
                        autoComplete="name"
                      />
                      <TextField
                        label="Email address"
                        type="email"
                        placeholder="you@example.com"
                        value={form.contactEmail}
                        onChange={(e) => set("contactEmail", e.target.value)}
                        autoComplete="email"
                      />
                      <TextField
                        label="Phone"
                        hint="optional"
                        placeholder="+250 788 000 000"
                        value={form.contactPhone}
                        onChange={(e) => set("contactPhone", e.target.value)}
                        autoComplete="tel"
                      />
                      <TextField
                        label="Company"
                        hint="optional"
                        placeholder="Company or team"
                        value={form.company}
                        onChange={(e) => set("company", e.target.value)}
                        autoComplete="organization"
                      />
                    </div>
                  ) : null}

                  {step === 5 ? (
                    <div className="space-y-4">
                      {summary.map((row, index) => (
                        <motion.div
                          key={row.label}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.45, ease: EASE.soft, delay: index * 0.06 }}
                          className="flex items-start justify-between gap-6 border-b border-white/8 pb-4"
                        >
                          <span className="text-[0.78rem] uppercase tracking-[0.16em] text-white/35">
                            {row.label}
                          </span>
                          <span className="max-w-[60%] text-right text-[0.9rem] text-white/80">
                            {row.value || "—"}
                          </span>
                        </motion.div>
                      ))}
                      <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                        <p className="text-[0.78rem] uppercase tracking-[0.16em] text-white/35">
                          Description
                        </p>
                        <p className="mt-2 text-[0.9rem] leading-relaxed text-white/65">
                          {form.description || "—"}
                        </p>
                      </div>
                      <p className="text-[0.76rem] text-white/30">
                        By submitting you agree that MALHOT may contact you about this enquiry.
                      </p>
                    </div>
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative mt-4">
              <FormStatus status={error ? "error" : "idle"} message={error} />
            </div>

            <div className="relative mt-7 flex items-center justify-between gap-4 border-t border-white/8 pt-6">
              <Button
                variant="ghost"
                size="md"
                magnetic={false}
                onClick={() => go(step - 1)}
                disabled={step === 0 || status === "loading"}
                icon="arrowLeft"
                iconPosition="left"
              >
                Back
              </Button>

              {step < steps.length - 1 ? (
                <Button size="lg" icon="arrow" onClick={() => go(step + 1)}>
                  Next step
                </Button>
              ) : (
                <Button size="lg" icon="arrowUpRight" loading={status === "loading"} onClick={submit}>
                  {status === "loading" ? "Submitting" : "Submit brief"}
                </Button>
              )}
            </div>
          </div>

          <p className="mt-6 text-center text-[0.8rem] text-white/35 lg:text-left">
            Prefer email?{" "}
            <Link href="/contact" className="text-brand-300 transition hover:text-brand-200">
              Contact us directly
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

function OptionCard({
  title,
  hint,
  selected,
  onClick,
  icon,
  multi = false,
  compact = false,
}: {
  title: string;
  hint?: string;
  selected: boolean;
  onClick: () => void;
  icon?: "code" | "mobile" | "design" | "brand" | "growth" | "consulting";
  multi?: boolean;
  compact?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.985 }}
      className={cn(
        "group relative flex w-full items-center gap-4 overflow-hidden rounded-xl border px-4 text-left transition-all duration-500",
        compact ? "py-3.5" : "py-4",
        selected
          ? "border-brand-400/70 bg-brand-500/12 shadow-[0_18px_50px_-30px_rgba(43,108,255,1)]"
          : "border-white/10 bg-white/[0.025] hover:border-white/25 hover:bg-white/[0.05]",
      )}
    >
      {selected ? (
        <motion.span
          layoutId={undefined}
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_100%_at_0%_50%,rgba(43,108,255,0.18),transparent_70%)]"
        />
      ) : null}

      {icon ? (
        <span
          className={cn(
            "relative grid h-10 w-10 shrink-0 place-items-center rounded-lg border transition-all duration-500",
            selected
              ? "border-brand-400/60 bg-brand-500/20 text-brand-100"
              : "border-white/10 bg-white/[0.03] text-white/45",
          )}
        >
          <Icon name={icon} className="h-4.5 w-4.5" />
        </span>
      ) : null}

      <span className="relative min-w-0 flex-1">
        <span className={cn("block text-[0.95rem]", selected ? "text-white" : "text-white/80")}>
          {title}
        </span>
        {hint ? (
          <span className="mt-1 block truncate text-[0.78rem] text-white/40">{hint}</span>
        ) : null}
      </span>

      <span
        className={cn(
          "relative grid h-6 w-6 shrink-0 place-items-center transition-all duration-500",
          multi ? "rounded-md" : "rounded-full",
          selected
            ? "border border-brand-400 bg-brand-500 text-white"
            : "border border-white/18 text-transparent",
        )}
      >
        <AnimatePresence>
          {selected ? (
            <motion.span
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <Icon name="check" className="h-3.5 w-3.5" strokeWidth={3} />
            </motion.span>
          ) : null}
        </AnimatePresence>
      </span>
    </motion.button>
  );
}
