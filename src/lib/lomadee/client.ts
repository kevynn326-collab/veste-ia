import "server-only";
import type { ProductFilter } from "@/types/product";
import type { LomadeeSearchResponse, LomadeeProduct } from "./types";

const API_BASE = "https://api.lomadee.com.br/affiliate";

function buildSearchQuery(filter: ProductFilter): string {
  const parts: string[] = [];
  if (filter.keywords?.length) parts.push(...filter.keywords);
  if (filter.gender === "male") parts.push("masculino");
  if (filter.gender === "female") parts.push("feminino");
  if (parts.length === 0) parts.push("moda roupas acessórios");
  return parts.join(" ");
}

/** Searches Lomadee's affiliate product feed. Returns [] if the key isn't configured or the call fails — a down/unset partner feed should never break the whole search. */
export async function searchLomadeeProducts(
  filter: ProductFilter,
  limit = 20,
): Promise<LomadeeProduct[]> {
  const apiKey = process.env.LOMADEE_API_KEY;
  if (!apiKey) return [];

  const search = buildSearchQuery(filter);
  const url = `${API_BASE}/products?${new URLSearchParams({ search, limit: String(limit) })}`;

  try {
    const res = await fetch(url, { headers: { "x-api-key": apiKey } });
    if (!res.ok) {
      console.error(`[lomadee] search failed: ${res.status} ${await res.text()}`);
      return [];
    }
    const json = (await res.json()) as LomadeeSearchResponse;
    return json.data ?? [];
  } catch (error) {
    console.error("[lomadee] search threw:", error);
    return [];
  }
}
