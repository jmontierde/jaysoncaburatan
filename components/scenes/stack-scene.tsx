"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { technologies } from "@/lib/content";

const links: Array<[string, string]> = [
  ["React", "Next.js"],
  ["React", "TypeScript"],
  ["React", "React Native"],
  ["Next.js", "Vercel"],
  ["Next.js", "Tailwind CSS"],
  ["Next.js", "Convex"],
  ["Node.js", "PostgreSQL"],
  ["PostgreSQL", "Supabase"],
  ["Convex", "Clerk"],
  ["Stripe", "Next.js"],
  ["OpenAI", "Node.js"],
  ["Three.js", "React"],
  ["TypeScript", "Node.js"],
];

function Field({
  active,
  labels,
}: {
  active: string;
  labels: { current: Record<string, HTMLButtonElement | null> };
}) {
  const group = useRef<THREE.Group>(null);
  const scratch = useRef(new THREE.Vector3());
  const positions = useMemo(() => {
    return technologies.map((_, index) => {
      const angle = (index / technologies.length) * Math.PI * 2 - Math.PI / 2;
      const radius = index % 2 === 0 ? 2.35 : 1.55;
      return new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * (index % 2 === 0 ? 1.15 : 0.72),
        Math.sin(angle) * 0.45,
      );
    });
  }, []);

  const lines = useMemo(() => {
    const lookup = new Map<string, number>(
      technologies.map((item, index) => [item.name, index]),
    );
    const positionsBuffer: number[] = [];
    links.forEach(([from, to]) => {
      const a = positions[lookup.get(from) ?? -1];
      const b = positions[lookup.get(to) ?? -1];
      if (!a || !b) return;
      positionsBuffer.push(a.x, a.y, a.z, b.x, b.y, b.z);
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positionsBuffer, 3),
    );
    return new THREE.LineSegments(
      geometry,
      new THREE.LineBasicMaterial({
        color: "#e4c9a8",
        transparent: true,
        opacity: 0.28,
      }),
    );
  }, [positions]);

  useFrame((state) => {
    const groupEl = group.current;
    if (!groupEl) return;
    const x = state.pointer.x * 0.12;
    const y = state.pointer.y * 0.08;
    groupEl.rotation.y = THREE.MathUtils.lerp(groupEl.rotation.y, x, 0.04);
    groupEl.rotation.x = THREE.MathUtils.lerp(groupEl.rotation.x, -y, 0.04);
    groupEl.updateMatrixWorld();

    const { width, height } = state.size;
    if (width === 0 || height === 0) return;

    for (let index = 0; index < technologies.length; index += 1) {
      const el = labels.current[technologies[index].name];
      if (!el) continue;
      scratch.current.copy(positions[index]);
      groupEl.localToWorld(scratch.current);
      scratch.current.project(state.camera);
      const left = (scratch.current.x * 0.5 + 0.5) * width;
      const top = (-scratch.current.y * 0.5 + 0.5) * height;
      el.style.transform = `translate(${left}px, ${top}px) translate(-50%, -50%)`;
      el.style.visibility = "visible";
    }
  });

  return (
    <group ref={group}>
      <primitive object={lines} />
      {technologies.map((tech, index) => {
        const selected = active === tech.name;
        return (
          <group key={tech.name} position={positions[index]}>
            <mesh>
              <sphereGeometry args={[selected ? 0.055 : 0.035, 12, 12]} />
              <meshStandardMaterial
                color={selected ? "#e4c9a8" : "#f4f1ea"}
                emissive={selected ? "#e4c9a8" : "#000000"}
                emissiveIntensity={selected ? 0.35 : 0}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export function StackScene({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (name: string) => void;
}) {
  const labels = useRef<Record<string, HTMLButtonElement | null>>({});
  const setLabel = useMemo(() => {
    const cache = new Map<string, (node: HTMLButtonElement | null) => void>();
    return (name: string) => {
      let setter = cache.get(name);
      if (!setter) {
        setter = (node) => {
          labels.current[name] = node;
          if (node && !node.style.transform) node.style.visibility = "hidden";
        };
        cache.set(name, setter);
      }
      return setter;
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      <Canvas
        className="h-full w-full"
        camera={{ position: [0, 0, 6.4], fov: 42 }}
        dpr={[1, 1.4]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <ambientLight intensity={0.7} />
        <Field active={active} labels={labels} />
      </Canvas>
      {/*
        Labels live in this React tree. drei Html creates a second root and
        unmounts it from a layout effect, which React 19 rejects.
      */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {technologies.map((tech) => {
          const selected = active === tech.name;
          return (
            <button
              key={tech.name}
              ref={setLabel(tech.name)}
              type="button"
              onMouseEnter={() => onSelect(tech.name)}
              onFocus={() => onSelect(tech.name)}
              className={`pointer-events-auto absolute top-0 left-0 whitespace-nowrap rounded-full border px-3 py-1.5 font-sans text-[12px] tracking-wide transition-colors ${
                selected
                  ? "border-accent bg-[#1a1814] text-fg"
                  : "border-white/15 bg-[#08080a]/80 text-muted hover:text-fg"
              }`}
            >
              {tech.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
