import { Suspense } from "react";
import { SearchContainer } from "@/src/client/sections/search/search-container";
import { LoadingView } from "@/src/client/sections/loading/loading-view";

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string }>;
}) {
  return (
    <Suspense fallback={<LoadingView />}>
      <SearchContainer searchParams={searchParams} />
    </Suspense>
  );
}
