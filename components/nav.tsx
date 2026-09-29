"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { scrollToTarget, setScrollLocked } from "@/components/smooth-scroll";
import { navItems, site } from "@/lib/content";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const marker = window.innerHeight * 0.32;
      const sections = navItems
        .map((item) => document.getElementById(item.id))
        .filter((node): node is HTMLElement => Boolean(node))
        .sort((a, b) => a.offsetTop - b.offsetTop);
      let current = sections[0]?.id ?? "home";
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= marker) current = section.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setScrollLocked(open);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      setScrollLocked(false);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function go(event: MouseEvent<HTMLAnchorElement>, id: string) {
    setOpen(false);
    if (window.location.pathname !== "/") return;
    event.preventDefault();
    event.stopPropagation();
    scrollToTarget(`#${id}`);
    history.replaceState(null, "", `/#${id}`);
  }

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-line bg-bg/75 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-6 md:h-[4.5rem] md:px-10 lg:px-0">
        <Link
          href="/#home"
          onClick={(event) => go(event, "home")}
          className="text-sm font-medium tracking-tight text-fg"
        >
          {site.name}
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {navItems.map((item) => {
            const current = active === item.id;
            return (
              <Link
                key={item.id}
                href={`/#${item.id}`}
                onClick={(event) => go(event, item.id)}
                aria-current={current ? "true" : undefined}
                className={`relative px-3 py-2 text-sm transition-colors ${
                  current ? "text-fg" : "text-muted hover:text-fg"
                }`}
              >
                {item.label}
                {current && (
                  <motion.span
                    layoutId="nav-current"
                    className="absolute inset-x-3 bottom-1 h-px bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-full border border-line text-fg md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

    </header>
      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="fixed inset-0 z-40 flex flex-col justify-center gap-1 bg-bg px-8 pt-16 md:hidden"
        >
          {navItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: reduce ? 0 : 0.04 + index * 0.045,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                href={`/#${item.id}`}
                onClick={(event) => go(event, item.id)}
                className="block py-2 text-4xl tracking-tight text-fg"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>
      )}
    </>
  );
}
