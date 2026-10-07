"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { projects } from "@/lib/content";
import { cn } from "@/components/ui";

const CYCLE_MS = 4400;
const ease = [0.22, 1, 0.36, 1] as const;

const frames = [
  { slug: "sellora", image: "/work/sellora/dashboard.jpg" },
  { slug: "spendwise", image: "/work/spendwise/web.jpg" },
  { slug: "worklyst", image: "/work/worklyst/dashboard.jpg" },
  { slug: "tutorai", image: "/work/tutorai/home.jpg" },
] as const;

export const heroShowcases = frames.map((frame) => {
  const project = projects.find((entry) => entry.slug === frame.slug);
  if (!project) {
    throw new Error(`Missing hero project: ${frame.slug}`);
  }
  let host = project.title.toLowerCase();
  if (project.liveUrl) {
    try {
      host = new URL(project.liveUrl).host;
    } catch {
      host = project.title.toLowerCase();
    }
  }
  return {
    slug: project.slug,
    index: project.index,
    title: project.title,
    summary: project.summary,
    image: frame.image,
    alt: project.imageAlt ?? `${project.title} product interface`,
    host,
    tech: project.tech.slice(0, 3).join(" · "),
  };
});

export function HeroStage({
  index,
  onChange,
  pointerX,
  pointerY,
}: {
  index: number;
  onChange: (index: number) => void;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}) {
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const indexRef = useRef(index);
  const onChangeRef = useRef(onChange);
  indexRef.current = index;
  onChangeRef.current = onChange;

  const frontX = useTransform(pointerX, (value) => value * 16);
  const frontY = useTransform(pointerY, (value) => value * 10);
  const backX = useTransform(pointerX, (value) => value * -20);
  const backY = useTransform(pointerY, (value) => value * -12);

  useEffect(() => {
    if (reduce || paused) return;
    const id = window.setInterval(() => {
      onChangeRef.current((indexRef.current + 1) % heroShowcases.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [reduce, paused, epoch]);

  const active = heroShowcases[index] ?? heroShowcases[0];
  const behind =
    heroShowcases[(index + 1) % heroShowcases.length] ?? heroShowcases[0];

  function select(next: number) {
    onChange(next);
    setEpoch((value) => value + 1);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const delta = event.key === "ArrowRight" ? 1 : -1;
    select((index + delta + heroShowcases.length) % heroShowcases.length);
  }

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: reduce ? 0 : 0.72, ease }}
    >
      <div className="hero-float relative mx-auto w-full max-w-[560px] lg:mx-0 lg:ml-auto">
        <motion.div
          aria-hidden
          className="absolute top-10 -left-4 hidden w-[86%] lg:block"
          style={{ x: backX, y: backY, rotate: -7 }}
        >
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-surface opacity-45">
            <Image
              src={behind.image}
              alt=""
              fill
              sizes="420px"
              className="object-cover object-top"
            />
          </div>
        </motion.div>

        <motion.div className="relative" style={{ x: frontX, y: frontY }}>
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Products in production"
            onKeyDown={onKeyDown}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-accent uppercase">
                <span className="pulse-dot size-1.5 rounded-full bg-accent" />
                In production
              </p>
              {reduce ? null : (
                <button
                  type="button"
                  className="inline-flex h-11 items-center gap-1.5 rounded-full px-2 text-[11px] tracking-[0.16em] text-muted uppercase transition-colors hover:text-fg"
                  aria-pressed={paused}
                  onClick={() => {
                    setPaused((value) => !value);
                    setEpoch((value) => value + 1);
                  }}
                >
                  {paused ? <Play size={12} /> : <Pause size={12} />}
                  {paused ? "Play" : "Pause"}
                </button>
              )}
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0e] shadow-[0_30px_80px_-28px_rgba(0,0,0,0.85)]">
              <div className="flex h-9 items-center gap-2 border-b border-white/10 px-3">
                <span className="size-2 rounded-full bg-white/25" />
                <span className="size-2 rounded-full bg-white/15" />
                <span className="size-2 rounded-full bg-white/10" />
                <span className="ml-2 truncate font-mono text-[10px] text-white/45">
                  {active.host}
                </span>
              </div>
              <div className="relative aspect-[16/10] bg-white">
                {heroShowcases.map((item, itemIndex) => (
                  <Image
                    key={item.slug}
                    src={item.image}
                    alt={itemIndex === index ? item.alt : ""}
                    fill
                    priority={itemIndex === 0}
                    sizes="(min-width: 1024px) 540px, 92vw"
                    className={cn(
                      "object-cover object-top",
                      reduce ? "" : "transition-opacity duration-700",
                      itemIndex === index ? "opacity-100" : "opacity-0",
                    )}
                    aria-hidden={itemIndex === index ? undefined : true}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
                  {active.index}
                  <span className="mx-2 text-line">/</span>
                  <span className="text-fg">{active.title}</span>
                </p>
                <p className="mt-1.5 max-w-[36ch] text-sm leading-relaxed text-muted">
                  {active.summary}
                </p>
              </div>
              <p className="hidden shrink-0 font-mono text-[10px] tracking-[0.14em] text-muted uppercase sm:block">
                {active.tech}
              </p>
            </div>

            <div
              className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4"
              role="group"
              aria-label="Choose a product"
            >
              {heroShowcases.map((item, itemIndex) => {
                const selected = itemIndex === index;
                return (
                  <button
                    key={item.slug}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => select(itemIndex)}
                    className={cn(
                      "relative min-h-11 rounded-full border px-3 text-left text-[13px] transition-colors duration-300",
                      selected
                        ? "border-accent/60 bg-accent/10 text-fg"
                        : "border-line text-muted hover:border-white/25 hover:text-fg",
                    )}
                  >
                    {item.title}
                    {selected && (
                      <span
                        key={`${item.slug}-${epoch}`}
                        className={cn(
                          "absolute inset-x-3 bottom-1.5 h-px origin-left bg-accent",
                          !reduce && !paused && "hero-progress",
                        )}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
