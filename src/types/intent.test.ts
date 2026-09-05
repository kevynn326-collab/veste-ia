import { describe, expect, it } from "vitest";
import { IntentSchema } from "./intent";

describe("IntentSchema", () => {
  it("accepts a fully specified intent", () => {
    const result = IntentSchema.safeParse({
      gender: "male",
      occasion: "casamento",
      style: ["elegante", "formal"],
      budget: 1000,
      location: "Rio de Janeiro",
      preferences: ["evitar estampas"],
    });

    expect(result.success).toBe(true);
  });

  it("defaults list fields to an empty array when omitted", () => {
    const result = IntentSchema.parse({
      gender: null,
      occasion: null,
      budget: null,
      location: null,
    });

    expect(result.style).toEqual([]);
    expect(result.preferences).toEqual([]);
  });

  it("rejects an invalid gender value", () => {
    const result = IntentSchema.safeParse({
      gender: "robot",
      occasion: null,
      budget: null,
      location: null,
    });

    expect(result.success).toBe(false);
  });

  it("rejects a negative budget", () => {
    const result = IntentSchema.safeParse({
      gender: null,
      occasion: null,
      budget: -50,
      location: null,
    });

    expect(result.success).toBe(false);
  });
});
