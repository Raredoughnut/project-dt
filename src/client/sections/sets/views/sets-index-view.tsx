import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { SetCard } from "@/src/client/sections/home/components/set-card";
import type { CuratedSet } from "@/src/client/sections/home/types";

/** 추천 세트 목록 (프레젠테이션). */
export function SetsIndexView({ sets }: { sets: CuratedSet[] }) {
  return (
    <div className="min-h-full bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background">
        <div className="mx-auto flex h-14 w-full max-w-[1440px] items-center gap-2 px-4 sm:px-6 lg:px-10">
          <Link href="/" aria-label="홈으로" className="shrink-0 text-muted-foreground">
            <ChevronLeft className="size-5" />
          </Link>
          <h1 className="text-base font-medium text-foreground">추천 세트</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-4 sm:px-6 lg:px-10 lg:pt-6">
        <div className="grid gap-4 lg:grid-cols-2">
          {sets.map((set) => (
            <SetCard key={set.id} set={set} />
          ))}
        </div>
      </main>
    </div>
  );
}
