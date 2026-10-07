"use client";

import { useRef, useState, type MouseEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { site } from "@/lib/content";
import { FillLink, Magnetic, buttonStyles, cn } from "@/components/ui";
import { HeroStage, heroShowcases } from "@/components/hero-stage";

const ease = [0.22, 1, 0.36, 1] as const;

function RevealLine({
  children,
  delay,
  className,
}: {
  children: string;
  delay: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <span className="block overflow-hidden">
      <motion.span
        className={cn("block py-[0.04em] leading-[0.88]", className)}
        initial={reduce ? false : { y: "112%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.9, ease, delay: reduce ? 0 : delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 70, damping: 18, mass: 0.55 });
  const springY = useSpring(pointerY, { stiffness: 70, damping: 18, mass: 0.55 });
  const glowX = useTransform(springX, (value) => value * 36);
  const glowY = useTransform(springY, (value) => value * 24);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -32]);
  const stageY = useTransform(scrollYProgress, [0, 1], [0, -72]);
  const stageScale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);

  const active = heroShowcases[index] ?? heroShowcases[0];

  function onMove(event: MouseEvent<HTMLElement>) {
    if (reduce) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1);
    pointerY.set(((event.clientY - bounds.top) / bounds.height) * 2 - 1);
  }

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative flex min-h-[100svh] scroll-mt-24 flex-col"
      onMouseMove={onMove}
      onMouseLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[18%] right-[8%] hidden size-[520px] rounded-full bg-[radial-gradient(circle,rgba(228,201,168,0.16),transparent_68%)] lg:block"
        style={reduce ? undefined : { x: glowX, y: glowY }}
      />

      <div className="mx-auto grid w-full max-w-[1200px] flex-1 items-center gap-10 px-6 pt-24 pb-8 md:px-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8 lg:pt-28 lg:pb-6">
        <motion.div style={reduce ? undefined : { y: copyY }}>
          <motion.p
            className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: reduce ? 0 : 0.12 }}
          >
            <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] text-muted uppercase">
              <span className="pulse-dot size-1.5 rounded-full bg-accent" />
              Available for any project
            </span>
            <span className="hidden h-3 w-px bg-line sm:block" aria-hidden />
            <span className="text-[11px] tracking-[0.18em] text-muted uppercase">
              {site.location}
            </span>
          </motion.p>

          <h1 className="min-w-0">
            <span className="flex gap-4 sm:gap-5">
              <motion.span
                aria-hidden
                className="mt-2 mb-1 hidden w-px origin-top self-stretch bg-accent sm:block"
                initial={reduce ? false : { scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.8, ease, delay: reduce ? 0 : 0.2 }}
              />
              <span className="block min-w-0 text-[clamp(2.65rem,5.4vw,5.15rem)] font-medium tracking-[-0.05em]">
                <RevealLine delay={0.22}>Software</RevealLine>
                <RevealLine delay={0.3}>Engineer</RevealLine>
                <RevealLine delay={0.38}>and AI Engineer</RevealLine>
              </span>
            </span>
            <span className="mt-5 block overflow-hidden sm:mt-6">
              <motion.span
                className="block max-w-[16em] text-[clamp(1.3rem,2.05vw,1.8rem)] leading-snug font-medium tracking-[-0.03em] text-balance"
                initial={reduce ? false : { y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.85, ease, delay: reduce ? 0 : 0.52 }}
              >
                Building digital products that solve real business problems.
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="mt-5 max-w-[42ch] text-[15px] leading-relaxed text-muted sm:mt-6 sm:text-base md:text-[17px]"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease, delay: reduce ? 0 : 0.68 }}
          >
            4+ years of experience building scalable web applications, SaaS
            products, mobile apps, and AI-powered solutions from idea to
            production.
          </motion.p>

          <motion.div
            className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: reduce ? 0 : 1.02 }}
          >
            <Magnetic>
              <FillLink href="#work">
                View My Work
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </FillLink>
            </Magnetic>
            <Magnetic>
              <a href="#contact" className={cn(buttonStyles.ghost, "group")}>
                Let&apos;s Talk
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        <motion.div style={reduce ? undefined : { y: stageY, scale: stageScale }}>
          <HeroStage
            index={index}
            onChange={setIndex}
            pointerX={springX}
            pointerY={springY}
          />
        </motion.div>
      </div>

      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease, delay: reduce ? 0 : 1.16 }}
      >
        <a
          href="#work"
          className="group mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 border-t border-line px-6 py-4 md:px-10"
        >
          <span className="flex min-w-0 items-center gap-3 sm:gap-4">
            <span className="shrink-0 font-mono text-[11px] tracking-[0.2em] text-accent uppercase">
              Selected work
            </span>
            <span className="hidden h-px w-8 bg-line sm:block" aria-hidden />
            <span className="truncate text-sm text-muted transition-colors duration-300 group-hover:text-fg">
              {active.title}
            </span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-3 text-[11px] tracking-[0.2em] text-muted uppercase">
            <span className="relative h-8 w-px overflow-hidden bg-line" aria-hidden>
              <span className="scroll-cue absolute inset-x-0 top-0 h-3 bg-accent" />
            </span>
            Scroll
          </span>
        </a>
      </motion.div>
    </section>
  );
}
