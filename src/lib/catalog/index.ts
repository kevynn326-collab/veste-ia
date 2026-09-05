import "server-only";
import { DemoProductProvider } from "./DemoProductProvider";
import type { ProductProvider } from "./ProductProvider";

let provider: ProductProvider | null = null;

/**
 * Single point of truth for which ProductProvider backs the app.
 * Swapping the demo catalog for a real one later is a one-line change here.
 */
export function getProductProvider(): ProductProvider {
  if (!provider) {
    provider = new DemoProductProvider();
  }
  return provider;
}

export type { ProductProvider } from "./ProductProvider";
