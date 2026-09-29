"use client";

import {
  Building2,
  Cable,
  Cpu,
  LayoutDashboard,
  Layers,
  Smartphone,
  Utensils,
  Workflow,
  Boxes,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { services } from "@/lib/content";
import { Reveal, SectionLabel } from "@/components/ui";

const icons = [
  Layers,
  Boxes,
  Cpu,
  Building2,
  LayoutDashboard,
  Cable,
  Utensils,
  Smartphone,
  Workflow,
];

export function Services() {
  const reduce = useReducedMotion();

  return (
    <section className="px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto w-full max-w-[1200px]">
        <Reveal>
          <SectionLabel index="07">Services</SectionLabel>
          <h2 className="mt-5 text-[clamp(2.6rem,5vw,4.6rem)] leading-[0.95] font-medium tracking-[-0.04em]">
            What I can build
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = icons[index] ?? Layers;
            return (
              <Reveal key={service.title} delay={(index % 3) * 0.04}>
                <motion.article
                  className="group h-full rounded-2xl border border-line p-6 transition-colors duration-300 hover:border-accent/50 hover:bg-white/[0.02]"
                  whileHover={reduce ? undefined : { y: -5 }}
                  transition={{ type: "spring", stiffness: 280, damping: 24 }}
                >
                  <Icon
                    size={18}
                    className="text-muted transition-colors group-hover:text-accent"
                    aria-hidden
                  />
                  <h3 className="mt-6 text-xl font-medium tracking-tight">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {service.text}
                  </p>
                </motion.article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
