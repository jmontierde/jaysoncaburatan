"use client";

import { useSyncExternalStore } from "react";

export type VisualMode = "css" | "static" | "simple" | "full";

function getMode(): VisualMode {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const narrow = window.matchMedia("(max-width: 767px)").matches;
  const tablet = window.matchMedia("(max-width: 1100px)").matches;
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  const cores = navigator.hardwareConcurrency ?? 8;

  if (reduce) return "static";
  if (narrow || connection?.saveData || cores <= 4) return "css";
  if (tablet) return "simple";
  return "full";
}

function subscribe(onStoreChange: () => void) {
  const queries = [
    window.matchMedia("(prefers-reduced-motion: reduce)"),
    window.matchMedia("(max-width: 767px)"),
    window.matchMedia("(max-width: 1100px)"),
  ];
  queries.forEach((query) => query.addEventListener("change", onStoreChange));
  return () => {
    queries.forEach((query) =>
      query.removeEventListener("change", onStoreChange),
    );
  };
}

export function useVisualMode() {
  return useSyncExternalStore(subscribe, getMode, () => "css");
}
