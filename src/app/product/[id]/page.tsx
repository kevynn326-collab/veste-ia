import { cache } from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductProvider } from "@/lib/catalog";
import { BackLink } from "@/components/product/BackLink";
import { ProductOptions } from "@/components/product/ProductOptions";
import { FadeIn } from "@/components/motion/FadeIn";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Deduped per-request: generateMetadata and the page both need this product.
const getCachedProduct = cache((id: string) => getProductProvider().getById(id));

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getCachedProduct(id);
  if (!product) return {};

  return {
    title: `${product.name} — AI Fashion Shopping`,
    description: product.description ?? `${product.name} por ${product.brand}.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getCachedProduct(id);

  if (!product) notFound();

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <BackLink />

      <div className="mt-6 grid gap-10 sm:grid-cols-2">
        <FadeIn>
          <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-surface">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(min-width: 640px) 40vw, 90vw"
              priority
            />
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="text-xs uppercase tracking-widest text-muted">
            {product.brand} · {product.subcategory ?? product.category}
          </p>
          <h1 className="font-display mt-2 text-3xl">{product.name}</h1>
          <div className="mt-4 flex items-baseline gap-3 tabular-nums">
            <span className="text-2xl font-medium">{formatPrice(product.price)}</span>
            {product.previousPrice && (
              <span className="text-muted line-through">
                {formatPrice(product.previousPrice)}
              </span>
            )}
          </div>
          {product.rating && (
            <p className="mt-2 text-sm text-muted">
              ★ {product.rating.toFixed(1)}
              {product.reviewCount ? ` (${product.reviewCount} avaliações)` : ""}
            </p>
          )}
          {product.description && <p className="mt-6 text-muted">{product.description}</p>}

          {product.style.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.style.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8 border-t border-border pt-6">
            <ProductOptions colors={product.colors} sizes={product.sizes} />
          </div>

          <p className="mt-4 text-xs text-muted">Vendido por {product.store}</p>
        </FadeIn>
      </div>
    </div>
  );
}
