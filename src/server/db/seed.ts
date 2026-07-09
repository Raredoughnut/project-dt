import "dotenv/config";
import { eq } from "drizzle-orm";

import { db, client } from "./index";
import {
  tests,
  questions,
  choices,
  resultCards,
  type ScoreMap,
} from "./schema";

/* ========================================================================
   시드: "나는 무슨 도넛?" — 기반 개발/데모용 샘플 테스트 1개.
   sum 채점: 각 선택지가 도넛 유형(코드)에 1점씩 기여, 최고점 유형이 결과.
   slug 기준 idempotent (재실행 시 기존 데이터 삭제 후 재삽입).
   ======================================================================== */

const TEST_SLUG = "what-donut";

type SeedChoice = { label: string; scores: ScoreMap };
type SeedQuestion = { text: string; choices: SeedChoice[] };

// 유형(결과 코드) → 선택지 1개당 해당 유형 1점
const pick = (code: string): ScoreMap => ({ [code]: 1 });

const QUESTIONS: SeedQuestion[] = [
  {
    text: "주말 오후, 가장 끌리는 계획은?",
    choices: [
      { label: "집에서 뒹굴뒹굴 넷플릭스", scores: pick("classic") },
      { label: "새로 생긴 감성 카페 탐방", scores: pick("matcha") },
      { label: "친구들과 왁자지껄 모임", scores: pick("strawberry") },
      { label: "달콤한 디저트 원정대", scores: pick("choco") },
    ],
  },
  {
    text: "친구들이 말하는 나의 매력은?",
    choices: [
      { label: "편안하고 든든함", scores: pick("classic") },
      { label: "은근한 세련미", scores: pick("matcha") },
      { label: "밝고 사랑스러움", scores: pick("strawberry") },
      { label: "화끈한 리더십", scores: pick("choco") },
    ],
  },
  {
    text: "여행 스타일은?",
    choices: [
      { label: "완벽한 계획표대로", scores: pick("classic") },
      { label: "감성 사진 스팟 위주", scores: pick("matcha") },
      { label: "계획 없이 즉흥적으로", scores: pick("strawberry") },
      { label: "맛집 도장깨기", scores: pick("choco") },
    ],
  },
  {
    text: "새 프로젝트를 맡으면?",
    choices: [
      { label: "꾸준히 마무리까지", scores: pick("classic") },
      { label: "트렌디하게 접근", scores: pick("matcha") },
      { label: "팀 분위기 메이커", scores: pick("strawberry") },
      { label: "저돌적으로 추진", scores: pick("choco") },
    ],
  },
];

const RESULTS = [
  {
    code: "classic",
    title: "클래식 글레이즈드 도넛",
    subtitle: "변함없이 든든한 당신",
    description:
      "화려하진 않아도 언제나 곁에서 든든한 사람. 꾸준함과 안정감이 최고의 매력입니다.",
    traits: ["안정적", "성실", "편안함"],
  },
  {
    code: "choco",
    title: "초코 프로스티드 도넛",
    subtitle: "화끈한 에너지의 소유자",
    description:
      "진한 초코처럼 강렬한 존재감. 저돌적인 추진력으로 무리를 이끄는 리더 타입입니다.",
    traits: ["열정적", "추진력", "리더"],
  },
  {
    code: "strawberry",
    title: "딸기 스프링클 도넛",
    subtitle: "모두의 사랑을 받는 인싸",
    description:
      "알록달록 스프링클처럼 밝고 사랑스러운 분위기 메이커. 어디서든 인기 만점입니다.",
    traits: ["사랑스러움", "활발", "긍정"],
  },
  {
    code: "matcha",
    title: "말차 크림 도넛",
    subtitle: "은근한 반전 매력",
    description:
      "쌉싸름함 속 부드러운 크림처럼 은근한 세련미의 소유자. 감성과 트렌드에 밝습니다.",
    traits: ["세련", "감성", "트렌디"],
  },
];

async function seed() {
  console.log(`시드 시작: "${TEST_SLUG}"`);

  // idempotent — 기존 테스트 삭제(cascade로 문항·선택지·결과·응시기록 함께 삭제)
  await db.delete(tests).where(eq(tests.slug, TEST_SLUG));

  const [test] = await db
    .insert(tests)
    .values({
      slug: TEST_SLUG,
      title: "나는 무슨 도넛?",
      description: "4가지 질문으로 알아보는 나의 도넛 유형. 30초면 충분해요!",
      category: "성격",
      scoringType: "sum",
      status: "published",
      authorName: "donutest",
      publishedAt: new Date(),
    })
    .returning();

  for (const [qIndex, q] of QUESTIONS.entries()) {
    const [question] = await db
      .insert(questions)
      .values({ testId: test.id, order: qIndex + 1, text: q.text })
      .returning();

    await db.insert(choices).values(
      q.choices.map((c, cIndex) => ({
        questionId: question.id,
        order: cIndex + 1,
        label: c.label,
        scores: c.scores,
      }))
    );
  }

  await db.insert(resultCards).values(
    RESULTS.map((r) => ({
      testId: test.id,
      code: r.code,
      title: r.title,
      subtitle: r.subtitle,
      description: r.description,
      traits: r.traits,
      recommendedSlugs: [] as string[],
    }))
  );

  console.log(
    `완료: 테스트 1 · 문항 ${QUESTIONS.length} · 선택지 ${QUESTIONS.reduce(
      (n, q) => n + q.choices.length,
      0
    )} · 결과카드 ${RESULTS.length}`
  );
}

seed()
  .catch((err) => {
    console.error("시드 실패:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await client.end({ timeout: 5 });
  });
