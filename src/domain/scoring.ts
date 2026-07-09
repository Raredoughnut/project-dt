import type {
  AxisConfig,
  ScoreInput,
  ScoreMap,
  ScoreResult,
} from "./types";

/* ========================================================================
   donutest — 채점 엔진 (순수 함수)
   sum: 최고점 차원이 결과 · axis: 축별 우세 폴을 이어 코드 구성
   ======================================================================== */

/** 여러 점수 맵을 차원별로 합산한다. */
export function mergeScores(maps: ScoreMap[]): ScoreMap {
  const totals: ScoreMap = {};
  for (const map of maps) {
    for (const [key, value] of Object.entries(map)) {
      totals[key] = (totals[key] ?? 0) + value;
    }
  }
  return totals;
}

/** 동점 후보 중 하나를 결정: tieBreak 우선순위 → 없으면 사전순. */
function pickTieBreak(candidates: string[], tieBreak?: string[]): string {
  if (candidates.length === 1) return candidates[0];
  if (tieBreak) {
    const byPriority = tieBreak.find((c) => candidates.includes(c));
    if (byPriority) return byPriority;
  }
  return [...candidates].sort()[0];
}

/** sum 채점: 최고점 차원이 결과. 동점 시 tieBreak 우선, 없으면 사전순. */
export function scoreSum(
  selectedScores: ScoreMap[],
  tieBreak?: string[]
): ScoreResult {
  const totals = mergeScores(selectedScores);
  const keys = Object.keys(totals);
  if (keys.length === 0) {
    throw new Error("scoreSum: 합산할 점수가 없습니다.");
  }
  const max = Math.max(...keys.map((k) => totals[k]));
  const candidates = keys.filter((k) => totals[k] === max);
  return { code: pickTieBreak(candidates, tieBreak), totals };
}

/** axis 채점: 축마다 우세한 폴 문자를 이어 코드 구성 (동점 시 positive). */
export function scoreAxis(
  selectedScores: ScoreMap[],
  axes: AxisConfig[]
): ScoreResult {
  if (axes.length === 0) {
    throw new Error("scoreAxis: axes 구성이 비어 있습니다.");
  }
  const totals = mergeScores(selectedScores);
  const code = axes
    .map((axis) => {
      const pos = totals[axis.positive] ?? 0;
      const neg = totals[axis.negative] ?? 0;
      return pos >= neg ? axis.positive : axis.negative;
    })
    .join("");
  return { code, totals };
}

/** scoringType에 따라 적절한 채점 함수로 디스패치. */
export function score(input: ScoreInput): ScoreResult {
  if (input.scoringType === "axis") {
    if (!input.axes) {
      throw new Error("score: axis 채점에는 axes 구성이 필요합니다.");
    }
    return scoreAxis(input.selectedScores, input.axes);
  }
  return scoreSum(input.selectedScores, input.tieBreak);
}

/* ── DB ↔ 엔진 브릿지 ─────────────────────────────────────────────────── */

export interface AnswerableChoice {
  id: string;
  scores: ScoreMap;
}
export interface AnswerableQuestion {
  id: string;
  choices: AnswerableChoice[];
}
export interface Answer {
  questionId: string;
  choiceId: string;
}

/**
 * 답변(questionId → choiceId)을 선택지 점수 맵 목록으로 변환한다.
 * 존재하지 않는 질문/선택지면 예외를 던져 위조된 제출을 차단한다.
 */
export function collectSelectedScores(
  questions: AnswerableQuestion[],
  answers: Answer[]
): ScoreMap[] {
  const byQuestion = new Map(questions.map((q) => [q.id, q]));
  return answers.map((a) => {
    const q = byQuestion.get(a.questionId);
    if (!q) {
      throw new Error(`collectSelectedScores: 알 수 없는 질문 ${a.questionId}`);
    }
    const choice = q.choices.find((c) => c.id === a.choiceId);
    if (!choice) {
      throw new Error(
        `collectSelectedScores: 질문 ${a.questionId}에 없는 선택지 ${a.choiceId}`
      );
    }
    return choice.scores;
  });
}
