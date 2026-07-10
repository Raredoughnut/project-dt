"use client";

import { useState } from "react";

import { QuestionCard } from "./components/question-card";
import type { AdminQuestionData } from "@/src/server/db/queries/admin-tests";

interface QuestionsEditorProps {
  testId: string;
  scoringType: "axis" | "sum";
  questions: AdminQuestionData[];
  resultCodes: string[];
}

/** 문항 목록 편집(추가 + 개별 카드). */
export function QuestionsEditor({
  testId,
  scoringType,
  questions,
  resultCodes,
}: QuestionsEditorProps) {
  const [adding, setAdding] = useState(false);
  const nextOrder = questions.reduce((m, q) => Math.max(m, q.order), 0) + 1;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">
          문항{" "}
          <span className="text-sm font-normal text-muted-foreground">
            ({questions.length})
          </span>
        </h2>
        {!adding ? (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-dark"
          >
            + 문항 추가
          </button>
        ) : null}
      </div>

      {questions.length === 0 && !adding ? (
        <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          아직 문항이 없습니다. 문항을 추가해주세요.
        </p>
      ) : null}

      {questions.map((q) => (
        <QuestionCard
          key={q.id}
          mode="edit"
          testId={testId}
          scoringType={scoringType}
          resultCodes={resultCodes}
          initial={q}
        />
      ))}

      {adding ? (
        <QuestionCard
          mode="create"
          testId={testId}
          scoringType={scoringType}
          resultCodes={resultCodes}
          defaultOrder={nextOrder}
          onDone={() => setAdding(false)}
        />
      ) : null}
    </section>
  );
}
