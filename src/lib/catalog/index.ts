import "server-only";
import { CompositeProductProvider } from "./CompositeProductProvider";
import { DemoProductProvider } from "./DemoProductProvider";
import { LomadeeProductProvider } from "./LomadeeProductProvider";
import type { ProductProvider } from "./ProductProvider";

let provider: ProductProvider | null = null;

/**
 * Single point of truth for which ProductProvider(s) back the app. The demo
 * catalog always runs; Lomadee (real products) is added automatically once
 * LOMADEE_API_KEY is configured — no code change needed to turn it on/off.
 */
export function getProductProvider(): ProductProvider {
  if (!provider) {
    const demo = new DemoProductProvider();
    const external: ProductProvider[] = [];

    if (process.env.LOMADEE_API_KEY) {
      external.push(new LomadeeProductProvider());
    }

    provider = external.length > 0 ? new CompositeProductProvider(demo, external) : demo;
  }
  return provider;
}

export type { ProductProvider } from "./ProductProvider";
