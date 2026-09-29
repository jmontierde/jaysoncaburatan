"use client";

import { motion, useReducedMotion } from "motion/react";
import { aiTools, workflow } from "@/lib/content";
import { Reveal, SectionLabel } from "@/components/ui";

export function Workflow() {
  const reduce = useReducedMotion();

  return (
    <section className="px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto w-full max-w-[1200px]">
        <Reveal>
          <SectionLabel index="06">Engineering</SectionLabel>
          <h2 className="mt-5 max-w-[18ch] text-[clamp(2.4rem,4.6vw,4.4rem)] leading-[0.96] font-medium tracking-[-0.04em]">
            AI is part of my workflow.
            <span className="mt-2 block text-muted">
              Not a replacement for engineering.
            </span>
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
            Models speed up exploration and drafting. They do not decide the
            architecture, skip review, or ship untested. ChatGPT, Claude,
            Claude Code, Codex, OpenAI APIs, and n8n are tools inside that
            loop — useful after a person has checked the work.
          </p>
        </Reveal>

        <div className="relative mt-14">
          <div className="absolute top-3 bottom-3 left-[7px] w-px bg-line md:hidden" />
          <ol className="grid gap-8 md:grid-cols-6 md:gap-4">
            {workflow.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.05}>
                <li className="relative pl-8 md:pl-0">
                  <span className="absolute top-1 left-0 size-3.5 rounded-full border border-accent bg-bg md:static md:mb-4 md:block" />
                  <p className="font-mono text-[11px] tracking-[0.16em] text-accent">
                    0{index + 1}
                  </p>
                  <h3 className="mt-3 text-lg font-medium tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {step.text}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
          <div className="relative mt-8 hidden h-px bg-line md:block">
            {!reduce && (
              <motion.span
                className="absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-accent"
                animate={{ left: ["0%", "100%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
            )}
          </div>
        </div>

        <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          {aiTools.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
