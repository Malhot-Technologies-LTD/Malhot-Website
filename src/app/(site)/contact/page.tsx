import type { Metadata } from "next";
import { Icon } from "@/components/brand/Icon";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm } from "@/components/sections/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { media, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to MALHOT about your next digital product. Based in Kigali, working worldwide.",
};

const channels = [
  { icon: "mail" as const, label: "Email", value: site.email, href: `mailto:${site.email}` },
  { icon: "phone" as const, label: "Phone", value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
  { icon: "pin" as const, label: "Studio", value: site.location, href: null },
  { icon: "spark" as const, label: "Hours", value: "Mon – Fri · 08:00 – 18:00 CAT", href: null },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="We'd love to hear from you."
        highlight="you."
        copy="Whether you have a fully scoped brief or a rough idea on a napkin, we will tell you honestly what it takes to build it."
        video={media.heroVideo}
        poster={media.heroPoster}
      />

      <section className="relative pb-24 pt-4 sm:pb-32">
        <div className="shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="flex flex-col gap-5">
            {channels.map((channel, index) => (
              <Reveal key={channel.label} delay={index * 0.07}>
                <div className="group flex items-center gap-4 rounded-[1.2rem] border border-white/8 bg-[#070d1d] px-6 py-5 transition-all duration-600 hover:-translate-y-0.5 hover:border-brand-400/40">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-brand-400/30 bg-brand-500/12 text-brand-200 transition-transform duration-500 group-hover:scale-105">
                    <Icon name={channel.icon} className="h-4.5 w-4.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[0.7rem] uppercase tracking-[0.2em] text-white/35">
                      {channel.label}
                    </p>
                    {channel.href ? (
                      <a
                        href={channel.href}
                        className="mt-1 block truncate text-[0.95rem] text-white transition hover:text-brand-200"
                      >
                        {channel.value}
                      </a>
                    ) : (
                      <p className="mt-1 truncate text-[0.95rem] text-white">{channel.value}</p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}

            <Reveal delay={0.3}>
              <div className="relative overflow-hidden rounded-[1.4rem] border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={media.night}
                  alt="Kigali at night"
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover opacity-55"
                />
                <div className="absolute inset-0 bg-[linear-gradient(190deg,rgba(43,108,255,0.14),rgba(4,7,15,0.9))]" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-[0.72rem] uppercase tracking-[0.22em] text-brand-200">
                    Studio
                  </p>
                  <p className="display mt-2 text-[1.4rem] text-white">{site.location}</p>
                  <p className="mt-1 text-[0.8rem] text-white/45">{site.timezone}</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.36}>
              <div className="flex items-center gap-2.5">
                {site.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/55 transition-all duration-500 hover:-translate-y-0.5 hover:border-brand-400/60 hover:bg-brand-500/12 hover:text-white"
                  >
                    <Icon name={social.icon} className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
