import type { PlayableTest } from "./types";

/* 스캐폴드용 목업. slug 무관하게 "나는 무슨 도넛?"을 반환한다(어떤 /t/[slug]든 동작).
   실제 데이터는 서버 컴포넌트 + DB 쿼리로 주입 예정(로드맵 6). */

const QUESTIONS = [
  {
    text: "주말 오후, 가장 끌리는 계획은?",
    choices: [
      { label: "집에서 뒹굴뒹굴 넷플릭스", code: "classic" },
      { label: "새로 생긴 감성 카페 탐방", code: "matcha" },
      { label: "친구들과 왁자지껄 모임", code: "strawberry" },
      { label: "달콤한 디저트 원정대", code: "choco" },
    ],
  },
  {
    text: "친구들이 말하는 나의 매력은?",
    choices: [
      { label: "편안하고 든든함", code: "classic" },
      { label: "은근한 세련미", code: "matcha" },
      { label: "밝고 사랑스러움", code: "strawberry" },
      { label: "화끈한 리더십", code: "choco" },
    ],
  },
  {
    text: "여행 스타일은?",
    choices: [
      { label: "완벽한 계획표대로", code: "classic" },
      { label: "감성 사진 스팟 위주", code: "matcha" },
      { label: "계획 없이 즉흥적으로", code: "strawberry" },
      { label: "맛집 도장깨기", code: "choco" },
    ],
  },
  {
    text: "새 프로젝트를 맡으면?",
    choices: [
      { label: "꾸준히 마무리까지", code: "classic" },
      { label: "트렌디하게 접근", code: "matcha" },
      { label: "팀 분위기 메이커", code: "strawberry" },
      { label: "저돌적으로 추진", code: "choco" },
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

export function getPlayableTestMock(slug: string): PlayableTest {
  return {
    id: slug,
    slug,
    title: "나는 무슨 도넛?",
    description: "4가지 질문으로 알아보는 나의 도넛 유형. 30초면 충분해요!",
    category: "성격",
    coverImage: null,
    scoringType: "sum",
    questions: QUESTIONS.map((q, qi) => ({
      id: `q${qi + 1}`,
      text: q.text,
      choices: q.choices.map((c, ci) => ({
        id: `q${qi + 1}c${ci + 1}`,
        label: c.label,
        scores: { [c.code]: 1 },
      })),
    })),
    results: RESULTS.map((r) => ({
      code: r.code,
      title: r.title,
      subtitle: r.subtitle,
      description: r.description,
      image: null,
      traits: r.traits,
    })),
  };
}
