"use server";

import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@/src/server/db";
import { banners } from "@/src/server/db/schema";
import { bannerMetaSchema } from "@/src/domain/schemas";
import { getCurrentAdmin } from "@/src/server/auth/session-cookie";
import {
  uploadBannerImage,
  deleteBannerImageByUrl,
  validateImageFile,
} from "@/src/server/storage/supabase";
import type { ActionResult } from "@/src/domain/types";
import type { BannerFormState } from "./admin-banners-types";

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
    title: String(formData.get("title") ?? ""),
    linkUrl: String(formData.get("linkUrl") ?? ""),
    isActive: formData.get("isActive") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
}

/** FormData 의 파일 필드 → 실제 업로드할 File 이면 반환, 비었으면 null. */
function fileFrom(formData: FormData, name: string): File | null {
  const f = formData.get(name);
  if (f instanceof File && f.size > 0) return f;
  return null;
}

function invalidate() {
  updateTag("banners");
  revalidatePath("/admin/banners");
  revalidatePath("/");
}

/* ── 생성 ──────────────────────────────────────────────────────────────── */

/** 새 배너 생성(PC 이미지 필수, 모바일 선택) → 목록으로 이동. */
export async function createBannerAction(
  _prev: BannerFormState,
  formData: FormData
): Promise<BannerFormState> {
  await requireAdmin();

  const parsed = bannerMetaSchema.safeParse(readMeta(formData));
  if (!parsed.success) return { error: firstError(parsed.error.issues) };
  const data = parsed.data;

  const pc = fileFrom(formData, "image");
  if (!pc) return { error: "PC 이미지를 업로드해주세요." };
  const pcErr = validateImageFile(pc);
  if (pcErr) return { error: pcErr };

  const mobile = fileFrom(formData, "mobileImage");
  if (mobile) {
    const mErr = validateImageFile(mobile);
    if (mErr) return { error: mErr };
  }

  let imageUrl: string;
  let mobileImageUrl: string | null = null;
  try {
    imageUrl = await uploadBannerImage(pc, "pc");
    if (mobile) mobileImageUrl = await uploadBannerImage(mobile, "mobile");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "이미지 업로드에 실패했어요." };
  }

  await db.insert(banners).values({
    title: data.title,
    imageUrl,
    mobileImageUrl,
    linkUrl: data.linkUrl || null,
    isActive: data.isActive,
    sortOrder: data.sortOrder,
  });

  invalidate();
  redirect("/admin/banners");
}

/* ── 수정 ──────────────────────────────────────────────────────────────── */

/** 배너 수정. 이미지 파일이 새로 오면 교체(기존 파일 삭제), 없으면 유지. */
export async function updateBannerAction(
  _prev: BannerFormState,
  formData: FormData
): Promise<BannerFormState> {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) return { error: "잘못된 요청입니다." };

  const parsed = bannerMetaSchema.safeParse(readMeta(formData));
  if (!parsed.success) return { error: firstError(parsed.error.issues) };
  const data = parsed.data;

  const [existing] = await db
    .select({
      imageUrl: banners.imageUrl,
      mobileImageUrl: banners.mobileImageUrl,
    })
    .from(banners)
    .where(eq(banners.id, id))
    .limit(1);
  if (!existing) return { error: "배너를 찾을 수 없습니다." };

  const pc = fileFrom(formData, "image");
  const mobile = fileFrom(formData, "mobileImage");
  if (pc) {
    const e = validateImageFile(pc);
    if (e) return { error: e };
  }
  if (mobile) {
    const e = validateImageFile(mobile);
    if (e) return { error: e };
  }

  let imageUrl = existing.imageUrl;
  let mobileImageUrl = existing.mobileImageUrl;
  try {
    if (pc) imageUrl = await uploadBannerImage(pc, "pc");
    if (mobile) mobileImageUrl = await uploadBannerImage(mobile, "mobile");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "이미지 업로드에 실패했어요." };
  }

  await db
    .update(banners)
    .set({
      title: data.title,
      imageUrl,
      mobileImageUrl,
      linkUrl: data.linkUrl || null,
      isActive: data.isActive,
      sortOrder: data.sortOrder,
      updatedAt: new Date(),
    })
    .where(eq(banners.id, id));

  // 교체된 기존 이미지 정리(베스트 에포트).
  if (pc && existing.imageUrl !== imageUrl)
    await deleteBannerImageByUrl(existing.imageUrl);
  if (mobile && existing.mobileImageUrl && existing.mobileImageUrl !== mobileImageUrl)
    await deleteBannerImageByUrl(existing.mobileImageUrl);

  invalidate();
  return { ok: true };
}

/* ── 삭제 · 노출 토글 ──────────────────────────────────────────────────── */

/** 배너 삭제(저장 이미지도 함께 정리). */
export async function deleteBannerAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  const [existing] = await db
    .select({
      imageUrl: banners.imageUrl,
      mobileImageUrl: banners.mobileImageUrl,
    })
    .from(banners)
    .where(eq(banners.id, id))
    .limit(1);
  if (!existing) return { ok: false, error: "배너를 찾을 수 없습니다." };

  await db.delete(banners).where(eq(banners.id, id));
  await deleteBannerImageByUrl(existing.imageUrl);
  await deleteBannerImageByUrl(existing.mobileImageUrl);

  invalidate();
  return { ok: true };
}

/** 노출 여부 토글. */
export async function toggleBannerActiveAction(
  id: string,
  isActive: boolean
): Promise<ActionResult> {
  await requireAdmin();

  const result = await db
    .update(banners)
    .set({ isActive, updatedAt: new Date() })
    .where(eq(banners.id, id))
    .returning({ id: banners.id });
  if (result.length === 0)
    return { ok: false, error: "배너를 찾을 수 없습니다." };

  invalidate();
  return { ok: true };
}
