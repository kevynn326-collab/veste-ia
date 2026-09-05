import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function LookProductThumb({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex w-20 shrink-0 flex-col gap-1.5 sm:w-24"
    >
      <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-surface transition-colors group-hover:border-border-strong">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="96px"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <span className="line-clamp-1 text-[11px] text-muted group-hover:text-foreground">
        {product.name}
      </span>
      <span className="tabular-nums text-xs font-medium">{formatPrice(product.price)}</span>
    </Link>
  );
}
