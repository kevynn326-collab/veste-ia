import { ResultsView } from "@/components/results/ResultsView";

interface ResultsPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const { q } = await searchParams;
  return <ResultsView initialQuery={q ?? ""} />;
}
