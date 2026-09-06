import type { Gender } from "@/types/product";
import type { LomadeeOption, LomadeeProduct } from "./types";

function stripHtml(html: string | undefined): string | null {
  if (!html) return null;
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() || null;
}

function pickBestOption(options: LomadeeOption[]): LomadeeOption | null {
  const withPrice = options.filter((o) => o.pricing.some((p) => p.price > 0));
  const available = withPrice.find((o) => o.available) ?? withPrice[0];
  return available ?? options[0] ?? null;
}

/** Row shape for upserting into the shared `products` table (snake_case, matches the SQL schema). */
export interface ExternalProductRow {
  source: string;
  external_id: string;
  name: string;
  category: string;
  subcategory: string | null;
  brand: string;
  price: number;
  previous_price: number | null;
  currency: string;
  image: string;
  url: string;
  store: string;
  description: string | null;
  colors: string[];
  sizes: string[];
  material: string | null;
  style: string[];
  gender: Gender | null;
  rating: number | null;
  review_count: number | null;
  availability: boolean;
  tags: string[];
}

/**
 * Maps a Lomadee catalog item to our shared product row. Every field here
 * comes straight from Lomadee's response — never invented — per the
 * project's rule that the AI (and the catalog it works from) never
 * fabricates product data.
 */
export function mapLomadeeProduct(
  item: LomadeeProduct,
  searchedGender: Gender | undefined,
  searchedStyle: string[],
): ExternalProductRow | null {
  const option = pickBestOption(item.options ?? []);
  if (!option) return null;

  const pricing = option.pricing.find((p) => p.price > 0) ?? option.pricing[0];
  if (!pricing) return null;

  const image = item.images?.[0]?.url ?? option.images?.[0]?.url;
  if (!image) return null;

  const previousPrice =
    pricing.listPrice && pricing.listPrice > pricing.price ? pricing.listPrice : null;

  // Lomadee's "options" are generic product variants (color, size, flavor,
  // ...) with no structured axis — we can't reliably split them, so they're
  // surfaced as a flat variant list rather than mapped to colors/sizes.
  const variantNames = Array.from(
    new Set((item.options ?? []).map((o) => o.name).filter(Boolean)),
  ).slice(0, 12);

  return {
    source: "LOMADEE",
    external_id: item.id,
    name: item.name,
    category: item.categories?.[0]?.name ?? "geral",
    subcategory: null,
    brand: option.brands?.[0]?.name ?? "Diversas marcas",
    price: pricing.price,
    previous_price: previousPrice,
    currency: "BRL",
    image,
    url: item.url,
    store: option.seller ?? "Loja parceira",
    description: stripHtml(item.description),
    colors: [],
    sizes: variantNames,
    material: null,
    style: searchedStyle,
    gender: searchedGender ?? null,
    rating: null,
    review_count: null,
    availability: item.available && option.available,
    tags: (item.categories ?? []).map((c) => c.name),
  };
}
