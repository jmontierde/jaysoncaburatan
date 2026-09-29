"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const ease = "power3.out";

export function ScrollMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const root = document.getElementById("content");
    if (!root) return;

    document.documentElement.classList.add("gsap-on");
    const splits: SplitText[] = [];
    const rules: HTMLElement[] = [];

    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>("section:not(#home)").forEach((section) => {
        const rule = document.createElement("span");
        rule.className = "cine-rule";
        rule.setAttribute("aria-hidden", "true");
        section.prepend(rule);
        rules.push(rule);
        gsap.from(rule, {
          scaleX: 0,
          duration: desktop ? 1.15 : 0.7,
          ease: "power2.inOut",
          scrollTrigger: { trigger: section, start: "top 82%", once: true },
        });
      });

      root.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
        const heading = desktop ? el.querySelector("h1, h2") : null;
        if (heading && heading.textContent && heading.textContent.trim().length > 0) {
          const split = SplitText.create(heading, {
            type: "words",
            mask: "words",
          });
          splits.push(split);
          gsap.from(split.words, {
            yPercent: 110,
            duration: 0.85,
            ease,
            stagger: Math.min(0.04, 0.45 / Math.max(split.words.length, 1)),
            scrollTrigger: { trigger: heading, start: "top 88%", once: true },
          });
        }

        gsap.from(el, {
          y: desktop ? 28 : 14,
          opacity: 0,
          duration: desktop ? 0.9 : 0.55,
          ease,
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });

      if (desktop && fine) {
        root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: 4 },
            {
              yPercent: -6,
              ease: "none",
              scrollTrigger: {
                trigger: el.closest("section, figure, article") ?? el,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.7,
              },
            },
          );
        });

        const heroVisual = document.querySelector<HTMLElement>("[data-hero-visual]");
        const hero = document.getElementById("home");
        if (heroVisual && hero) {
          gsap.to(heroVisual, {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      }
    }, root);

    ScrollTrigger.refresh();
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 700);
    const onSettled = () => ScrollTrigger.refresh();
    window.addEventListener("page-settled", onSettled);

    const failsafe = window.setTimeout(() => {
      root.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
        const rect = el.getBoundingClientRect();
        const seen = rect.top < window.innerHeight * 0.95 && rect.bottom > 0;
        const opacity = Number(gsap.getProperty(el, "opacity"));
        if (seen && opacity < 0.2) {
          gsap.set(el, { clearProps: "opacity,transform" });
        }
      });
    }, 1600);

    return () => {
      window.removeEventListener("page-settled", onSettled);
      window.clearTimeout(refresh);
      window.clearTimeout(failsafe);
      splits.forEach((split) => split.revert());
      rules.forEach((rule) => rule.remove());
      ctx.revert();
      document.documentElement.classList.remove("gsap-on");
    };
  }, [pathname]);

  return null;
}
