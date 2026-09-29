"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { getLenis } from "@/components/smooth-scroll";
import {
  clearHandoff,
  getHandoff,
  subscribeHandoff,
  type ProjectHandoff,
} from "@/lib/project-handoff";

export function TransitionLayer() {
  const router = useRouter();
  const [handoff, setHandoff] = useState<ProjectHandoff | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const phase = useRef<"idle" | "expanding" | "holding">("idle");
  const tween = useRef<gsap.core.Tween | null>(null);

  useEffect(() => subscribeHandoff(() => setHandoff(getHandoff())), []);

  useLayoutEffect(() => {
    const node = frameRef.current;
    if (!handoff || !node) return;
    phase.current = "expanding";
    tween.current?.kill();
    const travel = gsap.to(node, {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      borderRadius: 0,
      duration: 0.78,
      ease: "expo.inOut",
      overwrite: "auto",
      onComplete: () => {
        if (phase.current === "idle") return;
        phase.current = "holding";
        getLenis()?.scrollTo(0, { immediate: true, force: true });
        window.scrollTo(0, 0);
        router.push(`/work/${handoff.slug}`);
      },
    });
    tween.current = travel;
    return () => {
      travel.kill();
    };
  }, [handoff, router]);

  useEffect(() => {
    if (!handoff) return;
    const slug = handoff.slug;
    const failsafe = window.setTimeout(() => {
      if (getHandoff()?.slug !== slug) return;
      phase.current = "idle";
      clearHandoff();
      getLenis()?.start();
    }, 2800);

    const onSettled = () => {
      if (phase.current !== "holding") return;
      const node = frameRef.current;
      if (!node) return;
      window.clearTimeout(failsafe);
      getLenis()?.scrollTo(0, { immediate: true, force: true });
      tween.current?.kill();
      tween.current = gsap.to(node, {
        opacity: 0,
        duration: 0.45,
        delay: 0.06,
        ease: "power2.out",
        onComplete: () => {
          phase.current = "idle";
          clearHandoff();
          getLenis()?.start();
        },
      });
    };

    window.addEventListener("page-settled", onSettled);
    return () => {
      window.removeEventListener("page-settled", onSettled);
      window.clearTimeout(failsafe);
    };
  }, [handoff]);

  if (!handoff) return null;

  return (
    <div className="pointer-events-auto fixed inset-0 z-[70]" aria-hidden>
      <div
        ref={frameRef}
        className="absolute overflow-hidden bg-[#0c0c0e]"
        style={{
          top: handoff.rect.top,
          left: handoff.rect.left,
          width: handoff.rect.width,
          height: handoff.rect.height,
          borderRadius: handoff.rect.radius,
        }}
      >
        <Image
          src={handoff.src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}
