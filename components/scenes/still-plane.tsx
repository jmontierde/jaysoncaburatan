"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type Pointer = { x: number; y: number };

function CoverMesh({
  src,
  pointer,
  onReady,
}: {
  src: string;
  pointer: RefObject<Pointer>;
  onReady: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const onReadyRef = useRef(onReady);
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1, 1, 28, 28);
    const position = geo.attributes.position;
    for (let index = 0; index < position.count; index += 1) {
      const x = position.getX(index);
      const y = position.getY(index);
      const curve = Math.cos(x * Math.PI) * Math.cos(y * Math.PI * 0.65) * 0.075;
      position.setZ(index, curve);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

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
        loaded = next;
        setTexture(next);
        onReadyRef.current();
      });
    return () => {
      alive = false;
      loaded?.dispose();
      setTexture(null);
    };
  }, [gl, src]);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh || !texture?.image) return;
    const image = texture.image as HTMLImageElement;
    if (!image.width || !image.height) return;
    const aspect = image.width / image.height;
    const view = state.viewport;
    const viewAspect = view.width / view.height;
    let width: number;
    let height: number;
    if (aspect > viewAspect) {
      height = view.height;
      width = height * aspect;
    } else {
      width = view.width;
      height = width / aspect;
    }
    const pad = 1.12;
    mesh.scale.set(width * pad, height * pad, 1);
    const aimX = pointer.current?.x ?? 0;
    const aimY = pointer.current?.y ?? 0;
    const verticalCrop = Math.max(0, (height * pad - view.height) / 2);
    mesh.rotation.y = THREE.MathUtils.damp(mesh.rotation.y, aimX * 0.06, 3, delta);
    mesh.rotation.x = THREE.MathUtils.damp(mesh.rotation.x, -aimY * 0.04, 3, delta);
    mesh.position.x = THREE.MathUtils.damp(mesh.position.x, aimX * 0.05, 3, delta);
    mesh.position.y = THREE.MathUtils.damp(
      mesh.position.y,
      -verticalCrop + aimY * 0.04,
      3,
      delta,
    );
  });

  if (!texture) return null;

  return (
    <mesh ref={meshRef} geometry={geometry} dispose={null}>
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

export function StillPlane({
  src,
  pointer,
  onReady,
}: {
  src: string;
  pointer: RefObject<Pointer>;
  onReady: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "160px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="pointer-events-none h-full w-full" aria-hidden>
      <Canvas
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0, 2.4], fov: 32 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.NoToneMapping;
        }}
      >
        <CoverMesh src={src} pointer={pointer} onReady={onReady} />
      </Canvas>
    </div>
  );
}
