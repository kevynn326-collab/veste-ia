import type { Look } from "@/types/look";
import { DressFormPreview } from "@/components/three/DressFormPreview";
import { paletteFromColors } from "@/lib/three/colorPalette";
import { LookProductThumb } from "./LookProductThumb";

const LABEL_TEXT: Record<Look["label"], string> = {
  best_match: "Melhor combinação",
  best_value: "Melhor custo-benefício",
  most_stylish: "Mais estiloso",
};

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function LookCard({ look, budget }: { look: Look; budget?: number | null }) {
  const overBudget = Boolean(budget) && look.totalPrice > (budget as number);
  const allColors = look.products.flatMap((p) => p.colors);
  const dressFormColor = paletteFromColors(allColors);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface/30">
      <div className="relative h-56 border-b border-border bg-gradient-to-b from-surface to-background">
        <DressFormPreview color={dressFormColor} className="h-full w-full" />
        <span className="absolute left-4 top-4 rounded-full border border-border-strong bg-background/70 px-3 py-1 text-[11px] uppercase tracking-widest text-muted backdrop-blur-sm">
          {LABEL_TEXT[look.label]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="font-display text-2xl">{look.title}</h2>
        <p className="mt-3 text-sm text-muted">{look.reasoning}</p>

        <div className="mt-6 flex gap-3 overflow-x-auto pb-1">
          {look.products.map((product) => (
            <LookProductThumb key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm text-muted">Total</span>
          <span className="flex items-baseline gap-2">
            {overBudget && <span className="text-xs text-muted">acima do orçamento</span>}
            <span className="tabular-nums text-lg font-medium">
              {formatPrice(look.totalPrice)}
            </span>
          </span>
        </div>
      </div>
    </article>
  );
}
