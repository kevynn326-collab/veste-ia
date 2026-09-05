import type { Intent } from "@/types/intent";
import type { Product } from "@/types/product";

let counter = 0;

export function makeProduct(overrides: Partial<Product> = {}): Product {
  counter += 1;
  return {
    id: `product-${counter}`,
    source: "DEMO_PRODUCT",
    name: `Test Product ${counter}`,
    category: "top",
    subcategory: null,
    brand: "Test Brand",
    price: 100,
    previousPrice: null,
    currency: "BRL",
    image: "https://example.com/image.jpg",
    url: "#",
    store: "Test Store",
    description: null,
    colors: [],
    sizes: [],
    material: null,
    style: [],
    gender: "unisex",
    rating: null,
    reviewCount: null,
    availability: true,
    tags: [],
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

export function makeIntent(overrides: Partial<Intent> = {}): Intent {
  return {
    gender: null,
    occasion: null,
    style: [],
    budget: null,
    location: null,
    preferences: [],
    ...overrides,
  };
}
