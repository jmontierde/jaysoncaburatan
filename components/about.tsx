"use client";

import Image from "next/image";
import { site, stats } from "@/lib/content";
import { Reveal, SectionLabel } from "@/components/ui";

export function About() {
  return (
    <section id="about" className="scroll-mt-24 px-6 pt-16 pb-4 md:px-10 md:pt-20 md:pb-6">
      <div className="mx-auto w-full max-w-[1200px]">
        <Reveal>
          <SectionLabel index="01">About</SectionLabel>
        </Reveal>

        <div className="mt-8 grid items-center gap-6 sm:mt-10 sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:gap-10 lg:grid-cols-[11.5rem_minmax(0,1fr)] lg:gap-14">
          <Reveal>
            <div className="relative aspect-square w-36 overflow-hidden rounded-2xl border border-line bg-white sm:w-full">
              <Image
                src={site.portrait}
                alt="Portrait of Jayson Caburatan"
                fill
                sizes="(min-width: 1024px) 184px, 144px"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal>
            <h2 className="max-w-[11ch] text-[clamp(2.75rem,5.4vw,4.8rem)] leading-[0.92] font-medium tracking-[-0.045em]">
              I turn ideas into products.
            </h2>
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-muted sm:mt-10 md:text-lg">
            <p>
              I&apos;m a Software Engineer and AI Engineer with 4+ years of
              experience building software that ships. I work from architecture
              through interface, API, and the operational details that keep a
              system reliable.
            </p>
            <p>
              That work covers full-stack development, SaaS platforms,
              AI-powered applications, business management systems, payroll and
              HR, POS and restaurant systems, mobile applications, API
              integrations, and cloud-based products.
            </p>
            <p className="text-sm tracking-wide text-fg/80">{site.location}</p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-x-10 gap-y-6 border-t border-line pt-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal key={stat} delay={index * 0.05}>
              <p className="max-w-[14rem] text-xl leading-snug font-medium tracking-tight text-balance text-fg md:text-[1.45rem]">
                {stat}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
