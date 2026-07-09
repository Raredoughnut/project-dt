import { test } from "node:test";
import assert from "node:assert/strict";

import {
  collectSelectedScores,
  mergeScores,
  score,
  scoreAxis,
  scoreSum,
  type AnswerableQuestion,
} from "./scoring";
import { MBTI_AXES } from "./mbti";
import type { ScoreMap } from "./types";

test("mergeScores: 차원별로 합산", () => {
  const totals = mergeScores([{ a: 1 }, { a: 2, b: 1 }, { b: 3 }]);
  assert.deepEqual(totals, { a: 3, b: 4 });
});

/* ── sum 채점 ───────────────────────────────────────────────────────── */

test("scoreSum: 한 유형에 몰아주면 그 유형이 결과", () => {
  const answers: ScoreMap[] = [
    { classic: 1 },
    { classic: 1 },
    { classic: 1 },
    { classic: 1 },
  ];
  const r = scoreSum(answers);
  assert.equal(r.code, "classic");
  assert.equal(r.totals.classic, 4);
});

test("scoreSum: 최고점 유형이 결과", () => {
  const answers: ScoreMap[] = [
    { classic: 1 },
    { choco: 1 },
    { choco: 1 },
    { matcha: 1 },
  ];
  assert.equal(scoreSum(answers).code, "choco");
});

test("scoreSum: 동점이면 tieBreak 우선순위를 따른다", () => {
  const answers: ScoreMap[] = [{ classic: 1 }, { choco: 1 }];
  assert.equal(scoreSum(answers, ["choco", "classic"]).code, "choco");
  assert.equal(scoreSum(answers, ["classic", "choco"]).code, "classic");
});

test("scoreSum: 동점 + tieBreak 없으면 사전순", () => {
  // 'choco' < 'classic' (두 번째 글자 h < l)
  assert.equal(scoreSum([{ choco: 1 }, { classic: 1 }]).code, "choco");
});

test("scoreSum: 점수가 없으면 예외", () => {
  assert.throws(() => scoreSum([]));
});

/* ── axis 채점 (MBTI) ───────────────────────────────────────────────── */

test("MBTI_AXES: 4축 순서·폴", () => {
  assert.deepEqual(MBTI_AXES.map((a) => a.key), [
    "energy",
    "information",
    "decisions",
    "lifestyle",
  ]);
  assert.deepEqual(MBTI_AXES.map((a) => a.positive + a.negative), [
    "EI",
    "SN",
    "TF",
    "JP",
  ]);
});

test("scoreAxis: 부호 합으로 판정 (>0 앞글자, <0 뒷글자, =0 앞글자)", () => {
  const scores: ScoreMap[] = [
    { energy: 1 },
    { energy: -0.5 }, // energy = +0.5 → E
    { information: -1 }, // = -1 → N
    { decisions: 1 },
    { decisions: -1 }, // = 0 → T (기본)
    { lifestyle: -2 }, // = -2 → P
  ];
  const r = scoreAxis(scores);
  assert.equal(r.code, "ENTP");
  assert.equal(r.totals.energy, 0.5);
  assert.equal(r.totals.decisions, 0);
});

test("scoreAxis: 모든 축 0(또는 없음) → 앞글자 ESTJ", () => {
  assert.equal(scoreAxis([{ energy: 0 }]).code, "ESTJ");
  assert.equal(scoreAxis([]).code, "ESTJ");
});

test("scoreAxis: 2문항 배점(±1)", () => {
  // energy에 I(-1) 두 번 → -2 → I; 나머지 0 → S,T,J
  assert.equal(scoreAxis([{ energy: -1 }, { energy: -1 }]).code, "ISTJ");
});

test("scoreAxis: 4문항 배점(±1, ±0.5)", () => {
  // energy: +1, +0.5, -0.5 → +1 → E
  const r = scoreAxis([{ energy: 1 }, { energy: 0.5 }, { energy: -0.5 }]);
  assert.equal(r.totals.energy, 1);
  assert.equal(r.code[0], "E");
});

