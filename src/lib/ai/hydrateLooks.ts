import type { LookComposition, Look } from "@/types/look";
import type { Product } from "@/types/product";

/**
 * The only place a LookComposition (LLM output, IDs only) turns into a Look
 * with real data. Any productId the model returns that isn't in the
 * server-validated shortlist is silently dropped here — it never reaches
 * the UI. This is what makes rule 19 (the AI never invents a product,
 * price, brand, or URL) an architectural guarantee instead of a prompt hope.
 */
export function hydrateLooks(compositions: LookComposition[], shortlist: Product[]): Look[] {
  const byId = new Map(shortlist.map((p) => [p.id, p]));

  return compositions.reduce<Look[]>((looks, composition) => {
    const products = composition.productIds
      .map((id) => byId.get(id))
      .filter((p): p is Product => Boolean(p));

    if (products.length === 0) {
      console.warn(
        `[hydrateLooks] look "${composition.label}" referenced no valid product ids — dropped`,
      );
      return looks;
    }

    const totalPrice = products.reduce((sum, p) => sum + p.price, 0);

    looks.push({
      label: composition.label,
      title: composition.title,
      reasoning: composition.reasoning,
      products,
      totalPrice,
    });

    return looks;
  }, []);
}
