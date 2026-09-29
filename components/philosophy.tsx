"use client";

import { principles } from "@/lib/content";
import { Reveal, SectionLabel } from "@/components/ui";

export function Philosophy() {
  return (
    <section id="approach" className="scroll-mt-24 px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto w-full max-w-[1200px]">
        <Reveal>
          <SectionLabel index="05">Approach</SectionLabel>
          <h2 className="mt-5 text-[clamp(2.6rem,5vw,4.6rem)] leading-[0.95] font-medium tracking-[-0.04em]">
            How I build
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {principles.map((principle, index) => (
            <Reveal key={principle.index} delay={index * 0.05}>
              <article className="group flex h-full min-h-56 flex-col justify-between rounded-3xl border border-line bg-surface/30 p-7 transition-transform duration-500 hover:-translate-y-1 md:p-9">
                <p className="font-mono text-sm tracking-[0.18em] text-accent">
                  {principle.index}
                </p>
                <div className="mt-10">
                  <h3 className="text-3xl font-medium tracking-tight md:text-4xl">
                    {principle.title}
                  </h3>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
                    {principle.text}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
