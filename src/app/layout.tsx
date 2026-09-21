import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Sora } from "next/font/google";
import { Preloader } from "@/components/providers/Preloader";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { ScrollProgress } from "@/components/ui/Atmosphere";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MALHOT — Turning ideas into powerful digital solutions",
    template: "%s · MALHOT",
  },
  description:
    "MALHOT is a digital product studio building modern websites, powerful applications and smart digital solutions that help businesses grow.",
  keywords: [
    "MALHOT",
    "digital product studio",
    "web development",
    "mobile apps",
    "UI UX design",
    "Kigali",
  ],
  openGraph: {
    title: "MALHOT — Build · Innovate · Grow",
    description:
      "A digital product studio turning ambitious ideas into fast, beautiful and reliable software.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#04070f",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="relative min-h-screen bg-ink font-sans text-white antialiased">
        <Preloader />
        <ScrollProgress />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
