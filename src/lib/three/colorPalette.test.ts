import { describe, expect, it } from "vitest";
import { colorNameToHex, paletteFromColors } from "./colorPalette";

function luminance(hex: string): number {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

describe("colorNameToHex", () => {
  it("maps a known catalog color name to its hex value", () => {
    expect(colorNameToHex("branco")).toBe("#f2f0eb");
  });

  it("is case-insensitive and trims whitespace", () => {
    expect(colorNameToHex(" Preto ")).toBe(colorNameToHex("preto"));
  });

  it("falls back to a default for unknown color names", () => {
    expect(colorNameToHex("cor-inexistente")).toMatch(/^#[0-9a-f]{6}$/);
  });
});

describe("paletteFromColors", () => {
  it("returns a valid hex color for an empty color list", () => {
    expect(paletteFromColors([])).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("keeps the dress form legible even for the darkest catalog colors", () => {
    // Regression test: a look made entirely of black/graphite items must not
    // render an invisible mannequin against the dark card background — see
    // the Etapa 6 contrast bug (tintDressForm mixes toward a light base).
    const result = paletteFromColors(["preto"]);
    expect(luminance(result)).toBeGreaterThan(0.4);
  });
});
