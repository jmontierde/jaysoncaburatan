"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { projects, type GalleryImage, type Project } from "@/lib/content";
import { getLenis } from "@/components/smooth-scroll";
import { Reveal, SectionLabel, cn } from "@/components/ui";
import { ProjectLink } from "@/components/work/project-link";

gsap.registerPlugin(ScrollTrigger);

const EASE = [0.22, 1, 0.36, 1] as const;
const PREVIEW_COUNT = 3;
const THUMB_W = 100;
const THUMB_H = 68;
const THUMB_STEP = 108;

function framesOf(project: Project): GalleryImage[] {
  if (project.gallery.length > 0) return [...project.gallery];
  if (!project.image) return [];
  return [
    {
      src: project.image,
      alt: project.imageAlt ?? project.title,
      caption: project.title,
      orientation: "landscape",
    },
  ];
}

export function Work() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  useEffect(() => {
    getLenis()?.resize();
    const timer = window.setTimeout(() => {
      getLenis()?.resize();
      ScrollTrigger.refresh();
    }, 1050);
    return () => window.clearTimeout(timer);
  }, [openSlug]);

  return (
    <section id="work" className="scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <Reveal>
          <SectionLabel index="02">Work</SectionLabel>
          <h2 className="mt-5 max-w-[12ch] text-[clamp(2.6rem,5vw,4.6rem)] leading-[0.95] font-medium tracking-[-0.04em]">
            Selected work
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Products across SaaS, AI, and the systems behind them. Open a row
            and the frames drop into place.
          </p>
        </Reveal>
      </div>

      <div className="mt-16 border-t border-line">
        {projects.map((project) => (
          <ProjectRow
            key={project.slug}
            project={project}
            open={openSlug === project.slug}
            onToggle={() =>
              setOpenSlug((current) =>
                current === project.slug ? null : project.slug,
              )
            }
          />
        ))}
      </div>
    </section>
  );
}

function ProjectRow({
  project,
  open,
  onToggle,
}: {
  project: Project;
  open: boolean;
  onToggle: () => void;
}) {
  const frames = framesOf(project);
  const reduce = useReducedMotion();
  const coverRef = useRef<HTMLDivElement>(null);
  const blurb = project.description[0] ?? project.summary;
  const panelId = `project-panel-${project.slug}`;

  return (
    <article
      className={cn(
        "group relative border-b border-line",
        open && "z-20",
      )}
      data-project={project.slug}
    >
      <LayoutGroup id={project.slug}>
        <div
          className={cn(
            "mx-auto grid w-full max-w-[1200px] px-6 md:px-10",
            open
              ? "grid-cols-1"
              : "grid-cols-1 items-center min-[720px]:grid-cols-[minmax(0,1fr)_auto]",
          )}
        >
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={onToggle}
            className="grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 py-5 text-left min-[720px]:grid-cols-[minmax(0,1fr)_auto_auto] min-[720px]:gap-x-8 min-[720px]:py-6"
          >
            <span className="text-[clamp(1.65rem,2.7vw,2.7rem)] leading-none font-medium tracking-[-0.045em] transition-colors duration-300 group-hover:text-white">
              {project.title}
            </span>
            <span className="col-start-1 row-start-2 min-[720px]:col-start-2 min-[720px]:row-start-1">
              <TechTags tech={project.tech} />
            </span>
            <span className="col-start-2 row-start-1 w-14 text-right font-mono text-[13px] tracking-[0.16em] text-muted transition-colors duration-300 group-hover:text-fg min-[720px]:col-start-3">
              ( {open ? "–" : "+"} )
            </span>
          </button>

          {!open && frames.length > 0 && (
            <div
              className="relative mb-5 h-[68px] w-[208px] cursor-pointer justify-self-end overflow-hidden transition-transform duration-500 ease-out group-hover:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 min-[720px]:mb-0 min-[720px]:ml-8 min-[720px]:w-[316px]"
              onClick={onToggle}
              aria-hidden
            >
              {frames.map((frame, index) => (
                <Frame
                  key={`${project.slug}-${index}`}
                  frame={frame}
                  index={index}
                  slug={project.slug}
                  open={false}
                  reduce={!!reduce}
                />
              ))}
            </div>
          )}

          {open && (
            <motion.div
              id={panelId}
              role="region"
              aria-label={`${project.title} gallery`}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: EASE }}
              className="flex flex-col gap-5 pb-6 min-[720px]:flex-row min-[720px]:items-end min-[720px]:justify-between"
            >
              <p className="max-w-xl text-sm leading-relaxed text-muted md:text-[15px]">
                {blurb}
              </p>
              <ProjectLink
                href={`/work/${project.slug}`}
                slug={project.slug}
                src={frames[0]?.src ?? project.image ?? ""}
                sourceRef={coverRef}
                className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start font-mono text-[11px] tracking-[0.18em] text-fg uppercase transition-colors hover:text-accent"
              >
                View case
                <ArrowUpRight size={14} aria-hidden />
              </ProjectLink>
            </motion.div>
          )}
        </div>

        {open && frames.length > 0 && (
          <div className="work-strip flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-10">
            {frames.map((frame, index) => (
              <Frame
                key={`${project.slug}-${index}`}
                frame={frame}
                index={index}
                slug={project.slug}
                open
                reduce={!!reduce}
                coverRef={index === 0 ? coverRef : undefined}
              />
            ))}
          </div>
        )}
      </LayoutGroup>
    </article>
  );
}

