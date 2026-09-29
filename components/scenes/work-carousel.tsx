"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import * as THREE from "three";

export type ReelSlide = {
  src: string;
  title: string;
};

function curvedPlane(width: number, height: number) {
  const geometry = new THREE.PlaneGeometry(width, height, 64, 12);
  const position = geometry.attributes.position;
  const arc = 0.78;
  const radius = width / arc;
  for (let index = 0; index < position.count; index += 1) {
    const x = position.getX(index);
    const theta = x / radius;
    position.setX(index, Math.sin(theta) * radius);
    position.setZ(index, (Math.cos(theta) - 1) * radius);
  }
  geometry.computeVertexNormals();
  return geometry;
}

function roundedAlpha() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.clearRect(0, 0, 512, 512);
  context.fillStyle = "#fff";
  context.beginPath();
  context.roundRect(4, 4, 504, 504, 36);
  context.fill();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.NoColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function coverTexture(texture: THREE.Texture, planeAspect: number) {
  const image = texture.image as HTMLImageElement | undefined;
  if (!image?.width || !image.height) return;
  const imageAspect = image.width / image.height;
  if (imageAspect > planeAspect) {
    const repeatX = planeAspect / imageAspect;
    texture.repeat.set(repeatX, 1);
    texture.offset.set((1 - repeatX) / 2, 0);
  } else {
    const repeatY = imageAspect / planeAspect;
    texture.repeat.set(1, repeatY);
    texture.offset.set(0, (1 - repeatY) / 2);
  }
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
}

function Card({
  index,
  src,
  progress,
  compact,
}: {
  index: number;
  src: string;
  progress: { current: number };
  compact: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const { gl } = useThree();
  const width = compact ? 2.35 : 3.7;
  const height = compact ? 1.48 : 2.12;
  const planeAspect = width / height;
  const geometry = useMemo(() => curvedPlane(width, height), [width, height]);
  const alpha = useMemo(() => roundedAlpha(), []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      alpha?.dispose();
    };
  }, [alpha, geometry]);

  useEffect(() => {
    let alive = true;
    let loaded: THREE.Texture | null = null;
    const loader = new THREE.TextureLoader();
    loader.load(src, (next) => {
      if (!alive) {
        next.dispose();
        return;
      }
      next.colorSpace = THREE.SRGBColorSpace;
      next.minFilter = THREE.LinearFilter;
      next.magFilter = THREE.LinearFilter;
      next.generateMipmaps = false;
      next.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
      coverTexture(next, planeAspect);
      loaded = next;
      setTexture(next);
    });
    return () => {
      alive = false;
      loaded?.dispose();
      setTexture(null);
    };
  }, [gl, planeAspect, src]);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const delta = index - progress.current;
    const distance = Math.abs(delta);
    const step = compact ? 0.64 : 0.5;
    const ring = compact ? 3.35 : 5.7;
    const angle = delta * step;
    mesh.position.set(
      Math.sin(angle) * ring,
      (compact ? 0.08 : 0.36) + Math.cos(angle) * 0.04,
      Math.cos(angle) * ring - ring,
    );
    mesh.rotation.set(0, angle, 0);
    const focus = THREE.MathUtils.clamp(1 - distance, 0, 1);
    mesh.scale.setScalar(0.92 + focus * 0.08);
    mesh.visible = Boolean(texture) && distance < 1.55;
    mesh.renderOrder = Math.round((1.6 - distance) * 10);
  });

  return (
    <mesh ref={meshRef} geometry={geometry} dispose={null} visible={false}>
      <meshBasicMaterial
        map={texture ?? undefined}
        color="#ffffff"
        alphaMap={alpha ?? undefined}
        alphaTest={alpha ? 0.5 : 0}
        toneMapped={false}
      />
    </mesh>
  );
}

function Scene({
  progress,
  slides,
  compact,
}: {
  progress: { current: number };
  slides: ReelSlide[];
  compact: boolean;
}) {
  useFrame((state) => {
    const camera = state.camera as THREE.PerspectiveCamera;
    const nextZ = compact ? 4.35 : 6.35;
    const nextY = compact ? 0.42 : 0.38;
    const nextFov = compact ? 38 : 30;
    if (Math.abs(camera.position.z - nextZ) > 0.01 || camera.fov !== nextFov) {
      camera.position.set(0, nextY, nextZ);
      camera.fov = nextFov;
      camera.updateProjectionMatrix();
    }
    camera.lookAt(0, compact ? 0.02 : 0.08, 0);
  });

  return (
    <>
      <fog attach="fog" args={["#08080a", compact ? 6 : 8.5, compact ? 11 : 14]} />
      {slides.map((slide, index) =>
        slide.src ? (
          <Card
            key={slide.src}
            index={index}
            src={slide.src}
            progress={progress}
            compact={compact}
          />
        ) : null,
      )}
      <Grid
        position={[0, compact ? -0.72 : -0.95, -0.4]}
        args={[28, 28]}
        cellSize={0.45}
        cellThickness={0.6}
        cellColor="#3f3832"
        sectionSize={2.25}
        sectionThickness={1.05}
        sectionColor="#8a7360"
        fadeDistance={compact ? 7 : 10}
        fadeStrength={1.5}
        fadeFrom={0.15}
      />
    </>
  );
}

export function WorkCarousel({
  progress,
  slides,
  compact,
}: {
  progress: { current: number };
  slides: ReelSlide[];
  compact: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0.38, 6.35], fov: 30 }}
      dpr={compact ? [1, 1.25] : [1, 1.5]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x08080a, 1);
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.NoToneMapping;
      }}
    >
      <Scene progress={progress} slides={slides} compact={compact} />
    </Canvas>
  );
}
