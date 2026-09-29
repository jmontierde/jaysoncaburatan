"use client";

import { useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Pointer = { x: number; y: number };

function Lattice({
  detail,
  pointer,
}: {
  detail: "full" | "simple";
  pointer: RefObject<Pointer>;
}) {
  const group = useRef<THREE.Group>(null);
  const count = detail === "full" ? 18 : 10;

  const nodes = useMemo(() => {
    return Array.from({ length: count }, (_, index) => {
      const phi = Math.acos(1 - (2 * (index + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * index;
      return new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta),
      ).multiplyScalar(1.85);
    });
  }, [count]);

  const lines = useMemo(() => {
    const positions: number[] = [];
    nodes.forEach((point, index) => {
      positions.push(0, 0, 0, point.x, point.y, point.z);
      const next = nodes[(index + 1) % nodes.length];
      if (point.distanceTo(next) < 2.15) {
        positions.push(point.x, point.y, point.z, next.x, next.y, next.z);
      }
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    const material = new THREE.LineBasicMaterial({
      color: "#e4c9a8",
      transparent: true,
      opacity: 0.38,
    });
    return new THREE.LineSegments(geometry, material);
  }, [nodes]);

  useFrame((state, delta) => {
    const current = group.current;
    if (!current) return;
    const targetX = (pointer.current?.y ?? 0) * 0.28;
    const targetY =
      state.clock.elapsedTime * 0.08 + (pointer.current?.x ?? 0) * 0.4;
    current.rotation.x = THREE.MathUtils.damp(
      current.rotation.x,
      targetX,
      2.4,
      delta,
    );
    current.rotation.y = THREE.MathUtils.damp(
      current.rotation.y,
      targetY,
      2.4,
      delta,
    );
    current.position.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.08;
  });

  return (
    <group ref={group} position={[0.35, 0.15, 0]}>
      <primitive object={lines} />
      <mesh>
        <icosahedronGeometry args={[0.78, 1]} />
        <meshStandardMaterial color="#e4c9a8" wireframe />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial color="#1c1a17" metalness={0.85} roughness={0.22} />
      </mesh>
      {nodes.map((point, index) => (
        <mesh key={index} position={point}>
          <sphereGeometry args={[0.028, 10, 10]} />
          <meshStandardMaterial color="#f4f1ea" />
        </mesh>
      ))}
      {detail === "full" && (
        <>
          <FloatingPane position={[-1.7, 0.9, -0.4]} speed={0.18} />
          <FloatingPane position={[1.55, -0.85, 0.35]} speed={0.12} />
        </>
      )}
    </group>
  );
}

function FloatingPane({
  position,
  speed,
}: {
  position: [number, number, number];
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * speed;
    ref.current.rotation.y = state.clock.elapsedTime * speed * 0.7;
  });

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.42, 0.42, 0.42]} />
      <meshStandardMaterial color="#d9c2a2" wireframe />
    </mesh>
  );
}

export function HeroScene({
  detail,
  pointer,
  onReady,
}: {
  detail: "full" | "simple";
  pointer: RefObject<Pointer>;
  onReady?: () => void;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0.1, 5.1], fov: 38 }}
      dpr={detail === "full" ? [1, 1.5] : [1, 1.2]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        onReady?.();
      }}
      aria-hidden
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 3, 4]} intensity={1.4} />
      <pointLight position={[-2, -1, 2]} intensity={0.4} color="#e4c9a8" />
      <Lattice detail={detail} pointer={pointer} />
    </Canvas>
  );
}
