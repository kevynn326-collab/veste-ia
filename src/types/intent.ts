import { z } from "zod";

export const IntentSchema = z.object({
  gender: z.enum(["male", "female", "unisex"]).nullable(),
  occasion: z.string().nullable(),
  style: z.array(z.string()).default([]),
  budget: z.number().positive().nullable(),
  location: z.string().nullable(),
  preferences: z.array(z.string()).default([]),
});

export type Intent = z.infer<typeof IntentSchema>;
