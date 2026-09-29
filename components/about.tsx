"use client";

import Image from "next/image";
import { site, stats } from "@/lib/content";
import { Reveal, SectionLabel } from "@/components/ui";

export function About() {
  return (
    <section id="about" className="scroll-mt-24 px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid w-full max-w-[1200px] items-start gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
        <Reveal>
          <div className="relative aspect-square w-48 overflow-hidden rounded-3xl border border-line bg-white sm:w-56 lg:w-full">
            <div data-parallax className="absolute inset-[-4%]">
              <Image
                src={site.portrait}
                alt="Portrait of Jayson Caburatan"
                fill
                sizes="(min-width: 1024px) 280px, 240px"
                className="object-cover object-top"
              />
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <SectionLabel index="01">About</SectionLabel>
            <h2 className="mt-5 max-w-[12ch] text-[clamp(2.6rem,5vw,4.6rem)] leading-[0.95] font-medium tracking-[-0.04em]">
              I turn ideas into products.
            </h2>
          </Reveal>

          <Reveal>
            <div className="mt-6 max-w-xl space-y-5 text-base leading-relaxed text-muted md:text-lg">
              <p>
                I&apos;m a Lead Full-Stack Web Developer with 4+ years of
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
        </div>
      </div>

      <div className="mx-auto mt-16 grid w-full max-w-[1200px] border-t border-line sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Reveal key={stat} delay={index * 0.05}>
            <div className="border-b border-line py-8 sm:px-6 sm:odd:pl-0 lg:border-b-0 lg:px-8 lg:first:pl-0">
              <p className="max-w-[16ch] text-2xl leading-tight font-medium tracking-tight text-fg md:text-[1.7rem]">
                {stat}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
