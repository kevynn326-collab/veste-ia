export type Gender = "male" | "female" | "unisex";

export type ProductSource = "DEMO_PRODUCT" | (string & {});

export interface Product {
  id: string;
  source: ProductSource;
  name: string;
  category: string;
  subcategory: string | null;
  brand: string;
  price: number;
  previousPrice: number | null;
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
  reviewCount: number | null;
  availability: boolean;
  tags: string[];
  updatedAt: string;
}

export interface ProductFilter {
  gender?: Gender;
  category?: string[];
  maxPrice?: number;
  minPrice?: number;
  style?: string[];
  colors?: string[];
  occasion?: string;
  /**
   * Free-text hints (style tags, occasion) for providers backed by a
   * keyword-search API (e.g. Lomadee) rather than structured columns.
   * DemoProductProvider ignores this — it already scores style locally.
   */
  keywords?: string[];
}
