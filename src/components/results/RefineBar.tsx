"use client";

import { useEffect, useState } from "react";
import type { Gender } from "@/types/product";
import type { Intent } from "@/types/intent";

const GENDER_OPTIONS: { value: Gender | null; label: string }[] = [
  { value: null, label: "Qualquer" },
  { value: "female", label: "Feminino" },
  { value: "male", label: "Masculino" },
  { value: "unisex", label: "Unissex" },
];

interface RefineBarProps {
  intent: Intent;
  disabled?: boolean;
  onApply: (intent: Intent) => void;
}

export function RefineBar({ intent, disabled, onApply }: RefineBarProps) {
  const [gender, setGender] = useState(intent.gender);
  const [budget, setBudget] = useState(intent.budget);
  const [style, setStyle] = useState(intent.style);
  const [newStyle, setNewStyle] = useState("");

  useEffect(() => {
    setGender(intent.gender);
    setBudget(intent.budget);
    setStyle(intent.style);
  }, [intent]);

  const isDirty =
    gender !== intent.gender ||
    budget !== intent.budget ||
    style.length !== intent.style.length ||
    style.some((s, i) => s !== intent.style[i]);

  function addStyle() {
    const trimmed = newStyle.trim().toLowerCase();
    if (trimmed && !style.includes(trimmed)) {
      setStyle([...style, trimmed]);
    }
    setNewStyle("");
  }

  function removeStyle(tag: string) {
    setStyle(style.filter((s) => s !== tag));
  }

  function apply() {
    onApply({ ...intent, gender, budget, style });
  }

  return (
    <div className="flex flex-wrap items-end gap-6 rounded-2xl border border-border p-5">
      <div>
        <span className="block text-xs uppercase tracking-widest text-muted">Gênero</span>
        <div className="mt-2 flex gap-1">
          {GENDER_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => setGender(opt.value)}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                gender === opt.value
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted hover:border-border-strong"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-muted" htmlFor="refine-budget">
          Orçamento
        </label>
        <div className="mt-2 flex items-center gap-1 rounded-full border border-border px-3 py-1.5">
          <span className="text-xs text-muted">R$</span>
          <input
            id="refine-budget"
            type="number"
            min={0}
            step={50}
            value={budget ?? ""}
            onChange={(e) => setBudget(e.target.value ? Number(e.target.value) : null)}
            placeholder="sem limite"
            className="w-24 bg-transparent text-sm focus:outline-none"
          />
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <span className="block text-xs uppercase tracking-widest text-muted">Estilo</span>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {style.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => removeStyle(tag)}
              aria-label={`Remover estilo ${tag}`}
              className="flex items-center gap-1 rounded-full border border-border-strong px-3 py-1.5 text-xs hover:border-foreground/60"
            >
              {tag}
              <span aria-hidden>×</span>
            </button>
          ))}
          <input
            value={newStyle}
            onChange={(e) => setNewStyle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addStyle();
              }
            }}
            onBlur={addStyle}
            aria-label="Adicionar estilo"
            placeholder="+ adicionar"
            className="w-24 bg-transparent px-2 py-1.5 text-xs text-muted placeholder:text-muted focus:outline-none"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={apply}
        disabled={!isDirty || disabled}
        className="ml-auto rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
      >
        Atualizar busca
      </button>
    </div>
  );
}
