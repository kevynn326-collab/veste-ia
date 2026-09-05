import type { Gender, Product } from "@/types/product";

/** Row shape as it comes back from the `products` table (snake_case). */
export interface ProductRow {
  id: string;
  source: string;
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
  updated_at: string;
}

export function mapRowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    source: row.source,
    name: row.name,
    category: row.category,
    subcategory: row.subcategory,
    brand: row.brand,
    price: Number(row.price),
    previousPrice: row.previous_price === null ? null : Number(row.previous_price),
    currency: row.currency,
    image: row.image,
    url: row.url,
    store: row.store,
    description: row.description,
    colors: row.colors,
    sizes: row.sizes,
    material: row.material,
    style: row.style,
    gender: row.gender,
    rating: row.rating === null ? null : Number(row.rating),
    reviewCount: row.review_count,
    availability: row.availability,
    tags: row.tags,
    updatedAt: row.updated_at,
  };
}
