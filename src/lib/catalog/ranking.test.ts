import { describe, expect, it } from "vitest";
import { makeIntent, makeProduct } from "@/test/factories";
import { rankAndGroupProducts } from "./ranking";

describe("rankAndGroupProducts", () => {
  it("ranks products matching the requested style above unrelated ones", () => {
    const casual = makeProduct({ id: "casual", style: ["casual"] });
    const formal = makeProduct({ id: "formal", style: ["formal"] });

    const result = rankAndGroupProducts([formal, casual], makeIntent({ style: ["casual"] }));

    expect(result[0].id).toBe("casual");
  });

  it("prefers an exact gender match over an unmatched one, but still credits unisex", () => {
    const male = makeProduct({ id: "male", gender: "male" });
    const female = makeProduct({ id: "female", gender: "female" });
    const unisex = makeProduct({ id: "unisex", gender: "unisex" });

    const result = rankAndGroupProducts(
      [female, unisex, male],
      makeIntent({ gender: "male" }),
    );

    expect(result[0].id).toBe("male");
    // unisex should outrank a straightforwardly mismatched product
    expect(result.indexOf(result.find((p) => p.id === "unisex")!)).toBeLessThan(
      result.indexOf(result.find((p) => p.id === "female")!),
    );
  });

  it("deprioritizes a product that alone exceeds the stated budget", () => {
    const affordable = makeProduct({ id: "affordable", price: 100, style: ["casual"] });
    const expensive = makeProduct({ id: "expensive", price: 900, style: ["casual"] });

    const result = rankAndGroupProducts(
      [expensive, affordable],
      makeIntent({ style: ["casual"], budget: 500 }),
    );

    expect(result[0].id).toBe("affordable");
  });

  it("caps how many items from one category make the shortlist, to keep categories diverse", () => {
    const tops = Array.from({ length: 10 }, (_, i) =>
      makeProduct({ id: `top-${i}`, category: "top", rating: 5 }),
    );
    const oneBottom = makeProduct({ id: "the-bottom", category: "bottom", rating: 1 });

    // limit small enough that, without the per-category cap, 10 higher-rated
    // tops would crowd out the one bottom entirely.
    const result = rankAndGroupProducts([...tops, oneBottom], makeIntent(), 6);

    expect(result.some((p) => p.id === "the-bottom")).toBe(true);
  });

  it("respects the overall limit", () => {
    const candidates = Array.from({ length: 50 }, (_, i) =>
      makeProduct({ id: `p-${i}`, category: i % 2 === 0 ? "top" : "bottom" }),
    );

    const result = rankAndGroupProducts(candidates, makeIntent(), 10);

    expect(result.length).toBeLessThanOrEqual(10);
  });
});
