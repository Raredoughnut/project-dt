"use server";

import { revalidatePath, updateTag } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@/src/server/db";
import { tests, questions, choices, resultCards } from "@/src/server/db/schema";
import { isUniqueViolation } from "@/src/server/db/pg-error";
import {
  saveQuestionSchema,
  saveResultCardSchema,
  type SaveQuestionInput,
  type SaveResultCardInput,
} from "@/src/domain/schemas";
import { getCurrentAdmin } from "@/src/server/auth/session-cookie";
import type { ScoreMap, ActionResult } from "@/src/domain/types";

/* ── 내부 헬퍼 ─────────────────────────────────────────────────────────── */

async function requireAdmin(): Promise<void> {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("unauthorized");
}

function firstError(issues: readonly { message: string }[]): string {
  return issues[0]?.message ?? "입력값을 확인해주세요.";
}

/** score row 배열 → ScoreMap (같은 키는 마지막 값이 우선). */
function toScoreMap(rows: { key: string; value: number }[]): ScoreMap {
  const map: ScoreMap = {};
  for (const r of rows) map[r.key] = r.value;
  return map;
}

/** 공개 페이지 캐시 + 편집 화면 무효화. */
function invalidate(slug: string, testId: string) {
  updateTag("tests");
  updateTag(`test:${slug}`);
  revalidatePath(`/admin/tests/${testId}`);
}

async function getSlug(testId: string): Promise<string | null> {
  const [t] = await db
    .select({ slug: tests.slug })
    .from(tests)
    .where(eq(tests.id, testId))
    .limit(1);
  return t?.slug ?? null;
}

/* ── 문항(+선택지) ─────────────────────────────────────────────────────── */

/** 문항 생성/수정 — 선택지는 통째로 교체(삭제 후 재삽입). */
export async function saveQuestionAction(
  input: SaveQuestionInput
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = saveQuestionSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error.issues) };
  const data = parsed.data;

  const slug = await getSlug(data.testId);
  if (!slug) return { ok: false, error: "테스트를 찾을 수 없습니다." };

  await db.transaction(async (tx) => {
    let qid: string;
    if (data.questionId) {
      qid = data.questionId;
      await tx
        .update(questions)
        .set({ order: data.order, text: data.text, groupKey: data.groupKey || null })
        .where(eq(questions.id, qid));
      await tx.delete(choices).where(eq(choices.questionId, qid));
    } else {
      const [q] = await tx
        .insert(questions)
        .values({
          testId: data.testId,
          order: data.order,
          text: data.text,
          groupKey: data.groupKey || null,
        })
        .returning({ id: questions.id });
      qid = q.id;
    }

    await tx.insert(choices).values(
      data.choices.map((c, i) => ({
        questionId: qid,
        order: i + 1,
        label: c.label,
        scores: toScoreMap(c.scores),
      }))
    );
  });

  invalidate(slug, data.testId);
  return { ok: true };
}

/** 문항 삭제(선택지 cascade). */
export async function deleteQuestionAction(
  questionId: string
): Promise<ActionResult> {
  await requireAdmin();
  const [q] = await db
    .select({ testId: questions.testId })
    .from(questions)
    .where(eq(questions.id, questionId))
    .limit(1);
  if (!q) return { ok: false, error: "문항을 찾을 수 없습니다." };

  const slug = await getSlug(q.testId);
  await db.delete(questions).where(eq(questions.id, questionId));
  if (slug) invalidate(slug, q.testId);
  return { ok: true };
}

/* ── 결과카드 ──────────────────────────────────────────────────────────── */

/** 결과카드 생성/수정. code 는 테스트 내 유일. */
export async function saveResultCardAction(
  input: SaveResultCardInput
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = saveResultCardSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error.issues) };
  const data = parsed.data;

  const slug = await getSlug(data.testId);
  if (!slug) return { ok: false, error: "테스트를 찾을 수 없습니다." };

  try {
    if (data.cardId) {
      await db
        .update(resultCards)
        .set({
          code: data.code,
          title: data.title,
          subtitle: data.subtitle || null,
          description: data.description || null,
          traits: data.traits,
        })
        .where(eq(resultCards.id, data.cardId));
    } else {
      await db.insert(resultCards).values({
        testId: data.testId,
        code: data.code,
        title: data.title,
        subtitle: data.subtitle || null,
        description: data.description || null,
        traits: data.traits,
        recommendedSlugs: [],
      });
    }
  } catch (e) {
    if (isUniqueViolation(e))
      return { ok: false, error: "이미 사용 중인 결과 코드입니다." };
    throw e;
  }

  invalidate(slug, data.testId);
  return { ok: true };
}

/** 결과카드 삭제. */
export async function deleteResultCardAction(
  cardId: string
): Promise<ActionResult> {
  await requireAdmin();
  const [rc] = await db
    .select({ testId: resultCards.testId })
    .from(resultCards)
    .where(eq(resultCards.id, cardId))
    .limit(1);
  if (!rc) return { ok: false, error: "결과카드를 찾을 수 없습니다." };

  const slug = await getSlug(rc.testId);
  await db.delete(resultCards).where(eq(resultCards.id, cardId));
  if (slug) invalidate(slug, rc.testId);
  return { ok: true };
}
