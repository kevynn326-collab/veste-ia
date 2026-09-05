import { describe, expect, it } from "vitest";
import { LookCompositionListSchema, LookCompositionSchema } from "./look";

describe("LookCompositionSchema", () => {
  it("accepts a valid composition", () => {
    const result = LookCompositionSchema.safeParse({
      label: "best_match",
      title: "Smart Casual",
      reasoning: "Fits the occasion.",
      productIds: ["id-1", "id-2"],
    });

    expect(result.success).toBe(true);
  });

  it("rejects a composition with no product ids", () => {
    const result = LookCompositionSchema.safeParse({
      label: "best_match",
      title: "Empty Look",
      reasoning: "Nothing here.",
      productIds: [],
    });

    expect(result.success).toBe(false);
  });

  it("rejects a label outside the fixed set", () => {
    const result = LookCompositionSchema.safeParse({
      label: "cheapest",
      title: "Look",
      reasoning: "r",
      productIds: ["id-1"],
    });

    expect(result.success).toBe(false);
  });
});

describe("LookCompositionListSchema", () => {
  it("rejects more than three looks", () => {
    const look = {
      label: "best_match",
      title: "Look",
      reasoning: "r",
      productIds: ["id-1"],
    };

    const result = LookCompositionListSchema.safeParse({
      looks: [look, look, look, look],
    });

    expect(result.success).toBe(false);
  });
});
