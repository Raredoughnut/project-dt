import { notFound } from "next/navigation";
import { connection } from "next/server";

import { getAdminTestFull } from "@/src/server/db/queries/admin-tests";
import { QuestionsEditor } from "@/src/client/sections/admin-test-content/questions-editor";
import { ResultsEditor } from "@/src/client/sections/admin-test-content/results-editor";
import { TestMetaFormContainer } from "./test-meta-form-container";
import { DeleteTestButton } from "./components/delete-test-button";
import type { TestMetaInitial } from "./types";

/**
 * 테스트 편집 Container(서버 컴포넌트): 메타 + 문항·선택지 + 결과카드 전체 로드.
 * 반드시 <Suspense> 하위에서 렌더한다.
 */
export async function TestEditContainer({ testId }: { testId: string }) {
  await connection();
  const full = await getAdminTestFull(testId);
  if (!full) notFound();

  const { test, questions, results } = full;
  const initial: TestMetaInitial = {
    title: test.title,
    slug: test.slug,
    description: test.description ?? "",
    category: test.category ?? "",
    scoringType: test.scoringType,
    status: test.status,
  };
  const resultCodes = results.map((r) => r.code);

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">테스트 편집</h1>
            <p className="mt-1 text-sm text-muted-foreground">/{test.slug}</p>
          </div>
          <DeleteTestButton id={test.id} slug={test.slug} />
        </header>
        <TestMetaFormContainer mode="edit" testId={test.id} initial={initial} />
      </div>

      <QuestionsEditor
        testId={test.id}
        scoringType={test.scoringType}
        questions={questions}
        resultCodes={resultCodes}
      />

      <ResultsEditor
        testId={test.id}
        scoringType={test.scoringType}
        results={results}
      />
    </div>
  );
}
