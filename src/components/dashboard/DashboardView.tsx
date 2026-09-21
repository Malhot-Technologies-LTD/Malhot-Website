"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Icon, type IconName } from "@/components/brand/Icon";
import { Logo } from "@/components/brand/Logo";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Aurora, Counter } from "@/components/ui/Atmosphere";
import { EASE } from "@/lib/motion";
import { cn, formatDate, initials } from "@/lib/utils";

type RequestItem = {
  id: number;
  reference: string;
  title: string;
  description: string;
  status: string;
  budget: string;
  timeline: string;
  projectTypes: string[];
  createdAt: string;
};

type MessageItem = {
  id: number;
  subject: string | null;
  message: string;
  createdAt: string;
};

type Props = {
  user: { name: string; email: string; company: string | null; memberSince: string };
  requests: RequestItem[];
  messages: MessageItem[];
};

const tabs: { id: string; label: string; icon: IconName }[] = [
  { id: "overview", label: "Dashboard", icon: "grid" },
  { id: "projects", label: "My projects", icon: "layers" },
  { id: "messages", label: "Messages", icon: "message" },
  { id: "profile", label: "Profile", icon: "user" },
];

const statusStyles: Record<string, string> = {
  new: "border-brand-400/40 bg-brand-500/12 text-brand-100",
  "in-progress": "border-amber-300/30 bg-amber-400/10 text-amber-100",
  completed: "border-emerald-300/30 bg-emerald-400/10 text-emerald-100",
};

function statusLabel(status: string) {
  if (status === "new") return "In review";
  if (status === "in-progress") return "In progress";
  if (status === "completed") return "Completed";
  return status;
}

