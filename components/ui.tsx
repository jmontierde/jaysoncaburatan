"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { buttonStyles } from "@/lib/styles";

export { buttonStyles };

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return <div className={cn("reveal", className)}>{children}</div>;
}

export function Magnetic({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.35 });
  const reduce = useReducedMotion();

  function onMove(event: MouseEvent<HTMLDivElement>) {
    if (reduce || !ref.current) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const bounds = ref.current.getBoundingClientRect();
    x.set((event.clientX - (bounds.left + bounds.width / 2)) * 0.25);
    y.set((event.clientY - (bounds.top + bounds.height / 2)) * 0.25);
  }

  return (
    <motion.div
      ref={ref}
      className={cn("inline-flex", className)}
      style={{ x: springX, y: springY }}
      onMouseMove={onMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

export function SectionLabel({
  index,
  children,
}: {
  index: string;
  children: string;
}) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
      {index} — {children}
    </p>
  );
}
