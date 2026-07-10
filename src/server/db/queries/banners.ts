import { asc, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/src/server/db";
import { banners, type Banner } from "@/src/server/db/schema";
import type { BannerItem } from "@/src/client/sections/home/types";

/**
 * 메인 캐러셀용 활성 배너 (공개).
 * is_active=true 만, sort_order 오름차순 → 최신순. `use cache` + 태그.
 */
export async function getActiveBanners(): Promise<BannerItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("banners");

  const rows = await db
    .select({
      id: banners.id,
      title: banners.title,
      imageUrl: banners.imageUrl,
      mobileImageUrl: banners.mobileImageUrl,
      linkUrl: banners.linkUrl,
    })
    .from(banners)
    .where(eq(banners.isActive, true))
    .orderBy(asc(banners.sortOrder), desc(banners.createdAt));

  return rows;
}

/** 어드민 배너 목록 (전체, 캐시 없음). */
export async function getAdminBanners(): Promise<Banner[]> {
  return db
    .select()
    .from(banners)
    .orderBy(asc(banners.sortOrder), desc(banners.createdAt));
}

/** 어드민 단일 배너 (편집용). 없으면 null. */
export async function getAdminBanner(id: string): Promise<Banner | null> {
  const [row] = await db
    .select()
    .from(banners)
    .where(eq(banners.id, id))
    .limit(1);
  return row ?? null;
}
