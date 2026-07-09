import Link from "next/link";
import { ChevronLeft, SearchX } from "lucide-react";
import { TestCard } from "@/src/client/sections/home/components/test-card";
import { SearchBar } from "../components/search-bar";
import { SortTabs } from "../components/sort-tabs";
import type { SearchResultTest, SearchSort } from "../types";

/** 검색 결과 화면 (프레젠테이션). searchParams(q, sort)로 서버에서 필터된 결과를 받는다. */
export function SearchView({
  q,
  sort,
  results,
}: {
  q: string;
  sort: SearchSort;
  results: SearchResultTest[];
}) {
  return (
    <div className="min-h-full bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background">
        <div className="mx-auto flex h-14 w-full max-w-[1440px] items-center gap-2 px-4 sm:px-6 lg:px-10">
          <Link href="/" aria-label="홈으로" className="shrink-0 text-muted-foreground">
            <ChevronLeft className="size-5" />
          </Link>
          <SearchBar defaultQuery={q} sort={sort} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-4 sm:px-6 lg:px-10 lg:pt-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {q ? (
              <>
                <span className="font-medium text-foreground">‘{q}’</span> 검색 결과{" "}
                {results.length}개
              </>
            ) : (
              <>전체 테스트 {results.length}개</>
            )}
          </p>
          <SortTabs sort={sort} q={q} />
        </div>

        {results.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
            {results.map((test) => (
              <TestCard
                key={test.id}
                test={test}
                meta={
                  sort === "popular"
                    ? `${test.attemptCount.toLocaleString()}명 응시`
                    : undefined
                }
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-24 text-center text-muted-foreground">
            <SearchX className="size-8" />
            <p className="text-sm">
              ‘{q}’에 대한 검색 결과가 없어요.
              <br />
              다른 키워드로 검색해보세요.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
