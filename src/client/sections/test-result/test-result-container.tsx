import { getPlayableTestMock } from "@/src/client/sections/test-play/mock";
import { TestResultView } from "@/src/client/sections/test-result/views/test-result-view";

/**
 * 결과 컨테이너 (서버 컴포넌트).
 * 초기 데이터 획득 + 결과 코드 매칭(분기) → View에 props 전달 (MVVM).
 * TODO(로드맵 6, dev): getPlayableTestMock → Drizzle `use cache` 쿼리로 교체.
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
  const test = getPlayableTestMock(slug);
  // 코드가 없거나 매칭되지 않으면 첫 결과로 폴백(스캐폴드).
  const result = test.results.find((r) => r.code === code) ?? test.results[0];
  return <TestResultView test={test} result={result} name={name} />;
}
