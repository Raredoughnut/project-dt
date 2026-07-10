"use client";

import { useState } from "react";

import { ResultCardForm } from "./components/result-card-form";
import type { AdminResultData } from "@/src/server/db/queries/admin-tests";

interface ResultsEditorProps {
  testId: string;
  scoringType: "axis" | "sum";
  results: AdminResultData[];
}

/** 결과카드 목록 편집(추가 + 개별 폼). */
export function ResultsEditor({ testId, scoringType, results }: ResultsEditorProps) {
  const [adding, setAdding] = useState(false);

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            결과카드{" "}
            <span className="text-sm font-normal text-muted-foreground">
              ({results.length})
            </span>
          </h2>
          <p className="text-xs text-muted-foreground">
            {scoringType === "axis"
              ? "축 조합 코드(ENFP 등)와 매칭됩니다."
              : "선택지 점수의 결과 코드(classic 등)와 매칭됩니다."}
          </p>
        </div>
        {!adding ? (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-dark"
          >
            + 결과 추가
          </button>
        ) : null}
      </div>

      {results.length === 0 && !adding ? (
        <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          아직 결과카드가 없습니다. 결과를 추가해주세요.
        </p>
      ) : null}

      {results.map((r) => (
        <ResultCardForm key={r.id} mode="edit" testId={testId} initial={r} />
      ))}

      {adding ? (
        <ResultCardForm
          mode="create"
          testId={testId}
          onDone={() => setAdding(false)}
        />
      ) : null}
    </section>
  );
}
