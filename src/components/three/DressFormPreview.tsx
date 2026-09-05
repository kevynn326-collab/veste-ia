"use client";

import dynamic from "next/dynamic";
import { useIsMobileViewport } from "@/hooks/useIsMobileViewport";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";
import { DressFormFallback } from "./DressFormFallback";

const DressFormScene = dynamic(
  () => import("./DressFormScene").then((mod) => mod.DressFormScene),
  { ssr: false },
);

interface DressFormPreviewProps {
  color: string;
  rotationSpeed?: number;
  cameraDistance?: number;
  className?: string;
}

/**
 * Decorative 3D dress form — not a literal render of the recommended garments
 * (that would need per-product 3D assets or an AI try-on pipeline, neither of
 * which exist yet). Tinted to the look's dominant color, it gives the result
 * a "presented on a mannequin" feel without overclaiming accuracy.
 *
 * There are at most a handful of these on any page (one hero + up to three
 * look cards), so it mounts as soon as WebGL support is confirmed rather
 * than gating on scroll visibility — one less async dependency to get wrong
 * for a purely decorative element. WebGL is skipped entirely on small
 * viewports (architecture item 27: reduce heavy 3D on mobile) — the static
 * tinted silhouette below covers that case.
 */
export function DressFormPreview({
  color,
  rotationSpeed,
  cameraDistance,
  className,
}: DressFormPreviewProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const webglSupported = useWebGLSupport();
  const isMobileViewport = useIsMobileViewport();

  const canRender3D = webglSupported && !prefersReducedMotion && !isMobileViewport;

  return (
    <div className={`relative ${className ?? ""}`}>
      {canRender3D ? (
        <DressFormScene
          color={color}
          rotationSpeed={rotationSpeed}
          cameraDistance={cameraDistance}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center p-6">
          <DressFormFallback color={color} />
        </div>
      )}
    </div>
  );
}
