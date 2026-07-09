import { searchTestsMock } from "@/src/client/sections/search/mock";
import { SearchView } from "@/src/client/sections/search/views/search-view";
import type { SearchSort } from "@/src/client/sections/search/types";

/**
 * 검색 컨테이너 (서버 컴포넌트).
 * searchParams(q, sort) 해석 + 결과 조회(분기) → View에 props 전달 (MVVM).
 * TODO(로드맵 6, dev): mock 필터 → /api/search + TanStack Query(클라 ViewModel)로 전환
 * (fetch-strategy §6: 검색/필터 = 상호작용 → TanStack Query).
 */
export async function SearchContainer({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q ?? "";
  const sort: SearchSort = sp.sort === "latest" ? "latest" : "popular";
  const results = searchTestsMock({ q, sort });
  return <SearchView q={q} sort={sort} results={results} />;
}
