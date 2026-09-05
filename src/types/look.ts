import { z } from "zod";
import type { Product } from "./product";

export type LookLabel = "best_match" | "best_value" | "most_stylish";

/**
 * Shape the LLM is allowed to return: only references to product IDs that
 * already exist in the server-filtered shortlist, plus narrative text.
 * Never price, brand, name, or any other catalog field.
 */
export const LookCompositionSchema = z.object({
  label: z.enum(["best_match", "best_value", "most_stylish"]),
  title: z.string(),
  reasoning: z.string(),
  productIds: z.array(z.string()).min(1),
});

export const LookCompositionListSchema = z.object({
  looks: z.array(LookCompositionSchema).min(1).max(3),
});

export type LookComposition = z.infer<typeof LookCompositionSchema>;

/** Fully hydrated look, built server-side from real catalog data. */
export interface Look {
  label: LookLabel;
  title: string;
  reasoning: string;
  products: Product[];
  totalPrice: number;
}
