"use client";

import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getLenis } from "@/components/smooth-scroll";
import { WebGLBoundary } from "@/components/webgl-boundary";
import { useVisualMode } from "@/components/use-visual-mode";
import { buttonStyles } from "@/lib/styles";
import { projects, type Project } from "@/lib/content";
import { getHandoff } from "@/lib/project-handoff";
import { ProjectLink } from "@/components/work/project-link";
import { useStillMotion } from "@/components/work/use-still-motion";

const StillPlane = dynamic(
  () => import("@/components/scenes/still-plane").then((mod) => mod.StillPlane),
  { ssr: false },
);

const total = String(projects.length).padStart(2, "0");

export function ProjectStudy({
  project,
  previous,
  next,
}: {
  project: Project;
  previous: Project | null;
  next: Project | null;
}) {
  const scope = useRef<HTMLElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const fromHandoff = useRef(false);
  const [planeReady, setPlaneReady] = useState(false);
  const mode = useVisualMode();
  const webgl = mode === "full" && Boolean(project.image);
  useStillMotion(scope, project.slug);

  const frames = project.gallery.filter((image) => image.src !== project.image);
  const reel =
    frames.length >= 3 && frames.every((image) => image.orientation === "portrait");

  useLayoutEffect(() => {
    fromHandoff.current = Boolean(getHandoff());
    if (!fromHandoff.current) return;
    window.scrollTo(0, 0);
    getLenis()?.scrollTo(0, { immediate: true, force: true });
  }, [project.slug]);

  useEffect(() => {
    if (!fromHandoff.current) return;
    const timer = window.setTimeout(() => {
      document.getElementById("project-title")?.focus({ preventScroll: true });
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [project.slug]);

  function onMove(event: MouseEvent<HTMLDivElement>) {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointer.current.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    pointer.current.y = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
  }

  return (
    <main id="content" ref={scope} className="relative z-10">
      <div data-project-hero className="project-hero relative">
        <div className="sticky top-0 h-svh">
          <div
            data-project-frame
            className="relative h-full w-full overflow-hidden bg-[#0c0c0e]"
            onMouseMove={onMove}
            onMouseLeave={() => {
              pointer.current.x = 0;
              pointer.current.y = 0;
            }}
          >
            {project.image && (
              <Image
                src={project.image}
                alt={project.imageAlt ?? project.title}
                fill
                priority
                sizes="100vw"
                className="object-cover object-top"
              />
            )}
            {webgl && project.image && (
              <WebGLBoundary fallback={null}>
                <div
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    planeReady ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <StillPlane
                    src={project.image}
                    pointer={pointer}
                    onReady={() => setPlaneReady(true)}
                  />
                </div>
              </WebGLBoundary>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#08080a]/90 via-[#08080a]/25 to-[#08080a]/45" />
            <div className="relative z-10 flex h-full flex-col justify-between px-5 pt-24 pb-8 md:px-10 md:pt-28 md:pb-12">
              <Link
                href="/#work"
                className="inline-flex min-h-11 w-fit items-center gap-2 text-sm text-fg/85 transition-colors hover:text-fg"
              >
                <ArrowLeft size={16} />
                All work
              </Link>
              <div className="max-w-[1100px]">
                <p className="font-mono text-[11px] tracking-[0.22em] text-accent">
                  {project.index} / {total}
                </p>
                <h1
                  id="project-title"
                  tabIndex={-1}
                  className="mt-4 max-w-[12ch] text-[clamp(3.2rem,8vw,7rem)] leading-[0.9] font-medium tracking-[-0.05em]"
                >
                  {project.title}
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-fg/90 md:text-lg">
                  {project.summary}
                </p>
                <p className="mt-4 text-sm tracking-wide text-fg/75">
                  {project.tech.join(" · ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto w-full max-w-[1100px] px-6 py-20 md:px-10 md:py-28">
        <div className="reveal grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
          <div className="grid gap-5 text-base leading-relaxed text-muted md:text-lg">
            {project.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div>
            <ul className="grid gap-4 border-t border-line pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
              {project.highlights.map((item) => (
                <li key={item} className="text-sm leading-relaxed text-fg">
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonStyles.primary}
                >
                  View project
                  <ArrowUpRight size={16} />
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonStyles.ghost}
                >
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {frames.length > 0 && (
        <section aria-labelledby="project-frames" className="pb-8">
          <div className="mx-auto w-full max-w-[1480px] px-6 md:px-10">
            <h2
              id="project-frames"
              className="reveal text-[clamp(2rem,4vw,3.2rem)] leading-none font-medium tracking-[-0.04em]"
            >
              The interface
            </h2>
          </div>
          {reel ? (
            <div data-reel className="mt-10">
              <div className="flex items-center lg:min-h-svh lg:overflow-hidden">
                <div
                  data-reel-track
                  className="flex w-full flex-col items-center gap-10 px-6 py-12 lg:w-max lg:flex-row lg:gap-6 lg:px-[7vw] lg:py-0"
                >
                  {frames.map((image) => (
                    <figure key={image.src} className="w-[min(78vw,280px)] shrink-0">
                      <div className="relative aspect-[9/16] overflow-hidden rounded-[1.6rem] border border-line bg-[#0c0c0e]">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="280px"
                          className="object-cover object-top"
                        />
                      </div>
                      <figcaption className="mt-3 font-mono text-[11px] tracking-[0.16em] text-muted uppercase">
                        {image.caption}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-auto mt-10 grid w-full max-w-[1480px] gap-10 px-3 md:gap-14 md:px-6">
              {frames.map((image) => (
                <figure key={image.src}>
                  <div
                    data-frame
                    className={`relative overflow-hidden rounded-[1.35rem] border border-line bg-[#0c0c0e] md:rounded-[1.75rem] ${
                      image.orientation === "portrait"
                        ? "mx-auto aspect-[9/16] w-[min(78vw,320px)]"
                        : "aspect-[16/10]"
                    }`}
                  >
                    <div data-still className="absolute -inset-[3%]">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes={
                          image.orientation === "portrait"
                            ? "320px"
                            : "(min-width: 1480px) 1480px, 100vw"
                        }
                        className="object-cover object-top"
                      />
                    </div>
                  </div>
                  <figcaption className="mt-3 px-1 font-mono text-[11px] tracking-[0.16em] text-muted uppercase">
                    {image.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </section>
      )}

      <section aria-labelledby="more-work" className="border-t border-line">
        <h2 id="more-work" className="sr-only">
          More projects
        </h2>
        <div className="mx-auto grid w-full max-w-[1480px] md:grid-cols-2">
          {previous ? (
            <Neighbor project={previous} label="Previous" />
          ) : (
            <div className="hidden md:block" />
          )}
          {next ? <Neighbor project={next} label="Next" align="end" /> : null}
        </div>
        <div className="flex justify-center px-6 pb-20">
          <Link
            href="/#work"
            className="inline-flex min-h-11 items-center text-sm text-muted transition-colors hover:text-fg"
          >
            All work
          </Link>
        </div>
      </section>
    </main>
  );
}

function Neighbor({
  project,
  label,
  align,
}: {
  project: Project;
  label: string;
  align?: "end";
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  return (
    <ProjectLink
      href={`/work/${project.slug}`}
      slug={project.slug}
      src={project.image ?? ""}
      sourceRef={frameRef}
      className={`group flex cursor-pointer flex-col gap-6 px-6 py-12 focus-visible:outline-offset-4 md:px-10 md:py-16 ${
        align === "end" ? "md:items-end md:text-right" : ""
      }`}
    >
      <div
        ref={frameRef}
        data-frame
        className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-line bg-[#0c0c0e] transition-colors duration-300 group-hover:border-accent/70 md:max-w-[440px]"
      >
        {project.image && (
          <div data-still className="absolute -inset-[3%]">
            <Image
              src={project.image}
              alt=""
              fill
              sizes="440px"
              className="object-cover object-top"
            />
          </div>
        )}
      </div>
      <div>
        <p className="font-mono text-[11px] tracking-[0.2em] text-accent uppercase">
          {label}
        </p>
        <p className="mt-3 text-[clamp(2rem,4vw,3.5rem)] leading-none font-medium tracking-[-0.04em]">
          {project.title}
        </p>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{project.summary}</p>
      </div>
    </ProjectLink>
  );
}
