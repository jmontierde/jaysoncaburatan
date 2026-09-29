"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

export function getLenis() {
  return lenis;
}

export function scrollToTarget(target: string | HTMLElement | number) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (lenis && !reduce) {
    lenis.scrollTo(target, { duration: 1.05, force: true });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "auto" });
    return;
  }
  const node = typeof target === "string" ? document.querySelector(target) : target;
  node?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

export function setScrollLocked(locked: boolean) {
  if (!lenis) return;
  if (locked) lenis.stop();
  else lenis.start();
}

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const instance = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      syncTouch: false,
      autoRaf: false,
      stopInertiaOnNavigate: true,
    });
    lenis = instance;
    instance.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("page-settled", refresh);

    const onAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const origin = event.target;
      if (!(origin instanceof Element)) return;
      const anchor = origin.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname !== window.location.pathname || !url.hash) return;
      const target = document.querySelector(url.hash);
      if (!target) return;
      event.preventDefault();
      scrollToTarget(url.hash);
      history.pushState(null, "", `${url.pathname}${url.hash}`);
    };
    document.addEventListener("click", onAnchorClick);

    const timer = window.setTimeout(refresh, 500);

    return () => {
      window.removeEventListener("page-settled", refresh);
      document.removeEventListener("click", onAnchorClick);
      window.clearTimeout(timer);
      gsap.ticker.remove(onTick);
      instance.destroy();
      if (lenis === instance) lenis = null;
    };
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const timer = window.setTimeout(() => scrollToTarget(hash), 120);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
