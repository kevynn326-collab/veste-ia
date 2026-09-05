"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** Centralizes prefers-reduced-motion handling for every Framer Motion animation in the app. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
