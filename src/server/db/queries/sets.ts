import { eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/src/server/db";
import { testSets } from "@/src/server/db/schema";
import type { CuratedSet } from "@/src/client/sections/home/types";
import type { SetDetail } from "@/src/client/sections/sets/types";

/** 추천 세트 목록 (세트당 미리보기 테스트 최대 3개) */
export async function getAllSets(): Promise<CuratedSet[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("sets");

  const rows = await db.query.testSets.findMany({
    orderBy: (s, { desc }) => desc(s.createdAt),
    with: {
      items: {
        orderBy: (i, { asc }) => asc(i.order),
        with: {
          test: {
            columns: { id: true, slug: true, title: true, coverImage: true },
          },
        },
      },
    },
  });

  return rows.map((s) => ({
    id: s.id,
    slug: s.slug,
    title: s.title,
    description: s.description,
    createdAt: s.createdAt,
    items: s.items.slice(0, 3).map((i) => i.test),
  }));
}

/** 세트 상세 (구성 테스트 전체, order 순) */
export async function getSetBySlug(slug: string): Promise<SetDetail | null> {
  "use cache";
  cacheLife("days");
  cacheTag(`set:${slug}`);

  const row = await db.query.testSets.findFirst({
    where: eq(testSets.slug, slug),
    with: {
      items: {
        orderBy: (i, { asc }) => asc(i.order),
        with: {
          test: {
            columns: {
              id: true,
              slug: true,
              title: true,
              coverImage: true,
              category: true,
            },
          },
        },
      },
    },
  });

  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    createdAt: row.createdAt,
    items: row.items.map((i) => i.test),
  };
}
