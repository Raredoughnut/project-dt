import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { PlayableResult, PlayableTest } from "@/src/client/sections/test-play/types";
import { ResultActions } from "../components/result-actions";

/** 결과 화면 (프레젠테이션). 서버 컴포넌트 — 공유 URL 대상(SEO/OG). */
export function TestResultView({
  test,
  result,
  name,
}: {
  test: PlayableTest;
  result: PlayableResult;
  name?: string;
}) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-1 flex-col gap-6 px-4 py-10">
      <p className="text-center text-sm text-muted-foreground">
        {name ? `${name}님의 결과는…` : "당신의 결과는…"}
      </p>

      <Card className="flex flex-col items-center gap-4 p-6 text-center">
        <div className="flex size-32 items-center justify-center overflow-hidden rounded-full border border-border bg-primary-lighter">
          {result.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={result.image}
              alt={result.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <span
              className="block size-12 rounded-full border-[12px] border-primary-light"
              aria-hidden
            />
          )}
        </div>

        <div className="flex flex-col gap-1">
          {result.subtitle ? (
            <p className="text-sm font-medium text-primary-dark">
              {result.subtitle}
            </p>
          ) : null}
          <h1 className="font-display text-2xl font-bold text-foreground">
            {result.title}
          </h1>
        </div>

        {result.description ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {result.description}
          </p>
        ) : null}

        {result.traits.length ? (
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            {result.traits.map((trait) => (
              <span
                key={trait}
                className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
              >
                #{trait}
              </span>
            ))}
          </div>
        ) : null}
      </Card>

      <div className="flex flex-col gap-2">
        <ResultActions slug={test.slug} code={result.code} />
        <Button asChild size="lg" variant="outline">
          <Link href={`/t/${test.slug}`}>다시 하기</Link>
        </Button>
        <Button asChild size="lg" variant="ghost">
          <Link href="/">다른 테스트 보러가기</Link>
        </Button>
      </div>
    </div>
  );
}
