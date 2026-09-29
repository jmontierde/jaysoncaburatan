"use client";

import dynamic from "next/dynamic";
import { useRef, useState, type MouseEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/lib/content";
import { motion, useReducedMotion } from "motion/react";
import { Magnetic, buttonStyles } from "@/components/ui";
import { WebGLBoundary } from "@/components/webgl-boundary";
import { useVisualMode } from "@/components/use-visual-mode";

const HeroScene = dynamic(
  () => import("@/components/scenes/hero-scene").then((mod) => mod.HeroScene),
  { ssr: false },
);

function HeroMark() {
  return (
    <svg
      viewBox="0 0 360 360"
      className="drift h-[min(68vw,420px)] w-[min(68vw,420px)] text-accent/80"
      aria-hidden
    >
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="180" cy="180" r="46" />
        <circle cx="180" cy="180" r="92" opacity="0.55" />
        <circle cx="180" cy="180" r="146" opacity="0.28" />
        <path d="M180 34 L180 326 M34 180 L326 180 M78 78 L282 282 M282 78 L78 282" opacity="0.35" />
        <path d="M180 88 L258 226 H102 Z" />
      </g>
      {Array.from({ length: 8 }).map((_, index) => {
        const angle = (index / 8) * Math.PI * 2;
        const x = 180 + Math.cos(angle) * 146;
        const y = 180 + Math.sin(angle) * 146;
        return <circle key={index} cx={x} cy={y} r="3" fill="currentColor" stroke="none" />;
      })}
    </svg>
  );
}

const rise = {
  duration: 0.8,
  ease: [0.22, 1, 0.36, 1] as const,
};

function HeroTitle({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  return (
    <h1 className="max-w-[16ch] text-[clamp(3.1rem,7.4vw,6.6rem)] leading-[0.92] font-medium tracking-[-0.045em] text-balance">
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="inline-block overflow-hidden pb-[0.12em] align-bottom"
        >
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ ...rise, delay: reduce ? 0 : 0.08 + index * 0.045 }}
          >
            {word}
            {index < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

export function Hero() {
  const mode = useVisualMode();
  const reduce = useReducedMotion();
  const pointer = useRef({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);
  const webgl = mode === "full" || mode === "simple";

  function onMove(event: MouseEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointer.current.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    pointer.current.y = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
  }

  return (
    <section
      id="home"
      className="relative min-h-[100svh] scroll-mt-24 overflow-hidden"
      onMouseMove={onMove}
    >
      <div data-hero-visual className="pointer-events-none absolute inset-0">
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 lg:justify-end lg:pr-[8%] ${
            ready ? "opacity-0" : "opacity-100"
          }`}
        >
          <HeroMark />
        </div>

        {webgl && (
          <WebGLBoundary fallback={null}>
            <div
              className={`absolute inset-0 transition-opacity duration-700 lg:left-[18%] ${
                ready ? "opacity-100" : "opacity-0"
              }`}
            >
              <HeroScene
                detail={mode === "full" ? "full" : "simple"}
                pointer={pointer}
                onReady={() => setReady(true)}
              />
            </div>
          </WebGLBoundary>
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-bg via-bg/85 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1200px] flex-col justify-end px-6 pb-10 pt-28 md:px-10 md:pb-14">
        <motion.p
          className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-line bg-bg/60 px-3 py-1.5 text-xs text-muted backdrop-blur-sm"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...rise, delay: reduce ? 0 : 0.02 }}
        >
          <span className="pulse-dot size-1.5 rounded-full bg-accent" />
          Available for selected projects
        </motion.p>

        <motion.p
          className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-accent"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...rise, delay: reduce ? 0 : 0.08 }}
        >
          {site.name}
        </motion.p>
        <HeroTitle text="I build digital products that move." />
        <motion.p
          className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...rise, delay: reduce ? 0 : 0.42 }}
        >
          Lead Full-Stack Web Developer crafting scalable web applications,
          AI-powered products, and modern digital experiences.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col gap-3 sm:flex-row"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...rise, delay: reduce ? 0 : 0.52 }}
        >
          <Magnetic>
            <a href="#work" className={buttonStyles.primary}>
              View My Work
            </a>
          </Magnetic>
          <Magnetic>
            <a href="#contact" className={buttonStyles.ghost}>
              Let&apos;s Work Together
              <ArrowUpRight size={16} />
            </a>
          </Magnetic>
        </motion.div>

        <a
          href="#about"
          className="mt-12 inline-flex items-center gap-3 text-[11px] tracking-[0.22em] text-muted uppercase"
        >
          <span className="relative h-10 w-px overflow-hidden bg-line">
            <span className="scroll-cue absolute inset-x-0 top-0 h-3 bg-accent" />
          </span>
          Scroll
        </a>
      </div>
    </section>
  );
}
