import "server-only";
import type { Product, ProductFilter } from "@/types/product";
import type { DemoProductProvider } from "./DemoProductProvider";
import type { LomadeeProductProvider } from "./LomadeeProductProvider";
import type { ProductProvider } from "./ProductProvider";

/**
 * Merges the demo catalog with live results from external providers (today:
 * Lomadee). getById/getByIds always delegate to the demo provider's plain
 * Supabase lookups — external results get cached into the same `products`
 * table on search, so those lookups work uniformly for both sources.
 */
export class CompositeProductProvider implements ProductProvider {
  constructor(
    private readonly demo: DemoProductProvider,
    private readonly external: ProductProvider[],
  ) {}

  async search(filter: ProductFilter): Promise<Product[]> {
    const results = await Promise.allSettled([
      this.demo.search(filter),
      ...this.external.map((provider) => provider.search(filter)),
    ]);

    const products: Product[] = [];
    for (const result of results) {
      if (result.status === "fulfilled") {
        products.push(...result.value);
      } else {
        console.error("[CompositeProductProvider] a provider failed:", result.reason);
      }
    }
    return products;
  }

  getById(id: string): Promise<Product | null> {
    return this.demo.getById(id);
  }

  getByIds(ids: string[]): Promise<Product[]> {
    return this.demo.getByIds(ids);
  }
}