export function DashboardView({ user, requests, messages }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState("overview");
  const [loggingOut, setLoggingOut] = useState(false);

  const inProgress = requests.filter((r) => r.status === "in-progress").length;
  const completed = requests.filter((r) => r.status === "completed").length;

  const logout = async () => {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="relative min-h-screen bg-ink">
      <Aurora intensity={0.7} />
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-noise opacity-20" />

      <div className="relative mx-auto flex w-full max-w-[96rem] flex-col gap-6 px-4 py-6 lg:flex-row lg:px-8 lg:py-8">
        {/* sidebar */}
        <aside className="lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)] lg:w-[16.5rem] lg:shrink-0">
          <div className="flex h-full flex-col rounded-[1.4rem] border border-white/8 bg-[#070d1d]/85 p-5 backdrop-blur-xl">
            <Link href="/" className="px-1">
              <Logo markClassName="h-7 w-7" />
            </Link>

            <nav className="mt-8 flex gap-2 overflow-x-auto lg:mt-10 lg:flex-col lg:overflow-visible">
              {tabs.map((item) => {
                const active = tab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    className={cn(
                      "group relative flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-3 text-[0.86rem] transition-colors duration-300",
                      active ? "text-white" : "text-white/50 hover:text-white/85",
                    )}
                  >
                    {active ? (
                      <motion.span
                        layoutId="dash-active"
                        className="absolute inset-0 rounded-xl border border-brand-400/35 bg-brand-500/12"
                        transition={{ duration: 0.45, ease: EASE.swift }}
                      />
                    ) : null}
                    <Icon name={item.icon} className="relative h-4 w-4" />
                    <span className="relative whitespace-nowrap">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto hidden pt-8 lg:block">
              <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                <p className="text-[0.75rem] text-white/45">Need something built?</p>
                <div className="mt-3">
                  <ButtonLink href="/start" size="sm" icon="arrowUpRight" className="w-full" magnetic={false}>
                    New brief
                  </ButtonLink>
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                disabled={loggingOut}
                className="mt-4 flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-[0.86rem] text-white/45 transition hover:bg-white/[0.04] hover:text-white disabled:opacity-50"
              >
                <Icon name="logout" className="h-4 w-4" />
                {loggingOut ? "Signing out…" : "Log out"}
              </button>
            </div>
          </div>
        </aside>

        {/* content */}
        <main className="min-w-0 flex-1">
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-[1.4rem] border border-white/8 bg-[#070d1d]/85 px-5 py-4 backdrop-blur-xl">
            <div className="min-w-0">
              <p className="truncate text-[0.78rem] text-white/40">{greeting},</p>
              <p className="display truncate text-[1.25rem] text-white">{user.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <ButtonLink href="/start" size="sm" icon="arrowUpRight" className="hidden sm:inline-flex">
                Start a project
              </ButtonLink>
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] py-1.5 pl-1.5 pr-4">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-[0.72rem] font-semibold text-white">
                  {initials(user.name)}
                </span>
                <span className="hidden text-[0.78rem] text-white/60 sm:block">{user.email}</span>
              </div>
              <button
                type="button"
                onClick={logout}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/45 transition hover:border-rose-300/40 hover:text-rose-200 lg:hidden"
                aria-label="Log out"
              >
                <Icon name="logout" className="h-4 w-4" />
              </button>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
              transition={{ duration: 0.45, ease: EASE.swift }}
              className="mt-6"
            >
              {tab === "overview" ? (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      { label: "Total briefs", value: requests.length, icon: "layers" as IconName },
                      { label: "In progress", value: inProgress, icon: "spark" as IconName },
                      { label: "Completed", value: completed, icon: "check" as IconName },
                    ].map((card, index) => (
                      <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: EASE.soft, delay: index * 0.07 }}
                        className="group relative overflow-hidden rounded-[1.2rem] border border-white/8 bg-[#070d1d] p-5 transition-all duration-500 hover:border-brand-400/35"
                      >
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                          style={{
                            background:
                              "radial-gradient(80% 60% at 20% 0%, rgba(43,108,255,0.16), transparent 70%)",
                          }}
                        />
                        <div className="relative flex items-center justify-between">
                          <span className="text-[0.74rem] uppercase tracking-[0.18em] text-white/35">
                            {card.label}
                          </span>
                          <span className="grid h-9 w-9 place-items-center rounded-lg border border-brand-400/25 bg-brand-500/10 text-brand-200">
                            <Icon name={card.icon} className="h-4 w-4" />
                          </span>
                        </div>
                        <p className="display relative mt-5 text-[2.2rem] text-white">
                          <Counter value={card.value} duration={1.2} />
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  <section className="rounded-[1.4rem] border border-white/8 bg-[#070d1d] p-6">
                    <div className="flex items-center justify-between">
                      <h2 className="display text-[1.15rem] text-white">Recent briefs</h2>
                      <button
                        type="button"
                        onClick={() => setTab("projects")}
                        className="text-[0.8rem] text-brand-300 transition hover:text-brand-200"
                      >
                        View all
                      </button>
                    </div>
                    <div className="mt-5">
                      <RequestList requests={requests.slice(0, 4)} />
                    </div>
                  </section>
                </div>
              ) : null}

              {tab === "projects" ? (
                <section className="rounded-[1.4rem] border border-white/8 bg-[#070d1d] p-6">
                  <h2 className="display text-[1.15rem] text-white">My projects</h2>
                  <p className="mt-1.5 text-[0.85rem] text-white/40">
                    Every brief you have submitted to MALHOT.
                  </p>
                  <div className="mt-6">
                    <RequestList requests={requests} />
                  </div>
                </section>
              ) : null}

              {tab === "messages" ? (
                <section className="rounded-[1.4rem] border border-white/8 bg-[#070d1d] p-6">
                  <h2 className="display text-[1.15rem] text-white">Messages</h2>
                  <p className="mt-1.5 text-[0.85rem] text-white/40">
                    Enquiries you have sent through the contact form.
                  </p>
                  <div className="mt-6 space-y-3">
                    {messages.length === 0 ? (
                      <EmptyState
                        icon="message"
                        title="No messages yet"
                        copy="Anything you send through the contact form will appear here."
                        action={{ href: "/contact", label: "Send a message" }}
                      />
                    ) : (
                      messages.map((message, index) => (
                        <motion.article
                          key={message.id}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.45, ease: EASE.soft, delay: index * 0.05 }}
                          className="rounded-xl border border-white/8 bg-white/[0.02] p-5 transition-colors duration-500 hover:border-brand-400/30"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <p className="truncate text-[0.95rem] text-white">
                              {message.subject || "General enquiry"}
                            </p>
                            <span className="shrink-0 font-mono text-[0.7rem] text-white/30">
                              {formatDate(message.createdAt)}
                            </span>
                          </div>
                          <p className="mt-2 line-clamp-3 text-[0.86rem] leading-relaxed text-white/45">
                            {message.message}
                          </p>
                        </motion.article>
                      ))
                    )}
                  </div>
                </section>
              ) : null}

              {tab === "profile" ? (
                <section className="rounded-[1.4rem] border border-white/8 bg-[#070d1d] p-6">
                  <h2 className="display text-[1.15rem] text-white">Profile</h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {[
                      { label: "Full name", value: user.name },
                      { label: "Email", value: user.email },
                      { label: "Company", value: user.company || "—" },
                      { label: "Member since", value: formatDate(user.memberSince) },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="rounded-xl border border-white/8 bg-white/[0.02] px-5 py-4"
                      >
                        <p className="text-[0.72rem] uppercase tracking-[0.18em] text-white/35">
                          {row.label}
                        </p>
                        <p className="mt-2 truncate text-[0.95rem] text-white">{row.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <ButtonLink href="/start" icon="arrowUpRight">
                      Start a new project
                    </ButtonLink>
                    <Button variant="outline" onClick={logout} loading={loggingOut} icon="logout" iconPosition="left">
                      Log out
                    </Button>
                  </div>
                </section>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function RequestList({ requests }: { requests: RequestItem[] }) {
  if (requests.length === 0) {
    return (
      <EmptyState
        icon="layers"
        title="No briefs yet"
        copy="Start a project and we will place it here so you can follow every milestone."
        action={{ href: "/start", label: "Start a project" }}
      />
    );
  }

  return (
    <ul className="space-y-3">
      {requests.map((request, index) => (
        <motion.li
          key={request.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE.soft, delay: index * 0.05 }}
          className="group flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/8 bg-white/[0.02] p-4 transition-all duration-500 hover:border-brand-400/35 hover:bg-white/[0.04]"
        >
          <div className="flex min-w-0 items-center gap-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-brand-400/25 bg-brand-500/10 text-brand-200">
              <Icon name="layers" className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[0.95rem] text-white">{request.title}</p>
              <p className="mt-0.5 truncate text-[0.78rem] text-white/40">
                {request.reference} · {request.budget} · {formatDate(request.createdAt)}
              </p>
            </div>
          </div>
          <span
            className={cn(
              "rounded-full border px-3 py-1 text-[0.7rem]",
              statusStyles[request.status] ?? statusStyles.new,
            )}
          >
            {statusLabel(request.status)}
          </span>
        </motion.li>
      ))}
    </ul>
  );
}

function EmptyState({
  icon,
  title,
  copy,
  action,
}: {
  icon: IconName;
  title: string;
  copy: string;
  action: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col items-center rounded-[1.2rem] border border-dashed border-white/12 bg-white/[0.015] px-6 py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/40">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <p className="display mt-5 text-[1.15rem] text-white">{title}</p>
      <p className="mt-2 max-w-sm text-[0.86rem] text-white/45">{copy}</p>
      <div className="mt-6">
        <ButtonLink href={action.href} size="sm" icon="arrow" magnetic={false}>
          {action.label}
        </ButtonLink>
      </div>
    </div>
  );
}
