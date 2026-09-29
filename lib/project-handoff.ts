export type ProjectHandoff = {
  slug: string;
  src: string;
  alt: string;
  rect: {
    top: number;
    left: number;
    width: number;
    height: number;
    radius: number;
  };
};

let current: ProjectHandoff | null = null;
const listeners = new Set<() => void>();

export function getHandoff() {
  return current;
}

export function beginHandoff(next: ProjectHandoff) {
  current = next;
  listeners.forEach((listener) => listener());
}

export function clearHandoff() {
  current = null;
  listeners.forEach((listener) => listener());
}

export function subscribeHandoff(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
