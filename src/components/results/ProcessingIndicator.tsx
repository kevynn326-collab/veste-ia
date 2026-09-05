"use client";

import { AnimatePresence, motion } from "framer-motion";

const STAGES = ["understanding", "searching", "composing"] as const;
type ProcessingStage = (typeof STAGES)[number];

export function ProcessingIndicator({
  stage,
  label,
}: {
  stage: ProcessingStage;
  label: string;
}) {
  const activeIndex = STAGES.indexOf(stage);

  return (
    <div className="mt-16 flex flex-col items-center gap-6 py-16 text-center">
      <div className="flex items-center gap-3" aria-hidden>
        {STAGES.map((s, i) => (
          <motion.span
            key={s}
            className="h-2 w-2 rounded-full bg-foreground"
            animate={{
              opacity: i <= activeIndex ? 1 : 0.25,
              scale: i === activeIndex ? [1, 1.4, 1] : 1,
            }}
            transition={
              i === activeIndex
                ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.3 }
            }
          />
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={label}
          role="status"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          className="text-muted"
        >
          {label}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
