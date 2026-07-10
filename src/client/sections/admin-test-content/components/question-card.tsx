"use client";

import { useId, useMemo, useReducer, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { MBTI_AXES } from "@/src/domain/mbti";
import {
  saveQuestionAction,
  deleteQuestionAction,
} from "@/src/server/actions/admin-content";
import type { SaveQuestionInput } from "@/src/domain/schemas";
import type { AdminQuestionData } from "@/src/server/db/queries/admin-tests";

type ScoringType = "axis" | "sum";

interface ScoreRowDraft {
  key: string;
  value: string;
}
interface ChoiceDraft {
  label: string;
  scoreRows: ScoreRowDraft[];
}
interface QState {
  text: string;
  groupKey: string;
  order: string;
  choices: ChoiceDraft[];
}

type QAction =
  | { type: "field"; field: "text" | "groupKey" | "order"; value: string }
  | { type: "addChoice" }
  | { type: "removeChoice"; ci: number }
  | { type: "choiceLabel"; ci: number; value: string }
  | { type: "addScore"; ci: number }
  | { type: "removeScore"; ci: number; si: number }
  | { type: "scoreKey"; ci: number; si: number; value: string }
  | { type: "scoreValue"; ci: number; si: number; value: string };

function blankScoreRow(scoringType: ScoringType): ScoreRowDraft {
  return { key: scoringType === "axis" ? "energy" : "", value: "1" };
}
function blankChoice(scoringType: ScoringType): ChoiceDraft {
  return { label: "", scoreRows: [blankScoreRow(scoringType)] };
}

function makeReducer(scoringType: ScoringType) {
  const mapChoice = (
    state: QState,
    ci: number,
    fn: (c: ChoiceDraft) => ChoiceDraft
  ): QState => ({
    ...state,
    choices: state.choices.map((c, i) => (i === ci ? fn(c) : c)),
  });

  return (state: QState, action: QAction): QState => {
    switch (action.type) {
      case "field":
        return { ...state, [action.field]: action.value };
      case "addChoice":
        return { ...state, choices: [...state.choices, blankChoice(scoringType)] };
      case "removeChoice":
        return {
          ...state,
          choices: state.choices.filter((_, i) => i !== action.ci),
        };
      case "choiceLabel":
        return mapChoice(state, action.ci, (c) => ({ ...c, label: action.value }));
      case "addScore":
        return mapChoice(state, action.ci, (c) => ({
          ...c,
          scoreRows: [...c.scoreRows, blankScoreRow(scoringType)],
        }));
      case "removeScore":
        return mapChoice(state, action.ci, (c) => ({
          ...c,
          scoreRows: c.scoreRows.filter((_, j) => j !== action.si),
        }));
      case "scoreKey":
        return mapChoice(state, action.ci, (c) => ({
          ...c,
          scoreRows: c.scoreRows.map((r, j) =>
            j === action.si ? { ...r, key: action.value } : r
          ),
        }));
      case "scoreValue":
        return mapChoice(state, action.ci, (c) => ({
          ...c,
          scoreRows: c.scoreRows.map((r, j) =>
            j === action.si ? { ...r, value: action.value } : r
          ),
        }));
      default:
        return state;
    }
  };
}

function initState(
  scoringType: ScoringType,
  initial?: AdminQuestionData,
  defaultOrder?: number
): QState {
  if (initial) {
    return {
      text: initial.text,
      groupKey: initial.groupKey ?? "",
      order: String(initial.order),
      choices: initial.choices.map((c) => ({
        label: c.label,
        scoreRows: Object.entries(c.scores).map(([key, value]) => ({
          key,
          value: String(value),
        })),
      })),
    };
  }
  return {
    text: "",
    groupKey: "",
    order: String(defaultOrder ?? 1),
    choices: [blankChoice(scoringType), blankChoice(scoringType)],
  };
}

interface QuestionCardProps {
  mode: "create" | "edit";
  testId: string;
  scoringType: ScoringType;
  resultCodes: string[];
  initial?: AdminQuestionData;
  defaultOrder?: number;
  onDone?: () => void;
}

const INPUT =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30";

/** 문항 1개 편집 카드(선택지·점수맵 포함). 생성/수정 겸용. */
export function QuestionCard({
  mode,
  testId,
  scoringType,
  resultCodes,
  initial,
  defaultOrder,
  onDone,
}: QuestionCardProps) {
  const router = useRouter();
  const listId = useId();
  const reducer = useMemo(() => makeReducer(scoringType), [scoringType]);
  const [state, dispatch] = useReducer(
    reducer,
    initState(scoringType, initial, defaultOrder)
  );
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  function save() {
    setError(undefined);
    const input: SaveQuestionInput = {
      testId,
      questionId: initial?.id,
      order: parseInt(state.order, 10) || 1,
      text: state.text.trim(),
      groupKey: state.groupKey.trim(),
      choices: state.choices.map((c) => ({
        label: c.label.trim(),
        scores: c.scoreRows
          .filter((r) => r.key.trim() !== "")
          .map((r) => ({ key: r.key.trim(), value: parseFloat(r.value) || 0 })),
      })),
    };
    startTransition(async () => {
      const res = await saveQuestionAction(input);
      if (res.ok) {
        router.refresh();
        onDone?.();
      } else {
        setError(res.error);
      }
    });
  }

  function remove() {
    const qid = initial?.id;
    if (!qid) {
      onDone?.();
      return;
    }
    if (!window.confirm("이 문항을 삭제할까요? 선택지도 함께 삭제됩니다.")) return;
    startTransition(async () => {
      const res = await deleteQuestionAction(qid);
      if (res.ok) router.refresh();
      else setError(res.error);
    });
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <label className="text-xs text-muted-foreground">순서</label>
        <input
          type="number"
          min={1}
          value={state.order}
          onChange={(e) =>
            dispatch({ type: "field", field: "order", value: e.target.value })
          }
          className="h-9 w-16 rounded-lg border border-input bg-background px-2 text-sm outline-none focus:border-primary"
        />
        <span className="text-sm font-medium text-foreground">
          {mode === "create" ? "새 문항" : "문항"}
        </span>
      </div>

      <input
        value={state.text}
        onChange={(e) =>
          dispatch({ type: "field", field: "text", value: e.target.value })
        }
        placeholder="문항 내용 (예: 주말 오후, 가장 끌리는 계획은?)"
        className={INPUT}
      />

      <input
        value={state.groupKey}
        onChange={(e) =>
          dispatch({ type: "field", field: "groupKey", value: e.target.value })
        }
        placeholder="그룹 키 (선택 · 유형별 묶음용)"
        className={INPUT}
      />

      {/* 선택지 */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">선택지</p>
        {state.choices.map((choice, ci) => (
          <div key={ci} className="rounded-lg border border-border p-3">
            <div className="flex items-center gap-2">
              <input
                value={choice.label}
                onChange={(e) =>
                  dispatch({ type: "choiceLabel", ci, value: e.target.value })
                }
                placeholder={`선택지 ${ci + 1}`}
                className={INPUT}
              />
              <button
                type="button"
                onClick={() => dispatch({ type: "removeChoice", ci })}
                disabled={state.choices.length <= 2}
                className="shrink-0 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition hover:bg-secondary disabled:opacity-40"
                title="선택지 삭제"
              >
                ✕
              </button>
            </div>

            {/* 점수맵 */}
            <div className="mt-2 space-y-1.5 pl-1">
              {choice.scoreRows.map((row, si) => (
                <div key={si} className="flex items-center gap-2">
                  {scoringType === "axis" ? (
                    <select
                      value={row.key}
                      onChange={(e) =>
                        dispatch({
                          type: "scoreKey",
                          ci,
                          si,
                          value: e.target.value,
                        })
                      }
                      className="h-9 flex-1 rounded-lg border border-input bg-background px-2 text-sm outline-none focus:border-primary"
                    >
                      {MBTI_AXES.map((a) => (
                        <option key={a.key} value={a.key}>
                          {a.key} ({a.positive}/{a.negative})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={row.key}
                      list={listId}
                      onChange={(e) =>
                        dispatch({
                          type: "scoreKey",
                          ci,
                          si,
                          value: e.target.value,
                        })
                      }
                      placeholder="결과 코드"
                      className="h-9 flex-1 rounded-lg border border-input bg-background px-2 text-sm outline-none focus:border-primary"
                    />
                  )}
                  <input
                    type="number"
                    step={scoringType === "axis" ? "0.5" : "1"}
                    value={row.value}
                    onChange={(e) =>
                      dispatch({
                        type: "scoreValue",
                        ci,
                        si,
                        value: e.target.value,
                      })
                    }
                    className="h-9 w-20 rounded-lg border border-input bg-background px-2 text-sm outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => dispatch({ type: "removeScore", ci, si })}
                    className="shrink-0 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition hover:bg-secondary"
                    title="점수 삭제"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => dispatch({ type: "addScore", ci })}
                className="text-xs font-medium text-primary transition hover:underline"
              >
                + 점수 항목
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => dispatch({ type: "addChoice" })}
          className="rounded-lg border border-dashed border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-secondary"
        >
          + 선택지 추가
        </button>
      </div>

      {scoringType === "sum" && resultCodes.length > 0 ? (
        <datalist id={listId}>
          {resultCodes.map((code) => (
            <option key={code} value={code} />
          ))}
        </datalist>
      ) : null}

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-dark disabled:opacity-60"
        >
          {pending ? "저장 중…" : "문항 저장"}
        </button>
        <button
          type="button"
          onClick={remove}
          disabled={pending}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-red-main transition hover:bg-red-lighter disabled:opacity-50"
        >
          {mode === "create" ? "취소" : "삭제"}
        </button>
      </div>
    </div>
  );
}
