"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const reduced = useReducedMotion();

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 220, damping: 26, mass: 0.35 });
  const ringY = useSpring(y, { stiffness: 220, damping: 26, mass: 0.35 });
  const dotX = useSpring(x, { stiffness: 900, damping: 40, mass: 0.2 });
  const dotY = useSpring(y, { stiffness: 900, damping: 40, mass: 0.2 });

  useEffect(() => {
    if (reduced) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    const enable = requestAnimationFrame(() => setEnabled(true));

    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target as HTMLElement | null;
      setHovering(Boolean(target?.closest('a, button, [data-cursor="link"], input, textarea')));
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      cancelAnimationFrame(enable);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [x, y, reduced]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[110] hidden md:block">
      <motion.div
        className="absolute -left-5 -top-5 h-10 w-10 rounded-full border border-brand-300/45"
        style={{ x: ringX, y: ringY }}
        animate={{
          scale: pressed ? 0.78 : hovering ? 1.55 : 1,
          borderColor: hovering ? "rgba(120,167,255,0.85)" : "rgba(120,167,255,0.35)",
          backgroundColor: hovering ? "rgba(43,108,255,0.10)" : "rgba(43,108,255,0)",
        }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 rounded-full bg-brand-200"
        style={{ x: dotX, y: dotY }}
        animate={{ scale: hovering ? 0 : 1, opacity: hovering ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
}
