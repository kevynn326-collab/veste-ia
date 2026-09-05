"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Intent } from "@/types/intent";
import type { Look } from "@/types/look";
import { FadeIn } from "@/components/motion/FadeIn";
import { LookCard } from "./LookCard";
import { ProcessingIndicator } from "./ProcessingIndicator";
import { RefineBar } from "./RefineBar";

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

type Stage = "idle" | "understanding" | "searching" | "composing" | "done" | "error";

type SearchEvent =
  | { stage: "understanding" | "searching" | "composing" }
  | { stage: "done"; intent: Intent; looks: Look[] }
  | { stage: "error"; message: string };

const STAGE_LABELS: Record<Stage, string> = {
  idle: "",
  understanding: "Entendendo seu estilo…",
  searching: "Encontrando peças compatíveis…",
  composing: "Montando seus looks…",
  done: "Encontramos opções para você.",
  error: "Algo deu errado.",
};

interface ResultsViewProps {
  initialQuery: string;
}

export function ResultsView({ initialQuery }: ResultsViewProps) {
  const [stage, setStage] = useState<Stage>("idle");
  const [intent, setIntent] = useState<Intent | null>(null);
  const [looks, setLooks] = useState<Look[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const runIdRef = useRef(0);

  const runSearch = useCallback(
    async (body: { query: string; intent?: Intent }) => {
      const runId = ++runIdRef.current;
      setStage(body.intent ? "searching" : "understanding");
      setErrorMessage(null);

      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!response.ok || !response.body) {
          const errBody = await response.json().catch(() => null);
          throw new Error(errBody?.error ?? "Falha ao buscar looks.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (runIdRef.current !== runId) return; // a newer search superseded this one

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.trim()) continue;
            const event = JSON.parse(line) as SearchEvent;

            if (event.stage === "error") {
              setStage("error");
              setErrorMessage(event.message);
            } else if (event.stage === "done") {
              setIntent(event.intent);
              setLooks(event.looks);
              setStage("done");
            } else {
              setStage(event.stage);
            }
          }
        }
      } catch (error) {
        if (runIdRef.current !== runId) return;
        setStage("error");
        setErrorMessage(error instanceof Error ? error.message : "Falha ao buscar looks.");
      }
    },
    [],
  );

  useEffect(() => {
    if (!initialQuery) return;
    setLooks([]);
    setIntent(null);
    runSearch({ query: initialQuery });
  }, [initialQuery, runSearch]);

  function handleRefine(updatedIntent: Intent) {
    runSearch({ query: initialQuery, intent: updatedIntent });
  }

  if (!initialQuery) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center text-muted">
        Volte para a home e descreva o que você quer vestir.
      </div>
    );
  }

  const isRefining = intent !== null && stage !== "done" && stage !== "error";

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <FadeIn>
        <p className="text-xs uppercase tracking-[0.3em] text-muted">Curadoria da IA</p>
        <h1 className="font-display mt-3 max-w-2xl text-2xl sm:text-3xl">
          &ldquo;{initialQuery}&rdquo;
        </h1>
      </FadeIn>

      {stage !== "done" && stage !== "error" && (
        <ProcessingIndicator
          stage={stage === "idle" ? "understanding" : (stage as "understanding" | "searching" | "composing")}
          label={STAGE_LABELS[stage]}
        />
      )}

      {stage === "error" && (
        <div className="mt-16 rounded-2xl border border-border p-8 text-center">
          <p className="text-foreground">{errorMessage}</p>
        </div>
      )}

      {intent && (stage === "done" || isRefining) && (
        <div className="mt-10">
          {(intent.occasion || intent.location) && (
            <p className="mb-3 text-xs text-muted">
              {[intent.occasion, intent.location].filter(Boolean).join(" · ")}
            </p>
          )}
          <RefineBar intent={intent} disabled={isRefining} onApply={handleRefine} />
        </div>
      )}

      {stage === "done" && (
        <div className="mt-10">
          <p className="text-muted">
            {looks.length > 0
              ? "Encontramos algumas opções para você."
              : "Não encontramos looks suficientes para esse pedido — tente ajustar o orçamento ou o estilo."}
          </p>

          <motion.div
            className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3"
            variants={gridVariants}
            initial="hidden"
            animate="show"
          >
            {looks.map((look) => (
              <motion.div key={look.label} variants={cardVariants}>
                <LookCard look={look} budget={intent?.budget} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
}
