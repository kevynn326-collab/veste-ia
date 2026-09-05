"use client";

import { useRef } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

interface TiltOptions {
  max?: number; // max rotation in degrees
}

/**
 * Cursor-driven 3D tilt for a wrapper element via CSS transforms — no
 * WebGL involved. Disabled entirely under prefers-reduced-motion, and a
 * no-op on touch devices since there's no hover/pointer position there.
 */
export function usePointerTilt<T extends HTMLElement>({ max = 8 }: TiltOptions = {}) {
  const ref = useRef<T | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  function handlePointerMove(e: React.PointerEvent<T>) {
    if (prefersReducedMotion || e.pointerType === "touch" || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    ref.current.style.transform = `perspective(1000px) rotateY(${x * max}deg) rotateX(${-y * max}deg)`;
  }

  function handlePointerLeave() {
    if (!ref.current) return;
    ref.current.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg)";
  }

  return { ref, handlePointerMove, handlePointerLeave };
}
