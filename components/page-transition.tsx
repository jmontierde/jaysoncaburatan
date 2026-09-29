"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || reduce) return;
    const id = window.setTimeout(() => {
      node.style.opacity = "1";
      node.style.transform = "none";
    }, 900);
    return () => window.clearTimeout(id);
  }, [pathname, reduce]);

  if (reduce) return children;

  return (
    <motion.div
      ref={ref}
      key={pathname}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: pathname.startsWith("/work/") ? 0.4 : 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      onAnimationComplete={() => {
        const node = ref.current;
        if (!node) return;
        node.style.opacity = "1";
        node.style.transform = "none";
        window.dispatchEvent(new Event("page-settled"));
      }}
    >
      {children}
    </motion.div>
  );
}
