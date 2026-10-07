"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ArrowUpRight, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { setScrollLocked } from "@/components/smooth-scroll";
import type { GalleryImage, Project } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;

export function CaseOverlay({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const setHeightRef = useRef(0);
  const ringRef = useRef<SVGCircleElement>(null);
  const onCloseRef = useRef(onClose);
  const [mounted, setMounted] = useState(false);
  const [copies, setCopies] = useState(2);
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const closingRef = useRef(false);
  const requestCloseRef = useRef<() => void>(() => {});
  onCloseRef.current = onClose;

  const frames: GalleryImage[] =
    project.gallery.length > 0
      ? project.gallery
      : project.image
        ? [
            {
              src: project.image,
              alt: project.imageAlt ?? project.title,
              caption: project.title,
              detail: project.summary,
              orientation: "landscape",
            },
          ]
        : [];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (reduce) {
      setOpen(true);
      return;
    }
    const frame = window.requestAnimationFrame(() => setOpen(true));
    return () => window.cancelAnimationFrame(frame);
  }, [mounted, reduce]);

  function requestClose() {
    if (closingRef.current) return;
    if (reduce || !open) {
      onCloseRef.current();
      return;
    }
    closingRef.current = true;
    setOpen(false);
    window.setTimeout(() => onCloseRef.current(), 340);
  }
  requestCloseRef.current = requestClose;

  useEffect(() => {
    if (!mounted) return;
    setScrollLocked(true);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") requestCloseRef.current();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [
        ...dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ];
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      setScrollLocked(false);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [mounted]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!mounted || !el) return;

    const measure = () => {
      const one = el.scrollHeight / copies;
      setHeightRef.current = one;
      if (one > 0 && one < el.clientHeight + 48 && copies < 8) {
        setCopies((count) => count + 1);
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    const track = el.firstElementChild;
    if (track) observer.observe(track);

    const onScroll = () => {
      const setHeight = el.scrollHeight / copies;
      setHeightRef.current = setHeight;
      if (setHeight < 8) return;
      let guard = 0;
      while (el.scrollTop >= setHeight && guard < 6) {
        el.scrollTop -= setHeight;
        guard += 1;
      }
      const progress = (el.scrollTop % setHeight) / setHeight;
      const ring = ringRef.current;
      if (ring) {
        const length = 2 * Math.PI * 8;
        ring.style.strokeDashoffset = String(length * (1 - progress));
      }
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [mounted, copies, frames.length]);

  if (!mounted) return null;

  const loop = Array.from({ length: copies }, (_, copy) =>
    frames.map((frame, index) => ({ frame, copy, index })),
  ).flat();

  const panel = reduce
    ? { opacity: 1, y: 0, scale: 1 }
    : open
      ? { opacity: 1, y: 0, scale: 1 }
      : { opacity: 0, y: 28, scale: 0.975 };

  return createPortal(
    <div className="fixed inset-0 z-[80] p-2 sm:p-4 md:p-5">
      <motion.button
        type="button"
        aria-label="Close case"
        className="absolute inset-0 cursor-default bg-black/75"
        initial={false}
        animate={{ opacity: reduce || open ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : open ? 0.4 : 0.28, ease: EASE }}
        onClick={requestClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-title"
        className="relative mx-auto h-full max-w-[1240px]"
      >
        <motion.div
          className="relative flex h-full flex-col overflow-hidden rounded-[28px] bg-white text-[#141414] md:grid md:grid-cols-[minmax(240px,0.78fr)_1.22fr]"
          initial={false}
          animate={panel}
          transition={{ duration: reduce ? 0 : open ? 0.58 : 0.32, ease: EASE }}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={requestClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-20 inline-flex size-10 items-center justify-center rounded-full border border-black/15 bg-white text-[#141414] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-transform duration-300 hover:scale-105 md:top-5 md:right-5"
          >
            <X size={16} />
          </button>

          <div className="shrink-0 px-6 pt-8 pr-16 pb-2 sm:px-8 md:overflow-y-auto md:px-10 md:py-12 md:pr-6 md:pb-16">
            <Rise delay={0.12} reduce={!!reduce}>
              <h2
                id="case-title"
                className="max-w-[12ch] text-[clamp(2.25rem,4vw,3.25rem)] leading-[1.02] font-medium tracking-[-0.04em]"
              >
                {project.title}
              </h2>
            </Rise>
            <Rise delay={0.2} reduce={!!reduce} className="mt-5">
              <p className="max-w-[34ch] text-[15px] leading-relaxed text-[#3a3a3a] md:text-base">
                {project.summary}
              </p>
            </Rise>
            <div className="mt-7 flex flex-wrap items-center gap-2">
              {project.liveUrl && (
                <motion.span
                  className="inline-flex"
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : 0.28, ease: EASE }}
                >
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex size-8 items-center justify-center rounded-full bg-[#141414] text-white transition-transform duration-300 hover:-translate-y-0.5"
                    aria-label={`Open ${project.title}`}
                  >
                    <ArrowUpRight size={14} />
                  </a>
                </motion.span>
              )}
              {project.tech.map((tag, index) => (
                <motion.span
                  key={tag}
                  className="rounded-full bg-[#f2f2f2] px-3 py-1.5 text-[11px] tracking-[0.12em] text-[#3a3a3a] uppercase"
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduce ? 0 : 0.4,
                    delay: reduce ? 0 : 0.32 + index * 0.045,
                    ease: EASE,
                  }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
            {project.repoUrl && (
              <Rise delay={0.4} reduce={!!reduce} className="mt-6">
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-[#6b6b6b] transition-colors hover:text-[#141414]"
                >
                  GitHub
                  <ArrowUpRight size={14} />
                </a>
              </Rise>
            )}
          </div>

          <div
            ref={scrollerRef}
            data-lenis-prevent
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-3 pb-8 sm:px-6 md:px-6 md:pt-12 md:pr-20 md:pb-12"
          >
            <div className="flex flex-col gap-8 md:gap-10">
              {loop.map(({ frame, copy, index }) => (
                <CaseFrame
                  key={`${frame.src}-${frame.caption}-${copy}-${index}`}
                  frame={frame}
                  hidden={copy > 0}
                  reveal={copy < 2}
                  delay={0.18 + Math.min(index, 5) * 0.07}
                />
              ))}
            </div>
          </div>

          <div
            className="pointer-events-none absolute bottom-5 left-5 hidden size-7 md:block"
            aria-hidden
          >
            <svg viewBox="0 0 28 28" className="size-full -rotate-90">
              <circle
                cx="14"
                cy="14"
                r="8"
                fill="none"
                stroke="#141414"
                strokeOpacity="0.18"
                strokeWidth="1.5"
              />
              <circle
                ref={ringRef}
                cx="14"
                cy="14"
                r="8"
                fill="none"
                stroke="#141414"
                strokeWidth="1.5"
                strokeDasharray={2 * Math.PI * 8}
                strokeDashoffset={2 * Math.PI * 8}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </motion.div>
      </div>
    </div>,
    document.body,
  );
}

function Rise({
  delay,
  reduce,
  className,
  children,
}: {
  delay: number;
  reduce: boolean;
  className?: string;
  children: ReactNode;
}) {
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function CaseFrame({
  frame,
  hidden,
  reveal,
  delay,
}: {
  frame: GalleryImage;
  hidden: boolean;
  reveal: boolean;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const portrait = frame.orientation === "portrait";

  function move(event: MouseEvent<HTMLDivElement>) {
    const node = ref.current;
    const media = mediaRef.current;
    if (!node || !media) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = node.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    media.style.transform = `translate3d(${x * 10}px, ${y * 6}px, 0) scale(1.035)`;
  }

  function leave() {
    const media = mediaRef.current;
    if (!media) return;
    media.style.transform = "translate3d(0, 0, 0) scale(1.035)";
  }

  const figure = (
    <figure className={portrait ? "mx-auto w-full max-w-[26rem]" : "w-full"} aria-hidden={hidden}>
      <div className={portrait ? "mx-auto w-[min(100%,240px)]" : undefined}>
        <div
          ref={ref}
          onMouseMove={move}
          onMouseLeave={leave}
          className="overflow-hidden rounded-xl bg-[#f4f4f4]"
        >
          <div
            ref={mediaRef}
            className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            style={{ transform: "translate3d(0, 0, 0) scale(1.035)" }}
          >
            <Image
              src={frame.src}
              alt={hidden ? "" : frame.alt}
              width={1600}
              height={1000}
              sizes={portrait ? "240px" : "(min-width: 768px) 680px, 100vw"}
              className="h-auto w-full"
              style={{ width: "100%", height: "auto" }}
              draggable={false}
            />
          </div>
        </div>
      </div>
      <figcaption className={portrait ? "mt-3 px-1 text-center" : "mt-3 px-0.5"}>
        <p className="text-[11px] font-medium tracking-[0.14em] text-[#8a8a8a] uppercase">
          {frame.caption}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-[#3a3a3a]">{frame.detail}</p>
      </figcaption>
    </figure>
  );

  if (!reveal || reduce) return figure;

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.62, delay, ease: EASE }}
    >
      {figure}
    </motion.div>
  );
}
