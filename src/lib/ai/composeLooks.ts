import "server-only";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { Intent } from "@/types/intent";
import { LookCompositionListSchema, type LookComposition } from "@/types/look";
import type { Product } from "@/types/product";
import { COMPOSE_MODEL, getAnthropicClient } from "./client";

const SYSTEM_PROMPT = `Você é um personal stylist. Monte até 3 looks usando SOMENTE os produtos da lista fornecida em "products", referenciando cada peça pelo campo "id".

Regras absolutas:
- Nunca invente um "id" que não esteja na lista fornecida.
- Nunca mencione preço, marca ou nome exato de produto no "reasoning" — a interface já exibe esses dados separadamente.
- Monte looks completos sempre que possível (ex: top + bottom + footwear, com outerwear/accessory quando fizer sentido para a ocasião).
- Gere no máximo 3 looks, cada um com um "label" diferente entre os que fizerem sentido:
  - "best_match": a combinação que melhor atende ao pedido (ocasião, estilo, gênero, localização).
  - "best_value": a combinação de melhor custo-benefício dentro do orçamento informado.
  - "most_stylish": a combinação mais estilosa/diferenciada, ainda coerente com o pedido.
- Se não houver produtos suficientes para montar looks distintos e coerentes, gere menos de 3 — nunca repita exatamente a mesma combinação de produtos em dois looks.
- "title" deve ser curto (ex: "Smart Casual", "Elegante para Jantar").
- "reasoning" deve ter 1-2 frases em português explicando por que a combinação atende ao pedido.

Sobre orçamento (quando "budget" for informado em "intent"): some os preços das peças de cada look antes de decidir — a soma deve ficar dentro do orçamento sempre que possível. "best_value" deve ficar claramente dentro do orçamento. "best_match" deve respeitar o orçamento à risca. "most_stylish" pode ultrapassar em até ~10% apenas se não houver alternativa dentro do valor que mantenha qualidade — nunca mais que isso. Prefira um look com menos peças a um look que estoura o orçamento.`;

interface CompactProduct {
  id: string;
  name: string;
  category: string;
  subcategory: string | null;
  brand: string;
  price: number;
  colors: string[];
  style: string[];
  gender: string | null;
}

function toCompactCatalog(products: Product[]): CompactProduct[] {
  return products.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    subcategory: p.subcategory,
    brand: p.brand,
    price: p.price,
    colors: p.colors,
    style: p.style,
    gender: p.gender,
  }));
}

export async function composeLooks(
  intent: Intent,
  shortlist: Product[],
): Promise<LookComposition[]> {
  const client = getAnthropicClient();

  const userContent = JSON.stringify({
    intent,
    products: toCompactCatalog(shortlist),
  });

  const response = await client.messages.parse({
    model: COMPOSE_MODEL,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userContent }],
    output_config: { format: zodOutputFormat(LookCompositionListSchema) },
  });

  if (!response.parsed_output) {
    throw new Error("composeLooks: model did not return valid structured output");
  }

  return response.parsed_output.looks;
}
