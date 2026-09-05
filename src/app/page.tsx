import { Hero3D } from "@/components/hero/Hero3D";
import { HeroSearch } from "@/components/hero/HeroSearch";
import { FadeIn, RevealOnScroll } from "@/components/motion/FadeIn";

const STEPS = [
  {
    number: "01",
    title: "Descreva o que precisa",
    description:
      "Ocasião, orçamento, estilo, cidade — em uma frase, do jeito que você falaria com um estilista.",
  },
  {
    number: "02",
    title: "A IA entende e busca",
    description:
      "Sua intenção é traduzida em critérios reais e cruzada com um catálogo de produtos de verdade.",
  },
  {
    number: "03",
    title: "Looks prontos para comprar",
    description:
      "Até 3 combinações completas, com explicação do porquê — e um clique para a loja parceira.",
  },
];

const BENEFITS = [
  {
    title: "Produtos reais",
    description: "Nada é inventado. Cada peça vem de um catálogo com preço, loja e disponibilidade reais.",
  },
  {
    title: "Sem navegar por categorias",
    description: "Descreva a intenção, não os filtros. A busca por palavras-chave fica para trás.",
  },
  {
    title: "Looks completos",
    description: "Peças combinadas entre si, não uma lista solta de produtos parecidos.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden px-6 py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(245,243,239,0.08),transparent_60%)]"
        />
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <FadeIn>
              <p className="mb-6 text-xs uppercase tracking-[0.3em] text-muted">
                Fashion Search, reinventada por IA
              </p>
            </FadeIn>
            <FadeIn delay={0.08}>
              <h1 className="font-display max-w-xl text-balance text-5xl leading-[1.05] sm:text-6xl">
                Vista-se melhor.
                <br />
                Sem procurar.
              </h1>
            </FadeIn>
            <FadeIn delay={0.16}>
              <p className="mt-6 max-w-md text-balance text-lg text-muted">
                Diga o que você quer vestir. Nossa IA encontra as peças certas
                para você.
              </p>
            </FadeIn>

            <FadeIn delay={0.24} className="mt-12 flex w-full justify-center lg:justify-start">
              <HeroSearch />
            </FadeIn>
          </div>

          <FadeIn delay={0.2}>
            <Hero3D />
          </FadeIn>
        </div>
      </section>

      <section className="border-t border-border px-6 py-24">
        <RevealOnScroll className="mx-auto max-w-5xl">
          <h2 className="font-display text-3xl sm:text-4xl">Como funciona</h2>
          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.number}>
                <span className="font-display text-sm text-muted">{step.number}</span>
                <h3 className="mt-3 text-lg font-medium">{step.title}</h3>
                <p className="mt-2 text-sm text-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </section>

      <section className="border-t border-border px-6 py-24">
        <RevealOnScroll className="mx-auto max-w-5xl">
          <h2 className="font-display text-3xl sm:text-4xl">Por que é diferente</h2>
          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl border border-border p-6 transition-colors hover:border-border-strong"
              >
                <h3 className="text-lg font-medium">{benefit.title}</h3>
                <p className="mt-2 text-sm text-muted">{benefit.description}</p>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </section>

      <section className="border-t border-border px-6 py-24 text-center">
        <RevealOnScroll>
          <h2 className="font-display mx-auto max-w-2xl text-balance text-3xl sm:text-4xl">
            Descreva o look. A IA cuida do resto.
          </h2>
          <div className="mt-10 flex justify-center">
            <HeroSearch />
          </div>
        </RevealOnScroll>
      </section>
    </>
  );
}
