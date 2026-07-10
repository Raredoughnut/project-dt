"use server";

import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { asc, eq, sql } from "drizzle-orm";

import { db } from "@/src/server/db";
import { testSets, testSetItems } from "@/src/server/db/schema";
import { isUniqueViolation } from "@/src/server/db/pg-error";
import { setMetaSchema } from "@/src/domain/schemas";
import { getCurrentAdmin } from "@/src/server/auth/session-cookie";
import type { ActionResult } from "@/src/domain/types";
import type { SetFormState } from "./admin-sets-types";

/* ── 내부 헬퍼 ─────────────────────────────────────────────────────────── */

async function requireAdmin(): Promise<void> {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("unauthorized");
}

function firstError(issues: readonly { message: string }[]): string {
  return issues[0]?.message ?? "입력값을 확인해주세요.";
}

function readMeta(formData: FormData) {
  return {
    title: formData.get("title") ?? "",
    slug: formData.get("slug") ?? "",
    description: formData.get("description") ?? "",
  };
}

async function getSetSlug(setId: string): Promise<string | null> {
  const [s] = await db
    .select({ slug: testSets.slug })
    .from(testSets)
    .where(eq(testSets.id, setId))
    .limit(1);
  return s?.slug ?? null;
}

function invalidate(slug: string, setId: string) {
  updateTag("sets");
  updateTag(`set:${slug}`);
  revalidatePath(`/admin/sets/${setId}`);
}

/* ── 세트 메타 ─────────────────────────────────────────────────────────── */

/** 새 세트 생성 → 편집 화면으로 이동. */
export async function createSetAction(
  _prev: SetFormState,
  formData: FormData
): Promise<SetFormState> {
  await requireAdmin();
  const parsed = setMetaSchema.safeParse(readMeta(formData));
  if (!parsed.success) return { error: firstError(parsed.error.issues) };
  const data = parsed.data;

  let newId: string;
  try {
    const [created] = await db
      .insert(testSets)
      .values({
        slug: data.slug,
        title: data.title,
        description: data.description || null,
      })
      .returning({ id: testSets.id });
    newId = created.id;
  } catch (e) {
    if (isUniqueViolation(e)) return { error: "이미 사용 중인 slug입니다." };
    throw e;
  }

  updateTag("sets");
  revalidatePath("/admin/sets");
  redirect(`/admin/sets/${newId}`);
}

/** 세트 메타 수정. */
export async function updateSetMetaAction(
  _prev: SetFormState,
  formData: FormData
): Promise<SetFormState> {
  await requireAdmin();
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return { error: "잘못된 요청입니다." };

  const parsed = setMetaSchema.safeParse(readMeta(formData));
  if (!parsed.success) return { error: firstError(parsed.error.issues) };
  const data = parsed.data;

  const [existing] = await db
    .select({ slug: testSets.slug })
    .from(testSets)
    .where(eq(testSets.id, id))
    .limit(1);
  if (!existing) return { error: "세트를 찾을 수 없습니다." };

  try {
    await db
      .update(testSets)
      .set({
        slug: data.slug,
        title: data.title,
        description: data.description || null,
      })
      .where(eq(testSets.id, id));
  } catch (e) {
    if (isUniqueViolation(e)) return { error: "이미 사용 중인 slug입니다." };
    throw e;
  }

  updateTag("sets");
  updateTag(`set:${existing.slug}`);
  updateTag(`set:${data.slug}`);
  revalidatePath("/admin/sets");
  revalidatePath(`/admin/sets/${id}`);
  return { ok: true };
}

/** 세트 삭제(구성 항목 cascade). */
export async function deleteSetAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const [existing] = await db
    .select({ slug: testSets.slug })
    .from(testSets)
    .where(eq(testSets.id, id))
    .limit(1);
  if (!existing) return { ok: false, error: "세트를 찾을 수 없습니다." };

  await db.delete(testSets).where(eq(testSets.id, id));
  updateTag("sets");
  updateTag(`set:${existing.slug}`);
  revalidatePath("/admin/sets");
  return { ok: true };
}

/* ── 구성 테스트(항목) ─────────────────────────────────────────────────── */

/** 세트에 테스트 추가(맨 뒤 순서). */
export async function addSetItemAction(
  setId: string,
  testId: string
): Promise<ActionResult> {
  await requireAdmin();
  const slug = await getSetSlug(setId);
  if (!slug) return { ok: false, error: "세트를 찾을 수 없습니다." };

  const [{ next }] = await db
    .select({
      next: sql<number>`coalesce(max(${testSetItems.order}), 0) + 1`,
    })
    .from(testSetItems)
    .where(eq(testSetItems.testSetId, setId));

  try {
    await db
      .insert(testSetItems)
      .values({ testSetId: setId, testId, order: next });
  } catch (e) {
    if (isUniqueViolation(e))
      return { ok: false, error: "이미 세트에 포함된 테스트입니다." };
    throw e;
  }

  invalidate(slug, setId);
  return { ok: true };
}

/** 세트에서 항목 제거. */
export async function removeSetItemAction(itemId: string): Promise<ActionResult> {
  await requireAdmin();
  const [item] = await db
    .select({ setId: testSetItems.testSetId })
    .from(testSetItems)
    .where(eq(testSetItems.id, itemId))
    .limit(1);
  if (!item) return { ok: false, error: "항목을 찾을 수 없습니다." };

  const slug = await getSetSlug(item.setId);
  await db.delete(testSetItems).where(eq(testSetItems.id, itemId));
  if (slug) invalidate(slug, item.setId);
  return { ok: true };
}

/** 항목 순서 변경(이웃과 order 교환). */
export async function moveSetItemAction(
  itemId: string,
  direction: "up" | "down"
): Promise<ActionResult> {
  await requireAdmin();
  const [item] = await db
    .select({
      id: testSetItems.id,
      setId: testSetItems.testSetId,
      order: testSetItems.order,
    })
    .from(testSetItems)
    .where(eq(testSetItems.id, itemId))
    .limit(1);
  if (!item) return { ok: false, error: "항목을 찾을 수 없습니다." };

  const siblings = await db
    .select({ id: testSetItems.id, order: testSetItems.order })
    .from(testSetItems)
    .where(eq(testSetItems.testSetId, item.setId))
    .orderBy(asc(testSetItems.order));

  const idx = siblings.findIndex((s) => s.id === item.id);
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= siblings.length) return { ok: true }; // 끝단
  const other = siblings[swapIdx];

  await db.transaction(async (tx) => {
    await tx
      .update(testSetItems)
      .set({ order: other.order })
      .where(eq(testSetItems.id, item.id));
    await tx
      .update(testSetItems)
      .set({ order: item.order })
      .where(eq(testSetItems.id, other.id));
  });

  const slug = await getSetSlug(item.setId);
  if (slug) invalidate(slug, item.setId);
  return { ok: true };
}
