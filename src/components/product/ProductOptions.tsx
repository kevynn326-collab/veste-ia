"use client";

import { useState } from "react";
import { ColorSwatch } from "./ColorSwatch";

interface ProductOptionsProps {
  colors: string[];
  sizes: string[];
}

export function ProductOptions({ colors, sizes }: ProductOptionsProps) {
  const [selectedColor, setSelectedColor] = useState(colors[0] ?? null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {colors.length > 0 && (
        <div>
          <span className="block text-xs uppercase tracking-widest text-muted">Cor</span>
          <div className="mt-3 flex flex-wrap gap-3">
            {colors.map((color) => (
              <ColorSwatch
                key={color}
                name={color}
                selected={color === selectedColor}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <span className="block text-xs uppercase tracking-widest text-muted">Tamanho</span>
          <div className="mt-3 flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm transition-colors ${
                  size === selectedSize
                    ? "border-foreground bg-foreground text-background"
                    : "border-border-strong text-foreground hover:border-foreground/60"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        disabled
        title="Produto de demonstração — integração com loja parceira ainda não conectada"
        className="w-full cursor-not-allowed rounded-xl bg-accent py-3 text-sm font-medium text-accent-foreground opacity-60"
      >
        Comprar na loja parceira (demo)
      </button>
    </div>
  );
}
