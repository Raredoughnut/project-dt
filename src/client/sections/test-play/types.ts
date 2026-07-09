import type { Test, Question, Choice, ResultCard } from "@/src/server/db/schema";

/* 테스트 진행 플로우가 받는 데이터 계약. DB 엔티티를 조합한 뷰 DTO. */

export type PlayableChoice = Pick<Choice, "id" | "label" | "scores">;

export type PlayableQuestion = Pick<Question, "id" | "text"> & {
  choices: PlayableChoice[];
};

export type PlayableResult = Pick<
  ResultCard,
  "code" | "title" | "subtitle" | "description" | "image" | "traits"
>;

export type PlayableTest = Pick<
  Test,
  "id" | "slug" | "title" | "description" | "category" | "coverImage" | "scoringType"
> & {
  questions: PlayableQuestion[];
  results: PlayableResult[];
};
