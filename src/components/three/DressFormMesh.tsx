"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Silhouette profile (radius, height) revolved around the Y axis — a classic tailor's dress form. */
const PROFILE: [number, number][] = [
  [0.34, -1.1],
  [0.5, -0.92],
  [0.52, -0.55],
  [0.4, -0.15],
  [0.34, 0.05],
  [0.5, 0.38],
  [0.46, 0.62],
  [0.3, 0.76],
  [0.15, 0.86],
  [0.1, 0.96],
  [0.1, 1.04],
  [0, 1.07],
];

interface DressFormMeshProps {
  color: string;
  rotationSpeed?: number;
}

export function DressFormMesh({ color, rotationSpeed = 0.18 }: DressFormMeshProps) {
  const groupRef = useRef<THREE.Group>(null);

  const latheGeometry = useMemo(() => {
    const points = PROFILE.map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(points, 48);
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={latheGeometry} castShadow receiveShadow>
        <meshStandardMaterial
          color={color}
          roughness={0.55}
          metalness={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* stand pole */}
      <mesh position={[0, -1.35, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 16]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* base */}
      <mesh position={[0, -1.62, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.06, 32]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.3} />
      </mesh>
    </group>
  );
}
