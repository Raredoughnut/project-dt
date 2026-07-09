import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { PlayableTest } from "@/src/client/sections/test-play/types";

/** 테스트 소개 (프레젠테이션). 서버 컴포넌트로 렌더 — SEO/OG 대상. */
export function TestIntroView({ test }: { test: PlayableTest }) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-1 flex-col items-center justify-center gap-8 px-4 py-12 text-center">
      <div className="flex size-40 items-center justify-center overflow-hidden rounded-3xl border border-border bg-primary-lighter">
        {test.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={test.coverImage}
            alt={test.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <span
            className="block size-16 rounded-full border-[16px] border-primary-light"
            aria-hidden
          />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-primary-dark">
          {test.category ?? "심리테스트"}
        </span>
        <h1 className="font-display text-3xl font-bold text-foreground">
          {test.title}
        </h1>
        {test.description ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {test.description}
          </p>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">
        {test.questions.length}문항 · 약 30초
      </p>

      <Button asChild size="lg" className="w-full">
        <Link href={`/t/${test.slug}/play`}>테스트 시작하기</Link>
      </Button>
    </div>
  );
}
