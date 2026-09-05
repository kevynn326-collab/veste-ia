import "server-only";
import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

/**
 * Two independently configurable models: intent extraction is a cheap,
 * high-volume structured-extraction task, while look composition needs
 * real reasoning quality. Defaulting both to claude-opus-5 keeps the MVP
 * simple; swapping ANTHROPIC_MODEL_INTENT to a smaller model is a pure
 * cost optimization once volume justifies tuning it, no code change needed.
 */
export const INTENT_MODEL = process.env.ANTHROPIC_MODEL_INTENT ?? "claude-opus-5";
export const COMPOSE_MODEL = process.env.ANTHROPIC_MODEL_COMPOSE ?? "claude-opus-5";