/* ── 디스패치 · 브릿지 ──────────────────────────────────────────────── */

test("score: scoringType으로 디스패치 (axis는 MBTI 기본축)", () => {
  assert.equal(
    score({ scoringType: "sum", selectedScores: [{ a: 2 }, { b: 1 }] }).code,
    "a"
  );
  // energy +2 → E, 나머지 0 → S,T,J; lifestyle -1 → P
  assert.equal(
    score({
      scoringType: "axis",
      selectedScores: [{ energy: 2 }, { lifestyle: -1 }],
    }).code,
    "ESTP"
  );
});

test("collectSelectedScores: 답변을 선택지 점수로 변환", () => {
  const questions: AnswerableQuestion[] = [
    {
      id: "q1",
      choices: [
        { id: "c1", scores: { classic: 1 } },
        { id: "c2", scores: { choco: 1 } },
      ],
    },
    { id: "q2", choices: [{ id: "c3", scores: { matcha: 1 } }] },
  ];
  const scores = collectSelectedScores(questions, [
    { questionId: "q1", choiceId: "c2" },
    { questionId: "q2", choiceId: "c3" },
  ]);
  assert.deepEqual(scores, [{ choco: 1 }, { matcha: 1 }]);
});

test("collectSelectedScores: 위조된 선택지는 예외", () => {
  const questions: AnswerableQuestion[] = [
    { id: "q1", choices: [{ id: "c1", scores: {} }] },
  ];
  assert.throws(() =>
    collectSelectedScores(questions, [{ questionId: "q1", choiceId: "x" }])
  );
});

test("end-to-end(sum): what-donut 형태에서 classic 선택 → classic", () => {
  const questions: AnswerableQuestion[] = [1, 2, 3, 4].map(
    (n): AnswerableQuestion => ({
      id: `q${n}`,
      choices: [
        { id: `q${n}-classic`, scores: { classic: 1 } },
        { id: `q${n}-choco`, scores: { choco: 1 } },
        { id: `q${n}-strawberry`, scores: { strawberry: 1 } },
        { id: `q${n}-matcha`, scores: { matcha: 1 } },
      ],
    })
  );
  const answers = questions.map((q) => ({
    questionId: q.id,
    choiceId: `${q.id}-classic`,
  }));
  const selected = collectSelectedScores(questions, answers);
  assert.equal(
    score({ scoringType: "sum", selectedScores: selected }).code,
    "classic"
  );
});

test("end-to-end(axis/MBTI): 축별 문항 선택 → ENFP", () => {
  // 축마다 2지선다(±1). E / N / F / P 선택.
  const questions: AnswerableQuestion[] = [
    {
      id: "energy",
      choices: [
        { id: "e", scores: { energy: 1 } },
        { id: "i", scores: { energy: -1 } },
      ],
    },
    {
      id: "information",
      choices: [
        { id: "s", scores: { information: 1 } },
        { id: "n", scores: { information: -1 } },
      ],
    },
    {
      id: "decisions",
      choices: [
        { id: "t", scores: { decisions: 1 } },
        { id: "f", scores: { decisions: -1 } },
      ],
    },
    {
      id: "lifestyle",
      choices: [
        { id: "j", scores: { lifestyle: 1 } },
        { id: "p", scores: { lifestyle: -1 } },
      ],
    },
  ];
  const answers = [
    { questionId: "energy", choiceId: "e" }, // E
    { questionId: "information", choiceId: "n" }, // N
    { questionId: "decisions", choiceId: "f" }, // F
    { questionId: "lifestyle", choiceId: "p" }, // P
  ];
  const selected = collectSelectedScores(questions, answers);
  assert.equal(
    score({ scoringType: "axis", selectedScores: selected }).code,
    "ENFP"
  );
});
