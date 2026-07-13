import { z } from "zod";

/* ========================================================================
   donutest — zod 스키마 (런타임 입력 검증)
   주로 응시 제출(클라 → 서버) 페이로드 검증에 사용한다.
   ======================================================================== */

/** 차원 → 점수 맵 */
export const scoreMapSchema = z.record(z.string(), z.number());

/** 한 문항의 답변 */
export const answerSchema = z.object({
  questionId: z.uuid(),
  choiceId: z.uuid(),
});

export const answersSchema = z.array(answerSchema).min(1);

/** 응시 제출 페이로드 — 이후 recordAttempt 서버 액션에서 사용 */
export const submitAttemptSchema = z.object({
  testSlug: z.string().min(1),
  answers: answersSchema,
  /** 개인화용 이름 (선택) */
  name: z.string().trim().min(1).max(20).optional(),
  /** 유입 채널 (선택, 예: kakao) */
  channel: z.string().max(40).optional(),
});

export type Answer = z.infer<typeof answerSchema>;
export type SubmitAttemptInput = z.infer<typeof submitAttemptSchema>;

/* ── 어드민: 테스트 메타 입력 검증 ─────────────────────────────────────── */
export const testMetaSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "제목을 입력해주세요.")
    .max(80, "제목은 80자 이내로 입력해주세요."),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "slug를 입력해주세요.")
    .max(80, "slug는 80자 이내로 입력해주세요.")
    .regex(/^[a-z0-9-]+$/, "slug는 영소문자·숫자·하이픈(-)만 사용할 수 있어요."),
  description: z.string().trim().max(300, "설명은 300자 이내로 입력해주세요."),
  category: z.string().trim().max(40, "카테고리는 40자 이내로 입력해주세요."),
  scoringType: z.enum(["sum", "axis"]),
  status: z.enum(["draft", "published"]),
});

export type TestMetaInput = z.infer<typeof testMetaSchema>;

/* ── 어드민: 문항·선택지·결과카드 입력 검증 ─────────────────────────────── */
export const scoreRowSchema = z.object({
  key: z.string().trim().min(1, "점수 항목을 입력해주세요."),
  value: z.number(),
});

export const choiceInputSchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, "선택지 내용을 입력해주세요.")
    .max(200, "선택지는 200자 이내로 입력해주세요."),
  scores: z.array(scoreRowSchema),
});

export const saveQuestionSchema = z.object({
  testId: z.uuid(),
  questionId: z.uuid().optional(),
  order: z.number().int().min(1),
  text: z
    .string()
    .trim()
    .min(1, "문항 내용을 입력해주세요.")
    .max(300, "문항은 300자 이내로 입력해주세요."),
  groupKey: z.string().trim().max(40),
  choices: z.array(choiceInputSchema).min(2, "선택지는 2개 이상이어야 합니다."),
});

export const saveResultCardSchema = z.object({
  testId: z.uuid(),
  cardId: z.uuid().optional(),
  code: z
    .string()
    .trim()
    .min(1, "결과 코드를 입력해주세요.")
    .max(40, "결과 코드는 40자 이내로 입력해주세요."),
  title: z
    .string()
    .trim()
    .min(1, "결과 제목을 입력해주세요.")
    .max(80, "결과 제목은 80자 이내로 입력해주세요."),
  subtitle: z.string().trim().max(80, "부제목은 80자 이내로 입력해주세요."),
  description: z.string().trim().max(500, "설명은 500자 이내로 입력해주세요."),
  traits: z.array(z.string().trim().min(1)).max(20),
});

export type SaveQuestionInput = z.infer<typeof saveQuestionSchema>;
export type SaveResultCardInput = z.infer<typeof saveResultCardSchema>;

/* ── 어드민: 추천 세트 메타 입력 검증 ───────────────────────────────────── */
export const setMetaSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "세트 제목을 입력해주세요.")
    .max(80, "제목은 80자 이내로 입력해주세요."),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "slug를 입력해주세요.")
    .max(80, "slug는 80자 이내로 입력해주세요.")
    .regex(/^[a-z0-9-]+$/, "slug는 영소문자·숫자·하이픈(-)만 사용할 수 있어요."),
  description: z.string().trim().max(300, "설명은 300자 이내로 입력해주세요."),
});

export type SetMetaInput = z.infer<typeof setMetaSchema>;

/* ── 어드민: 배너 메타 입력 검증 (이미지 파일은 액션에서 별도 처리) ───────── */
export const bannerMetaSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "배너 제목을 입력해주세요.")
    .max(80, "제목은 80자 이내로 입력해주세요."),
  linkUrl: z
    .string()
    .trim()
    .max(500, "링크는 500자 이내로 입력해주세요.")
    .refine(
      (v) => v === "" || v.startsWith("/") || /^https?:\/\//.test(v),
      "링크는 '/'(내부 경로) 또는 http(s):// 로 시작해야 해요."
    ),
  isActive: z.boolean(),
  sortOrder: z
    .number()
    .int("정렬 순서는 정수여야 해요.")
    .min(0, "정렬 순서는 0 이상이어야 해요.")
    .max(9999, "정렬 순서가 너무 큽니다."),
});

export type BannerMetaInput = z.infer<typeof bannerMetaSchema>;
