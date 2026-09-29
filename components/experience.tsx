"use client";

import { experiences } from "@/lib/content";
import { Reveal, SectionLabel } from "@/components/ui";

export function Experience() {
  return (
    <section
      id="experience"
      className="scroll-mt-24 px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <Reveal>
          <SectionLabel index="03">Experience</SectionLabel>
          <h2 className="mt-5 max-w-[14ch] text-[clamp(2.6rem,5vw,4.6rem)] leading-[0.95] font-medium tracking-[-0.04em]">
            Systems I&apos;ve been trusted to lead.
          </h2>
        </Reveal>

        <div className="relative mt-16 [perspective:1200px]">
          <div className="absolute top-3 bottom-3 left-[6px] w-px bg-line" />
          <ol className="space-y-2">
            {experiences.map((item, index) => (
              <li key={item.company}>
                <Reveal delay={index * 0.06}>
                  <article
                    tabIndex={0}
                    className="group relative py-6 pl-10 transition-transform duration-500 [transform-style:preserve-3d] hover:[transform:translate3d(12px,0,18px)] focus-within:[transform:translate3d(12px,0,18px)]"
                  >
                    <span className="absolute top-8 left-0 size-3.5 rounded-full border border-accent bg-bg transition-colors group-hover:bg-accent group-focus-within:bg-accent" />
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-2xl font-medium tracking-tight md:text-3xl">
                          {item.role}
                        </h3>
                        <p className="mt-1 text-muted">{item.company}</p>
                      </div>
                      <div className="font-mono text-xs tracking-wide text-accent md:text-right">
                        <p>{item.dates}</p>
                        <p className="mt-1 text-muted">{item.location}</p>
                      </div>
                    </div>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
                      {item.summary}
                    </p>
                    <div className="exp-panel">
                      <div className="overflow-hidden">
                        <ul className="mt-5 max-w-2xl space-y-2 border-t border-line pt-5">
                          {item.points.map((point) => (
                            <li
                              key={point}
                              className="flex gap-3 text-sm leading-relaxed text-fg/90"
                            >
                              <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
