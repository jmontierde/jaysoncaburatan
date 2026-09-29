"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { ArrowUpRight, Globe, Mail } from "lucide-react";
import { useInView } from "motion/react";
import { site } from "@/lib/content";
import { Magnetic, Reveal, buttonStyles } from "@/components/ui";
import { WebGLBoundary } from "@/components/webgl-boundary";
import { useVisualMode } from "@/components/use-visual-mode";

const ContactScene = dynamic(
  () =>
    import("@/components/scenes/contact-scene").then((mod) => mod.ContactScene),
  { ssr: false },
);

const links = [
  { label: "Email", href: `mailto:${site.email}`, icon: Mail },
  { label: "GitHub", href: site.github, icon: GitHubIcon },
  { label: "LinkedIn", href: site.linkedin, icon: LinkedInIcon },
  { label: "Portfolio", href: site.portfolio, icon: Globe },
];

function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49.99.1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V24h-4V8.5zM8.5 8.5h3.8v2.1h.05c.53-1 1.84-2.1 3.79-2.1 4.05 0 4.8 2.67 4.8 6.14V24h-4v-7.7c0-1.84-.03-4.2-2.56-4.2-2.56 0-2.95 2-2.95 4.06V24h-4V8.5z" />
    </svg>
  );
}

export function Contact() {
  const mode = useVisualMode();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "200px" });
  const webgl = mode === "full" || mode === "simple";

  return (
    <section
      id="contact"
      ref={ref}
      className="relative scroll-mt-24 overflow-hidden px-6 py-28 md:px-10 md:py-40"
    >
      {webgl && inView && (
        <WebGLBoundary fallback={null}>
          <div className="pointer-events-none absolute inset-0 opacity-70">
            <ContactScene />
          </div>
        </WebGLBoundary>
      )}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_420px_at_50%_60%,transparent,var(--background))]" />

      <div className="relative z-10 mx-auto w-full max-w-[1200px]">
        <Reveal>
          <h2 className="max-w-[12ch] text-[clamp(3rem,7vw,6.4rem)] leading-[0.92] font-medium tracking-[-0.045em]">
            Have an idea worth building?
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted md:text-xl">
            Let&apos;s turn it into something people can actually use.
          </p>
        </Reveal>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Magnetic>
            <a
              href={`mailto:${site.email}?subject=Project%20inquiry`}
              className={buttonStyles.primary}
            >
              Start a Conversation
              <ArrowUpRight size={16} />
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href={site.resume}
              target="_blank"
              rel="noreferrer"
              className={buttonStyles.ghost}
            >
              View Resume
            </a>
          </Magnetic>
        </div>

        <ul className="mt-14 flex flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:flex-wrap sm:gap-x-8">
          {links.map((link) => {
            const Icon = link.icon;
            const external = link.href.startsWith("http");
            return (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="inline-flex h-11 items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
                  {...(external
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                >
                  <Icon size={16} aria-hidden />
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>
        <p className="mt-10 text-xs tracking-wide text-muted">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </section>
  );
}
