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

const fillSizes = {
  md: "h-12 px-5 text-sm",
  sm: "h-10 px-4 text-[13px]",
} as const;

export function FillLink({
  href,
  children,
  className,
  size = "md",
  onClick,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  size?: keyof typeof fillSizes;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 rounded-full bg-fg font-medium whitespace-nowrap text-bg",
        fillSizes[size],
        className,
      )}
    >
      <span aria-hidden className="absolute inset-0 overflow-hidden rounded-full">
        <span className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100" />
      </span>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </a>
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