function Frame({
  frame,
  index,
  slug,
  open,
  reduce,
  coverRef,
}: {
  frame: GalleryImage;
  index: number;
  slug: string;
  open: boolean;
  reduce: boolean;
  coverRef?: RefObject<HTMLDivElement | null>;
}) {
  const portrait = frame.orientation === "portrait";
  const hiddenThumb = !open && index >= PREVIEW_COUNT;
  const transition = reduce
    ? { duration: 0 }
    : {
        layout: {
          duration: 0.95,
          ease: EASE,
          delay: Math.min(index, 6) * 0.045,
        },
        opacity: {
          duration: 0.45,
          delay: Math.min(index, 6) * 0.045,
        },
      };

  return (
    <motion.div
      layoutId={reduce ? undefined : `${slug}-frame-${index}`}
      ref={coverRef}
      transition={transition}
      className={cn(
        "overflow-hidden rounded-[3px] border border-white/10 bg-surface",
        open
          ? cn(
              "relative shrink-0 snap-start",
              portrait
                ? "h-[240px] w-[158px] sm:h-[320px] sm:w-[210px] md:h-[380px] md:w-[248px]"
                : "h-[240px] w-[78vw] max-w-[520px] sm:h-[320px] sm:w-[420px] md:h-[380px] md:w-[540px]",
            )
          : "absolute top-0",
      )}
      style={
        open
          ? undefined
          : {
              width: THUMB_W,
              height: THUMB_H,
              right: Math.min(index, PREVIEW_COUNT - 1) * THUMB_STEP,
              zIndex: 12 - index,
              opacity: hiddenThumb ? 0 : 1,
              pointerEvents: hiddenThumb ? "none" : undefined,
            }
      }
    >
      <Image
        src={frame.src}
        alt={open ? frame.alt : ""}
        fill
        sizes={
          open
            ? portrait
              ? "248px"
              : "(max-width: 768px) 78vw, 540px"
            : "100px"
        }
        className="object-cover object-top"
        draggable={false}
      />
    </motion.div>
  );
}

function TechTags({ tech }: { tech: string[] }) {
  return (
    <span className="flex flex-wrap gap-1.5">
      {tech.slice(0, 3).map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] leading-none tracking-[0.14em] text-muted uppercase"
        >
          {tag}
        </span>
      ))}
    </span>
  );
}
