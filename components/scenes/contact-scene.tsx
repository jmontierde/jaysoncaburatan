"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Field() {
  const group = useRef<THREE.Group>(null);
  const geometry = useMemo(() => {
    const count = 280;
    const positions = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const turn = (index / count) * Math.PI * 8;
      const radius = 1.15 + (index % 7) * 0.18;
      positions[index * 3] = Math.cos(turn) * radius;
      positions[index * 3 + 1] = (index / count - 0.5) * 2.4;
      positions[index * 3 + 2] = Math.sin(turn) * radius;
    }
    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return buffer;
  }, []);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.08;
    group.current.rotation.x = Math.sin(group.current.rotation.y) * 0.08;
  });

  return (
    <group ref={group}>
      <points geometry={geometry}>
        <pointsMaterial
          color="#e4c9a8"
          size={0.018}
          transparent
          opacity={0.55}
          sizeAttenuation
        />
      </points>
      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[1.7, 0.006, 12, 80]} />
        <meshBasicMaterial color="#f4f1ea" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

export function ContactScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.6], fov: 45 }}
      dpr={[1, 1.25]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      aria-hidden
    >
      <Field />
    </Canvas>
  );
}
