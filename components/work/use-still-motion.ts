"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function scrubStills(root: HTMLElement, amount: number) {
  root.querySelectorAll<HTMLElement>("[data-still]").forEach((still) => {
    if (still.closest("[data-project-hero], [data-reel]")) return;
    gsap.fromTo(
      still,
      { scale: amount },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: still.closest("[data-frame]") ?? still,
          start: "top bottom",
          end: "center center",
          scrub: 0.65,
        },
      },
    );
  });
}

function settleHero(root: HTMLElement) {
  const frame = root.querySelector<HTMLElement>("[data-project-frame]");
  const trigger = root.querySelector<HTMLElement>("[data-project-hero]");
  if (!frame || !trigger) return;
  gsap.fromTo(
    frame,
    { scale: 1, borderRadius: 0 },
    {
      scale: 0.92,
      borderRadius: 28,
      ease: "none",
      transformOrigin: "center center",
      scrollTrigger: {
        trigger,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
      },
    },
  );
}

function bindPointer(root: HTMLElement) {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const cleanups: Array<() => void> = [];
  root.querySelectorAll<HTMLElement>("[data-frame]").forEach((frame) => {
    const shift = frame.querySelector<HTMLElement>("[data-shift]");
    if (!shift || frame.closest("[data-project-hero]")) return;
    const onMove = (event: PointerEvent) => {
      const bounds = frame.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 14;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 10;
      gsap.to(shift, { x, y, duration: 0.7, ease: "power3.out", overwrite: "auto" });
    };
    const onLeave = () => {
      gsap.to(shift, { x: 0, y: 0, duration: 0.8, ease: "power3.out", overwrite: "auto" });
    };
    frame.addEventListener("pointermove", onMove);
    frame.addEventListener("pointerleave", onLeave);
    cleanups.push(() => {
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerleave", onLeave);
    });
  });
  return () => cleanups.forEach((cleanup) => cleanup());
}

function pinReel(root: HTMLElement) {
  const reel = root.querySelector<HTMLElement>("[data-reel]");
  const track = root.querySelector<HTMLElement>("[data-reel-track]");
  if (!reel || !track) return;
  gsap.to(track, {
    x: () => -Math.max(0, track.scrollWidth - window.innerWidth + 64),
    ease: "none",
    scrollTrigger: {
      trigger: reel,
      start: "top top",
      end: () => `+=${Math.max(window.innerHeight * 0.6, track.scrollWidth - window.innerWidth)}`,
      pin: true,
      scrub: 0.75,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
}

export function useStillMotion(scope: RefObject<HTMLElement | null>, key: string) {
  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (connection?.saveData) return;

    let media: gsap.MatchMedia | null = null;

    const start = () => {
      media?.revert();
      media = gsap.matchMedia();
      media.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        scrubStills(root, 1.06);
      });
      media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        scrubStills(root, 1.12);
        settleHero(root);
        return bindPointer(root);
      });
      media.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          pinReel(root);
        },
      );
      ScrollTrigger.refresh();
    };

    const failsafe = window.setTimeout(start, 900);
    const onSettled = () => {
      window.clearTimeout(failsafe);
      start();
    };
    window.addEventListener("page-settled", onSettled);

    return () => {
      window.removeEventListener("page-settled", onSettled);
      window.clearTimeout(failsafe);
      media?.revert();
    };
  }, [scope, key]);
}
