"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="group relative font-display text-lg tracking-tight">
          AI Fashion Shopping
          <motion.span
            aria-hidden
            className="absolute -bottom-1 left-0 h-px w-full origin-left bg-foreground/40"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </Link>
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-full border border-border-strong px-3 py-1 text-xs uppercase tracking-widest text-muted"
        >
          Beta
        </motion.span>
      </div>
      <div
        aria-hidden
        className="h-px w-full bg-gradient-to-r from-transparent via-foreground/20 to-transparent"
      />
    </header>
  );
}
