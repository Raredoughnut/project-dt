"use server";

import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@/src/server/db";
import { tests, resultCards } from "@/src/server/db/schema";
import { isUniqueViolation } from "@/src/server/db/pg-error";
import { testMetaSchema } from "@/src/domain/schemas";
import { getCurrentAdmin } from "@/src/server/auth/session-cookie";
import {
  uploadImage,
  deleteImageByUrl,
  validateImageFile,
} from "@/src/server/storage/supabase";
import type { AdminSession } from "@/src/server/auth/session";
import type { TestFormState } from "./admin-tests-types";

/* ── 내부 헬퍼 ─────────────────────────────────────────────────────────── */

async function requireAdmin(): Promise<AdminSession> {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("unauthorized");
  return admin;
}

function readMeta(formData: FormData) {
  return {
    title: formData.get("title") ?? "",
    slug: formData.get("slug") ?? "",
    description: formData.get("description") ?? "",
    category: formData.get("category") ?? "",
    scoringType: formData.get("scoringType") ?? "",
    status: formData.get("status") ?? "",
  };
}

function firstError(issues: readonly { message: string }[]): string {
  return issues[0]?.message ?? "입력값을 확인해주세요.";
}

/** FormData 의 파일 필드 → 실제 업로드할 File 이면 반환, 비었으면 null. */
function fileFrom(formData: FormData, name: string): File | null {
  const f = formData.get(name);
  if (f instanceof File && f.size > 0) return f;
  return null;
}

/** 공개 페이지 캐시 무효화(홈 목록 + 해당 테스트 상세). */
function invalidatePublic(slug: string) {
  updateTag("tests");
  updateTag(`test:${slug}`);
}

/* ── 액션 ──────────────────────────────────────────────────────────────── */

/** 새 테스트 생성 → 편집 화면으로 이동. */
export async function createTestAction(
  _prev: TestFormState,
  formData: FormData
): Promise<TestFormState> {
  const admin = await requireAdmin();
  const parsed = testMetaSchema.safeParse(readMeta(formData));
  if (!parsed.success) return { error: firstError(parsed.error.issues) };
  const data = parsed.data;

  const cover = fileFrom(formData, "coverImage");
  if (cover) {
    const err = validateImageFile(cover);
    if (err) return { error: err };
  }
  let coverImage: string | null = null;
  try {
    if (cover) coverImage = await uploadImage(cover, "test-cover");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "이미지 업로드에 실패했어요." };
  }

  let newId: string;
  try {
    const [created] = await db
      .insert(tests)
      .values({
        slug: data.slug,
        title: data.title,
        description: data.description || null,
        category: data.category || null,
        coverImage,
        scoringType: data.scoringType,
        status: data.status,
        authorName: admin.username,
        publishedAt: data.status === "published" ? new Date() : null,
      })
      .returning({ id: tests.id, slug: tests.slug });
    newId = created.id;
    invalidatePublic(created.slug);
  } catch (e) {
    if (isUniqueViolation(e)) return { error: "이미 사용 중인 slug입니다." };
    throw e;
  }

  revalidatePath("/admin/tests");
  redirect(`/admin/tests/${newId}`);
}

/** 테스트 메타 수정. */
export async function updateTestMetaAction(
  _prev: TestFormState,
  formData: FormData
): Promise<TestFormState> {
  await requireAdmin();
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return { error: "잘못된 요청입니다." };

  const parsed = testMetaSchema.safeParse(readMeta(formData));
  if (!parsed.success) return { error: firstError(parsed.error.issues) };
  const data = parsed.data;

  const [existing] = await db
    .select({
      slug: tests.slug,
      publishedAt: tests.publishedAt,
      coverImage: tests.coverImage,
    })
    .from(tests)
    .where(eq(tests.id, id))
    .limit(1);
  if (!existing) return { error: "테스트를 찾을 수 없습니다." };

  const publishedAt =
    data.status === "published" ? existing.publishedAt ?? new Date() : null;

  const cover = fileFrom(formData, "coverImage");
  if (cover) {
    const err = validateImageFile(cover);
    if (err) return { error: err };
  }
  let coverImage = existing.coverImage;
  try {
    if (cover) coverImage = await uploadImage(cover, "test-cover");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "이미지 업로드에 실패했어요." };
  }

  try {
    await db
      .update(tests)
      .set({
        slug: data.slug,
        title: data.title,
        description: data.description || null,
        category: data.category || null,
        coverImage,
        scoringType: data.scoringType,
        status: data.status,
        publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(tests.id, id));
  } catch (e) {
    if (isUniqueViolation(e)) return { error: "이미 사용 중인 slug입니다." };
    throw e;
  }

  // 교체된 기존 이미지 정리(베스트 에포트).
  if (cover && existing.coverImage && existing.coverImage !== coverImage)
    await deleteImageByUrl(existing.coverImage);

  invalidatePublic(existing.slug); // 이전 slug
  invalidatePublic(data.slug); // 변경된 slug
  revalidatePath("/admin/tests");
  revalidatePath(`/admin/tests/${id}`);
  return { ok: true };
}

/** 공개/비공개 전환. */
export async function setTestStatusAction(
  id: string,
  status: "draft" | "published"
): Promise<void> {
  await requireAdmin();
  const [existing] = await db
    .select({ slug: tests.slug, publishedAt: tests.publishedAt })
    .from(tests)
    .where(eq(tests.id, id))
    .limit(1);
  if (!existing) return;

  await db
    .update(tests)
    .set({
      status,
      publishedAt:
        status === "published" ? existing.publishedAt ?? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(tests.id, id));

  invalidatePublic(existing.slug);
  revalidatePath("/admin/tests");
}

/** 테스트 삭제(문항·선택지·결과·응시 cascade). */
export async function deleteTestAction(id: string): Promise<void> {
  await requireAdmin();
  const [existing] = await db
    .select({ slug: tests.slug, coverImage: tests.coverImage })
    .from(tests)
    .where(eq(tests.id, id))
    .limit(1);
  if (!existing) return;

  // 저장 이미지 정리를 위해 결과카드 이미지 URL 을 먼저 수집(삭제는 cascade).
  const rcImages = await db
    .select({ image: resultCards.image })
    .from(resultCards)
    .where(eq(resultCards.testId, id));

  await db.delete(tests).where(eq(tests.id, id));

  await deleteImageByUrl(existing.coverImage);
  for (const r of rcImages) await deleteImageByUrl(r.image);

  invalidatePublic(existing.slug);
  revalidatePath("/admin/tests");
}
