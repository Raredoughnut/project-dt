import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { TestCard } from "@/src/client/sections/home/components/test-card";
import type { SetDetail } from "../types";

/** 세트 상세 (프레젠테이션): 세트 소개 + 구성 테스트 목록. */
export function SetDetailView({ set }: { set: SetDetail }) {
  return (
    <div className="min-h-full bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background">
        <div className="mx-auto flex h-14 w-full max-w-[1440px] items-center gap-2 px-4 sm:px-6 lg:px-10">
          <Link href="/sets" aria-label="세트 목록" className="shrink-0 text-muted-foreground">
            <ChevronLeft className="size-5" />
          </Link>
          <h1 className="truncate text-base font-medium text-foreground">
            {set.title}
          </h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-6 sm:px-6 lg:px-10">
        <div className="mb-6 flex flex-col gap-2">
          <h2 className="font-display text-2xl font-bold text-foreground">
            {set.title}
          </h2>
          {set.description ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {set.description}
            </p>
          ) : null}
          <p className="text-xs text-muted-foreground">
            테스트 {set.items.length}개
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          {set.items.map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
        </div>
      </main>
    </div>
  );
}
