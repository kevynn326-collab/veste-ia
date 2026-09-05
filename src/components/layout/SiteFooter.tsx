import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          &copy; {new Date().getFullYear()} AI Fashion Shopping. Produto em fase de
          demonstração — catálogo ilustrativo.
        </p>
        <nav className="flex gap-6">
          <Link href="/about" className="hover:text-foreground">
            Sobre
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            Privacidade
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Termos
          </Link>
        </nav>
      </div>
    </footer>
  );
}
