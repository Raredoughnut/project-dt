import { searchTests } from "@/src/server/db/queries/search";
import { SearchView } from "@/src/client/sections/search/views/search-view";
import type { SearchSort } from "@/src/client/sections/search/types";

/**
 * 검색 컨테이너 (서버 컴포넌트).
 * searchParams(q, sort) 해석 + 결과 조회(분기) → View에 props 전달 (MVVM).
 */
export async function SearchContainer({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q ?? "";
  const sort: SearchSort = sp.sort === "latest" ? "latest" : "popular";
  const results = await searchTests({ q, sort });
  return <SearchView q={q} sort={sort} results={results} />;
}
