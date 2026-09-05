import { describe, expect, it } from "vitest";
import { makeProduct } from "@/test/factories";
import type { LookComposition } from "@/types/look";
import { hydrateLooks } from "./hydrateLooks";

describe("hydrateLooks", () => {
  it("hydrates a composition's product ids with real catalog data and sums the price", () => {
    const shirt = makeProduct({ id: "shirt", price: 100 });
    const pants = makeProduct({ id: "pants", price: 150 });

    const composition: LookComposition = {
      label: "best_match",
      title: "Test Look",
      reasoning: "Because testing.",
      productIds: ["shirt", "pants"],
    };

    const [look] = hydrateLooks([composition], [shirt, pants]);

    expect(look.products.map((p) => p.id)).toEqual(["shirt", "pants"]);
    expect(look.totalPrice).toBe(250);
  });

  it("silently drops any product id the model invented that isn't in the shortlist", () => {
    const shirt = makeProduct({ id: "shirt", price: 100 });

    const composition: LookComposition = {
      label: "best_match",
      title: "Test Look",
      reasoning: "Because testing.",
      // "hallucinated-id" does not exist in the shortlist below
      productIds: ["shirt", "hallucinated-id"],
    };

    const [look] = hydrateLooks([composition], [shirt]);

    expect(look.products).toHaveLength(1);
    expect(look.products[0].id).toBe("shirt");
    expect(look.totalPrice).toBe(100);
  });

  it("drops the whole look when every referenced id is invalid", () => {
    const shirt = makeProduct({ id: "shirt" });

    const composition: LookComposition = {
      label: "best_match",
      title: "Ghost Look",
      reasoning: "Should not survive.",
      productIds: ["does-not-exist"],
    };

    const looks = hydrateLooks([composition], [shirt]);

    expect(looks).toHaveLength(0);
  });

  it("hydrates multiple compositions independently", () => {
    const shirt = makeProduct({ id: "shirt", price: 100 });
    const shoes = makeProduct({ id: "shoes", price: 200 });

    const compositions: LookComposition[] = [
      { label: "best_match", title: "A", reasoning: "r", productIds: ["shirt"] },
      { label: "best_value", title: "B", reasoning: "r", productIds: ["shoes"] },
    ];

    const looks = hydrateLooks(compositions, [shirt, shoes]);

    expect(looks).toHaveLength(2);
    expect(looks[0].totalPrice).toBe(100);
    expect(looks[1].totalPrice).toBe(200);
  });
});
