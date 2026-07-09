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
import type { ScoreMap } from "./types";

test("mergeScores: 차원별로 합산", () => {
  const totals = mergeScores([{ a: 1 }, { a: 2, b: 1 }, { b: 3 }]);
  assert.deepEqual(totals, { a: 3, b: 4 });
});

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

test("scoreAxis: 축별 우세 폴 문자로 코드 구성 (동점은 positive)", () => {
  const axes = [
    { positive: "E", negative: "I" },
    { positive: "N", negative: "S" },
    { positive: "F", negative: "T" },
    { positive: "P", negative: "J" },
  ];
  const answers: ScoreMap[] = [
    { E: 1 },
    { E: 1 },
    { I: 1 }, // E 2 > I 1 → E
    { N: 1 },
    { S: 1 }, // 동점 → positive N
    { F: 1 },
    { F: 1 }, // F
    { P: 1 },
    { J: 1 },
    { J: 1 }, // J 2 > P 1 → J
  ];
  assert.equal(scoreAxis(answers, axes).code, "ENFJ");
});

test("score: scoringType으로 디스패치", () => {
  assert.equal(
    score({ scoringType: "sum", selectedScores: [{ a: 2 }, { b: 1 }] }).code,
    "a"
  );
  assert.throws(() =>
    score({ scoringType: "axis", selectedScores: [{ E: 1 }] })
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

test("end-to-end: what-donut 형태에서 classic 선택 → classic 결과", () => {
  // 시드의 sum형 테스트를 축약 모사: 문항마다 classic 선택지 선택
  const questions: AnswerableQuestion[] = [1, 2, 3, 4].map((n): AnswerableQuestion => ({
    id: `q${n}`,
    choices: [
      { id: `q${n}-classic`, scores: { classic: 1 } },
      { id: `q${n}-choco`, scores: { choco: 1 } },
      { id: `q${n}-strawberry`, scores: { strawberry: 1 } },
      { id: `q${n}-matcha`, scores: { matcha: 1 } },
    ],
  }));
  const answers = questions.map((q) => ({
    questionId: q.id,
    choiceId: `${q.id}-classic`,
  }));
  const selected = collectSelectedScores(questions, answers);
  assert.equal(score({ scoringType: "sum", selectedScores: selected }).code, "classic");
});
