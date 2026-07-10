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
