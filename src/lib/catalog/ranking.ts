import "server-only";
import type { Intent } from "@/types/intent";
import type { Product } from "@/types/product";
import { getProductProvider } from "./index";

const OCCASION_STYLE_HINTS: Record<string, string[]> = {
  casamento: ["elegante", "formal"],
  wedding: ["elegante", "formal"],
  jantar: ["elegante", "smart casual"],
  dinner: ["elegante", "smart casual"],
  entrevista: ["formal", "elegante"],
  interview: ["formal", "elegante"],
  trabalho: ["smart casual", "elegante"],
  viagem: ["casual", "smart casual"],
  travel: ["casual", "smart casual"],
  "primeiro encontro": ["casual", "smart casual", "elegante"],
  festa: ["elegante", "streetwear"],
  balada: ["streetwear", "elegante"],
};

/** Every category a full look tries to cover, in priority order. */
const LOOK_CATEGORIES = ["top", "bottom", "footwear", "outerwear", "accessory", "dress"];

function inferStyleHints(intent: Intent): string[] {
  if (!intent.occasion) return [];
  const key = intent.occasion.trim().toLowerCase();
  return OCCASION_STYLE_HINTS[key] ?? [];
}

function scoreProduct(product: Product, intent: Intent, styleHints: string[]): number {
  let score = 0;

  const wantedStyles = intent.style.length > 0 ? intent.style : styleHints;
  if (wantedStyles.length > 0) {
    const overlap = product.style.filter((s) => wantedStyles.includes(s)).length;
    score += (overlap / wantedStyles.length) * 3;
  }

  if (intent.gender && product.gender === intent.gender) {
    score += 1;
  } else if (product.gender === "unisex") {
    score += 0.5;
  }

  if (intent.budget) {
    // A single piece shouldn't eat the whole budget; reward items that
    // leave room for the rest of the look.
    const comfortableCeiling = intent.budget * 0.5;
    if (product.price <= comfortableCeiling) {
      score += 2;
    } else if (product.price <= intent.budget) {
      score += 0.5;
    } else {
      score -= 2; // over budget alone — actively deprioritize
    }
  }

  if (product.rating) {
    score += (product.rating / 5) * 1;
  }

  return score;
}

/**
 * Pure scoring + category-diversity grouping — no I/O, fully unit-testable.
 * Split out from buildShortlist so tests don't need a live ProductProvider.
 */
export function rankAndGroupProducts(
  candidates: Product[],
  intent: Intent,
  limit = 40,
): Product[] {
  const styleHints = inferStyleHints(intent);

  const scored = candidates
    .map((product) => ({ product, score: scoreProduct(product, intent, styleHints) }))
    .sort((a, b) => b.score - a.score);

  // Guarantee category diversity so the AI can actually assemble full looks,
  // instead of ending up with e.g. 40 shirts and no shoes.
  const perCategoryLimit = Math.ceil(limit / LOOK_CATEGORIES.length);
  const byCategory = new Map<string, number>();
  const shortlist: Product[] = [];

  for (const { product } of scored) {
    const count = byCategory.get(product.category) ?? 0;
    if (count >= perCategoryLimit) continue;
    byCategory.set(product.category, count + 1);
    shortlist.push(product);
    if (shortlist.length >= limit) break;
  }

  return shortlist;
}

/**
 * Deterministic filter + ranking over the real catalog. This is what keeps
 * "catalog -> filter -> AI" instead of "AI decides everything" (see
 * architecture doc, item 18): the LLM never sees more than what this
 * function already validated as relevant and affordable.
 */
export async function buildShortlist(intent: Intent, limit = 40): Promise<Product[]> {
  const provider = getProductProvider();

  const keywords = [...intent.style, intent.occasion].filter(
    (v): v is string => Boolean(v),
  );

  const candidates = await provider.search({
    gender: intent.gender ?? undefined,
    maxPrice: intent.budget ?? undefined,
    keywords: keywords.length > 0 ? keywords : undefined,
  });

  return rankAndGroupProducts(candidates, intent, limit);
}
