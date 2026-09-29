"use client";

import { useRef, type MouseEvent, type ReactNode, type RefObject } from "react";
import Link from "next/link";
import { getLenis } from "@/components/smooth-scroll";
import { beginHandoff } from "@/lib/project-handoff";

export function ProjectLink({
  href,
  slug,
  src,
  sourceRef,
  className,
  children,
}: {
  href: string;
  slug: string;
  src: string;
  sourceRef?: RefObject<HTMLElement | null>;
  className?: string;
  children: ReactNode;
}) {
  const selfRef = useRef<HTMLAnchorElement>(null);

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const source = sourceRef?.current ?? selfRef.current;
    if (!source || !src) return;
    const rect = source.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;
    event.preventDefault();
    event.stopPropagation();
    const radius = Number.parseFloat(getComputedStyle(source).borderRadius) || 0;
    getLenis()?.stop();
    beginHandoff({
      slug,
      src,
      alt: "",
      rect: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        radius,
      },
    });
  }

  return (
    <Link href={href} ref={selfRef} onClick={onClick} className={className}>
      {children}
    </Link>
  );
}
