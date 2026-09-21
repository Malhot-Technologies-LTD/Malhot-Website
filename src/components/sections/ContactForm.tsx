"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "@/components/brand/Icon";
import { Button, ButtonLink } from "@/components/ui/Button";
import { FormStatus, TextArea, TextField } from "@/components/ui/Field";
import { EASE } from "@/lib/motion";
import { isEmail } from "@/lib/utils";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

export function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [feedback, setFeedback] = useState("");

  const update = (key: keyof typeof values) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((prev) => ({ ...prev, [key]: event.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next: Errors = {};
    if (values.name.trim().length < 2) next.name = "Please tell us your name";
    if (!isEmail(values.email)) next.email = "Enter a valid email address";
    if (values.message.trim().length < 12) next.message = "A little more detail helps us reply properly";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setFeedback("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error ?? "Something went wrong");
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#070d1d] p-7 sm:p-9">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full blur-[90px]"
        style={{ background: "radial-gradient(circle, rgba(43,108,255,0.22), transparent 70%)" }}
      />

      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE.soft }}
            className="relative flex min-h-[26rem] flex-col items-center justify-center text-center"
          >
            <motion.span
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: EASE.soft, delay: 0.08 }}
              className="grid h-20 w-20 place-items-center rounded-full border border-brand-400/40 bg-brand-500/15 text-brand-200 shadow-[0_0_60px_-15px_rgba(43,108,255,1)]"
            >
              <Icon name="check" className="h-8 w-8" strokeWidth={2.2} />
            </motion.span>
            <h3 className="display mt-7 text-[1.7rem] text-white">Message received</h3>
            <p className="mt-3 max-w-sm text-[0.92rem] leading-relaxed text-white/50">
              Thank you, {values.name.split(" ")[0] || "friend"}. A human from MALHOT will reply
              within one business day.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/start" icon="arrowUpRight">
                Start a project
              </ButtonLink>
              <Button
                variant="outline"
                onClick={() => {
                  setValues({ name: "", email: "", subject: "", message: "" });
                  setStatus("idle");
                }}
              >
                Send another
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={submit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative space-y-5"
            noValidate
          >
            <div>
              <h2 className="display text-[1.5rem] text-white">Send us a message</h2>
              <p className="mt-2 text-[0.88rem] text-white/45">
                Tell us what you are working on. We reply to everything.
              </p>
            </div>

            <FormStatus status={status === "error" ? "error" : "idle"} message={feedback} />

            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                label="Your name"
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
            </div>

            <TextField
              label="Subject"
              hint="optional"
              placeholder="New website for our company"
              value={values.subject}
              onChange={update("subject")}
            />

            <TextArea
              label="Message"
              placeholder="How can we help you?"
              value={values.message}
              onChange={update("message")}
              error={errors.message}
            />

            <Button type="submit" size="lg" icon="arrow" loading={status === "loading"} className="w-full">
              {status === "loading" ? "Sending" : "Send message"}
            </Button>
            <p className="text-center text-[0.72rem] text-white/30">
              By sending this message you agree to be contacted about your enquiry.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
