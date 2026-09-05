import type { Product, ProductFilter } from "@/types/product";

/**
 * Abstraction over any source of catalog data — a demo seed today, a real
 * store, an affiliate feed, or a marketplace API tomorrow. Nothing outside
 * this layer should know or care where products actually come from.
 */
export interface ProductProvider {
  search(filter: ProductFilter): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  getByIds(ids: string[]): Promise<Product[]>;
}
