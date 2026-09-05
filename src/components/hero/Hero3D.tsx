"use client";

import { DressFormPreview } from "@/components/three/DressFormPreview";
import { usePointerTilt } from "@/hooks/usePointerTilt";

/**
 * Decorative dress form for the hero — off-white/neutral, not tied to any
 * specific look. Purely atmospheric: it signals "an AI stylist is here",
 * not a literal preview of anything. Hidden on small screens per the
 * mobile-performance rule (item 27 of the architecture doc).
 */
export function Hero3D() {
  const { ref, handlePointerMove, handlePointerLeave } = usePointerTilt<HTMLDivElement>({
    max: 5,
  });

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="pointer-events-auto hidden h-[420px] w-[420px] shrink-0 transition-transform duration-200 ease-out will-change-transform lg:block"
    >
      <div className="relative h-full w-full">
        <div
          aria-hidden
          className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(245,243,239,0.12),transparent_65%)]"
        />
        <DressFormPreview color="#ece7dd" rotationSpeed={0.12} cameraDistance={3.6} className="h-full w-full" />
      </div>
    </div>
  );
}
