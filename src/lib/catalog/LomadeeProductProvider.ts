import "server-only";
import { searchLomadeeProducts } from "@/lib/lomadee/client";
import { mapLomadeeProduct } from "@/lib/lomadee/mapProduct";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Product, ProductFilter } from "@/types/product";
import { mapRowToProduct, type ProductRow } from "./mapRowToProduct";
import type { ProductProvider } from "./ProductProvider";

/**
 * Real products pulled live from the Lomadee affiliate network. There is no
 * "get one product by id" endpoint on their API, so every search result is
 * upserted into our own `products` table (keyed by source+external_id) —
 * that's what makes getById/getByIds work for these later (see
 * CompositeProductProvider, which delegates lookups to DemoProductProvider
 * since both sources end up in the same table).
 */
export class LomadeeProductProvider implements ProductProvider {
  async search(filter: ProductFilter): Promise<Product[]> {
    const items = await searchLomadeeProducts(filter);
    if (items.length === 0) return [];

    const rows = items
      .map((item) => mapLomadeeProduct(item, filter.gender, filter.keywords ?? []))
      .filter((row): row is NonNullable<typeof row> => row !== null);

    if (rows.length === 0) return [];

    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .upsert(rows, { onConflict: "source,external_id" })
      .select("*");

    if (error) {
      console.error("[LomadeeProductProvider] upsert failed:", error.message);
      return [];
    }

    return (data as ProductRow[]).map(mapRowToProduct);
  }

  async getById(): Promise<Product | null> {
    // Not supported directly by Lomadee — CompositeProductProvider looks
    // this up in Supabase instead, where search() already cached it.
    return null;
  }

  async getByIds(): Promise<Product[]> {
    return [];
  }
}
