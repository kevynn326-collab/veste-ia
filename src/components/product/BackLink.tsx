"use client";

import { useRouter } from "next/navigation";

export function BackLink() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="group flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
    >
      <span className="transition-transform group-hover:-translate-x-0.5" aria-hidden>
        ←
      </span>
      Voltar
    </button>
  );
}
