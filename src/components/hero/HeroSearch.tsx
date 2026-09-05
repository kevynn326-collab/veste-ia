"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const SUGGESTIONS = [
  "Look para um primeiro encontro",
  "3 looks para uma viagem",
  "Roupa para entrevista",
  "Look streetwear até R$500",
  "Quero me vestir melhor",
];

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length < 3 || submitting) return;
    setSubmitting(true);
    router.push(`/results?q=${encodeURIComponent(trimmed)}`);
  }

  function applySuggestion(suggestion: string) {
    setQuery(suggestion);
    textareaRef.current?.focus();
  }

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="group">
        <div className="flex flex-col gap-3 rounded-2xl border border-border-strong bg-surface/60 p-3 shadow-[0_0_0_1px_rgba(0,0,0,0)] transition-colors focus-within:border-foreground/40 sm:flex-row sm:items-end">
          <textarea
            ref={textareaRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Quero um look para um jantar em São Paulo, até R$600."
            rows={2}
            maxLength={500}
            aria-label="Descreva o que você quer vestir"
            className="min-h-[3.5rem] flex-1 resize-none bg-transparent px-3 py-2 text-base text-foreground placeholder:text-muted focus:outline-none"
          />
          <button
            type="submit"
            disabled={query.trim().length < 3 || submitting}
            className="flex h-12 shrink-0 items-center justify-center rounded-xl bg-accent px-6 text-sm font-medium text-accent-foreground transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          >
            {submitting ? "Buscando..." : "Encontrar para mim"}
          </button>
        </div>
      </form>

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="w-full text-xs uppercase tracking-widest text-muted sm:w-auto">
          Experimente:
        </span>
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => applySuggestion(suggestion)}
            className="rounded-full border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:border-border-strong hover:text-foreground"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
