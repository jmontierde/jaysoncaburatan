"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
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
  onSelect,
}: {
  active: string;
  onSelect: (name: string) => void;
}) {
  const group = useRef<THREE.Group>(null);
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
    if (!group.current) return;
    const x = state.pointer.x * 0.12;
    const y = state.pointer.y * 0.08;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      x,
      0.04,
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -y,
      0.04,
    );
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
            <Html center zIndexRange={[20, 0]} style={{ pointerEvents: "auto" }}>
              <button
                type="button"
                onMouseEnter={() => onSelect(tech.name)}
                onFocus={() => onSelect(tech.name)}
                className={`whitespace-nowrap rounded-full border px-3 py-1.5 font-sans text-[12px] tracking-wide transition-colors ${
                  selected
                    ? "border-accent bg-[#1a1814] text-fg"
                    : "border-white/15 bg-[#08080a]/80 text-muted hover:text-fg"
                }`}
              >
                {tech.name}
              </button>
            </Html>
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
  return (
    <Canvas
      camera={{ position: [0, 0, 6.4], fov: 42 }}
      dpr={[1, 1.4]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <ambientLight intensity={0.7} />
      <Field active={active} onSelect={onSelect} />
    </Canvas>
  );
}
