/** Best-effort mapping from the catalog's Portuguese color names to hex, for the decorative dress form. */
const COLOR_MAP: Record<string, string> = {
  preto: "#1a1a1a",
  branco: "#f2f0eb",
  "off-white": "#ece7dd",
  areia: "#d8c9ac",
  bege: "#d9c7a8",
  camel: "#c19a6b",
  caramelo: "#b5793a",
  marrom: "#5c3a21",
  grafite: "#4a4a4a",
  cinza: "#8a8a8a",
  "azul marinho": "#1f2a44",
  marinho: "#1f2a44",
  "azul escuro": "#26364f",
  "azul claro": "#a9c2d9",
  "azul serenity": "#a3bcd9",
  azul: "#3b5a7a",
  verde: "#4c5c45",
  "verde musgo": "#5a5f45",
  "verde militar": "#5c5c3d",
  "verde esmeralda": "#2f6b52",
  vinho: "#5c2430",
  vermelho: "#8c2f2f",
  lilás: "#b8a4c9",
  dourado: "#c9a24b",
  nude: "#d8b79a",
  terracota: "#b5573a",
  "preto/marrom": "#332218",
  tartaruga: "#6b4a2f",
};

const FALLBACK = "#8a8580";
const DRESS_FORM_BASE = "#ece7dd"; // matches the hero's neutral dress form tone

export function colorNameToHex(name: string): string {
  return COLOR_MAP[name.toLowerCase().trim()] ?? FALLBACK;
}

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Blends a color toward the dress form's light neutral base. Many catalog
 * colors (preto, grafite, marinho) are dark enough to disappear against the
 * card's dark background if used at full strength — this keeps the
 * mannequin always legible while still hinting the look's palette.
 */
function tintDressForm(hex: string, strength = 0.35): string {
  const c = hexToRgb(hex);
  const base = hexToRgb(DRESS_FORM_BASE);
  return rgbToHex(
    c.r * strength + base.r * (1 - strength),
    c.g * strength + base.g * (1 - strength),
    c.b * strength + base.b * (1 - strength),
  );
}

/** Picks a single representative tone for a look from all its products' colors. */
export function paletteFromColors(colors: string[]): string {
  const base = colors.length === 0 ? FALLBACK : colorNameToHex(colors[0]);
  return tintDressForm(base);
}
