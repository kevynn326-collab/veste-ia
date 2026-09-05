import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Product, ProductFilter } from "@/types/product";
import { mapRowToProduct, type ProductRow } from "./mapRowToProduct";
import type { ProductProvider } from "./ProductProvider";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Demo implementation of ProductProvider, backed by the `products` table
 * seeded with fictitious DEMO_PRODUCT rows (see scripts/seed-demo-products.ts).
 * Swapping to a real store/affiliate feed later means writing a new class
 * that implements ProductProvider — nothing else in the app changes.
 */
export class DemoProductProvider implements ProductProvider {
  async search(filter: ProductFilter): Promise<Product[]> {
    const supabase = createServerSupabaseClient();
    let query = supabase
      .from("products")
      .select("*")
      .eq("availability", true);

    if (filter.gender) {
      query = query.in("gender", [filter.gender, "unisex"]);
    }
    if (filter.category?.length) {
      query = query.in("category", filter.category);
    }
    if (typeof filter.maxPrice === "number") {
      query = query.lte("price", filter.maxPrice);
    }
    if (typeof filter.minPrice === "number") {
      query = query.gte("price", filter.minPrice);
    }
    if (filter.style?.length) {
      query = query.overlaps("style", filter.style);
    }
    if (filter.colors?.length) {
      query = query.overlaps("colors", filter.colors);
    }

    const { data, error } = await query.limit(200);
    if (error) throw new Error(`ProductProvider.search failed: ${error.message}`);

    return (data as ProductRow[]).map(mapRowToProduct);
  }

  async getById(id: string): Promise<Product | null> {
    // A malformed id (not a UUID) makes Postgres error instead of returning
    // no rows — treat it as "not found" rather than letting that 500 leak.
    if (!UUID_RE.test(id)) return null;

    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(`ProductProvider.getById failed: ${error.message}`);
    return data ? mapRowToProduct(data as ProductRow) : null;
  }

  async getByIds(ids: string[]): Promise<Product[]> {
    const validIds = ids.filter((id) => UUID_RE.test(id));
    if (validIds.length === 0) return [];

    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .in("id", validIds);

    if (error) throw new Error(`ProductProvider.getByIds failed: ${error.message}`);
    return (data as ProductRow[]).map(mapRowToProduct);
  }
}
