"use client";

import type { ReactNode } from "react";
import { PageTransition } from "@/components/page-transition";
import { ScrollMotion } from "@/components/scroll-motion";

export default function Template({ children }: { children: ReactNode }) {
  return (
    <PageTransition>
      {children}
      <ScrollMotion />
    </PageTransition>
  );
}
