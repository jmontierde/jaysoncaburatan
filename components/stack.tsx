"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { useInView } from "motion/react";
import { technologies } from "@/lib/content";
import { Reveal, SectionLabel } from "@/components/ui";
import { WebGLBoundary } from "@/components/webgl-boundary";
import { useVisualMode } from "@/components/use-visual-mode";

const StackScene = dynamic(
  () => import("@/components/scenes/stack-scene").then((mod) => mod.StackScene),
  { ssr: false },
);

export function Stack() {
  const mode = useVisualMode();
  const webgl = mode === "full" || mode === "simple";
  const [active, setActive] = useState<string>(technologies[0].name);
  const sceneRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sceneRef, { once: true, margin: "240px" });
  const current =
    technologies.find((item) => item.name === active) ?? technologies[0];

  return (
    <section id="stack" className="scroll-mt-24 px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-10 lg:grid-cols-[0.78fr_1.22fr]">
        <div>
          <Reveal>
            <SectionLabel index="04">Stack</SectionLabel>
            <h2 className="mt-5 text-[clamp(2.6rem,5vw,4.6rem)] leading-[0.95] font-medium tracking-[-0.04em]">
              Tools in the systems I ship.
            </h2>
            <p className="mt-6 min-h-16 max-w-md text-base leading-relaxed text-muted md:text-lg">
              <span className="text-fg">{current.name}. </span>
              {current.detail}
            </p>
          </Reveal>
        </div>

        <div ref={sceneRef} className="relative min-h-[420px]">
          {webgl && (
            <WebGLBoundary fallback={<TechChips active={active} onSelect={setActive} />}>
              <div className="hidden h-[540px] md:block">
                {inView && (
                  <StackScene active={active} onSelect={setActive} />
                )}
              </div>
            </WebGLBoundary>
          )}
          <div className={webgl ? "md:hidden" : ""}>
            <TechChips active={active} onSelect={setActive} />
          </div>
        </div>
      </div>
    </section>
  );
}

function TechChips({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (name: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {technologies.map((tech) => {
        const selected = active === tech.name;
        return (
          <button
            key={tech.name}
            type="button"
            onClick={() => onSelect(tech.name)}
            onMouseEnter={() => onSelect(tech.name)}
            onFocus={() => onSelect(tech.name)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              selected
                ? "border-accent text-fg"
                : "border-line text-muted hover:text-fg"
            }`}
            aria-pressed={selected}
          >
            {tech.name}
          </button>
        );
      })}
    </div>
  );
}
