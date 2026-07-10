import { notFound } from "next/navigation";
import { connection } from "next/server";

import { getAdminTestById } from "@/src/server/db/queries/admin-tests";
import { TestMetaFormContainer } from "./test-meta-form-container";
import { DeleteTestButton } from "./components/delete-test-button";
import type { TestMetaInitial } from "./types";

/**
 * 테스트 편집 Container(서버 컴포넌트): 대상 테스트 로드 → 폼 초기값 구성.
 * 반드시 <Suspense> 하위에서 렌더한다.
 */
export async function TestEditContainer({ testId }: { testId: string }) {
  await connection();
  const test = await getAdminTestById(testId);
  if (!test) notFound();

  const initial: TestMetaInitial = {
    title: test.title,
    slug: test.slug,
    description: test.description ?? "",
    category: test.category ?? "",
    scoringType: test.scoringType,
    status: test.status,
  };

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">테스트 편집</h1>
          <p className="mt-1 text-sm text-muted-foreground">/{test.slug}</p>
        </div>
        <DeleteTestButton id={test.id} slug={test.slug} />
      </header>

      <TestMetaFormContainer mode="edit" testId={test.id} initial={initial} />

      <section className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
        문항 · 선택지 · 결과카드 편집은 다음 단계에서 추가됩니다.
      </section>
    </div>
  );
}
