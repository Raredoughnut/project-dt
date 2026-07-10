import { notFound } from "next/navigation";

import { getPlayableTest } from "@/src/server/db/queries/tests";
import { TestResultView } from "@/src/client/sections/test-result/views/test-result-view";

/**
 * 결과 컨테이너 (서버 컴포넌트).
 * 초기 데이터 획득 + 결과 코드 매칭(분기) → View에 props 전달 (MVVM).
 */
export async function TestResultContainer({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; code: string }>;
  searchParams: Promise<{ name?: string }>;
}) {
  const { slug, code } = await params;
  const { name } = await searchParams;
  const test = await getPlayableTest(slug);
  if (!test) notFound();
  // 코드가 없거나 매칭되지 않으면 첫 결과로 폴백(공유 링크 견고성).
  const result = test.results.find((r) => r.code === code) ?? test.results[0];
  if (!result) notFound();
  return <TestResultView test={test} result={result} name={name} />;
}
