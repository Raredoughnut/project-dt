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
