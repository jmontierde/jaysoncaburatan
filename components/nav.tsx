"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { scrollToTarget, setScrollLocked } from "@/components/smooth-scroll";
import { FillLink } from "@/components/ui";
import { navItems, site } from "@/lib/content";

const ease = [0.22, 1, 0.36, 1] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const marker = window.innerHeight * 0.34;
      const sections = navItems
        .map((item) => document.getElementById(item.id))
        .filter((node): node is HTMLElement => Boolean(node))
        .sort((a, b) => a.offsetTop - b.offsetTop);
      let current: string | null = null;
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

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5 md:pt-4">
        <motion.header
          className={`pointer-events-auto relative mx-auto flex h-14 w-full max-w-[1100px] items-center justify-between gap-3 rounded-full border px-2 transition-[background-color,box-shadow,border-color] duration-500 sm:px-2.5 ${
            scrolled || open
              ? "border-line bg-bg/85 shadow-[0_16px_50px_-24px_rgba(0,0,0,0.75)] backdrop-blur-xl"
              : "border-line/80 bg-bg/45 backdrop-blur-xl"
          }`}
          initial={reduce ? false : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: reduce ? 0 : 0.04, ease }}
        >
          <a
            href="/#home"
            onClick={(event) => go(event, "home")}
            className="flex min-w-0 items-center gap-2.5 rounded-full py-1 pr-2 pl-1.5"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line font-mono text-[10px] tracking-[0.14em] text-accent">
              JC
            </span>
            <span className="truncate text-sm font-medium tracking-tight text-fg">
              {site.name}
            </span>
          </a>

          <nav
            className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-0.5 lg:flex"
            aria-label="Primary"
          >
            {navItems.map((item) => {
              const current = active === item.id;
              return (
                <a
                  key={item.id}
                  href={`/#${item.id}`}
                  onClick={(event) => go(event, item.id)}
                  aria-current={current ? "location" : undefined}
                  className={`relative rounded-full px-3.5 py-2 text-sm transition-colors duration-300 ${
                    current ? "text-fg" : "text-muted hover:text-fg"
                  }`}
                >
                  {current && (
                    <motion.span
                      layoutId="nav-current"
                      className="absolute inset-0 rounded-full bg-white/[0.07]"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <div className="hidden sm:block">
              <FillLink
                href="/#contact"
                size="sm"
                onClick={(event) => go(event, "contact")}
              >
                Let&apos;s Work Together
                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </FillLink>
            </div>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-full text-fg lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </motion.header>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            className="fixed inset-0 z-40 flex flex-col justify-center bg-bg px-8 pt-20 lg:hidden"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.35, ease }}
          >
            <div className="mx-auto flex w-full max-w-sm flex-col gap-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: reduce ? 0 : 0.05 + index * 0.045,
                    ease,
                  }}
                >
                  <a
                    href={`/#${item.id}`}
                    onClick={(event) => go(event, item.id)}
                    className="block py-2 text-4xl tracking-tight text-fg"
                  >
                    {item.label}
                  </a>
                </motion.div>
              ))}
              <motion.div
                className="mt-8"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: reduce ? 0 : 0.26, ease }}
              >
                <FillLink
                  href="/#contact"
                  onClick={(event) => go(event, "contact")}
                  className="w-full"
                >
                  Let&apos;s Work Together
                  <ArrowUpRight size={16} />
                </FillLink>
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
