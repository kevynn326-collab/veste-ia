"use client";

import { Canvas } from "@react-three/fiber";
import { DressFormMesh } from "./DressFormMesh";

interface DressFormSceneProps {
  color: string;
  rotationSpeed?: number;
  cameraDistance?: number;
}

export function DressFormScene({
  color,
  rotationSpeed,
  cameraDistance = 3.2,
}: DressFormSceneProps) {
  return (
    <Canvas
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.15, cameraDistance], fov: 32 }}
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.65} />
      <directionalLight position={[2, 3, 2]} intensity={1.1} />
      <pointLight position={[-2, 0, -2]} intensity={0.4} color="#ffffff" />
      <DressFormMesh color={color} rotationSpeed={rotationSpeed} />
    </Canvas>
  );
}
