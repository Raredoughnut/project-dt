import { and, desc, eq, gt, ilike, or, sql } from "drizzle-orm";

import { db } from "@/src/server/db";
import { attempts, tests } from "@/src/server/db/schema";
import type {
  SearchResultTest,
  SearchSort,
} from "@/src/client/sections/search/types";

/**
 * 검색: 제목·카테고리 부분일치(대소문자 무시) + 정렬(인기/최신).
 * 사용자 입력에 따라 매번 달라지므로 캐시하지 않는다(컨테이너의 Suspense로 스트리밍).
 */
export async function searchTests({
  q,
  sort,
}: {
  q: string;
  sort: SearchSort;
}): Promise<SearchResultTest[]> {
  const query = q.trim();
  const filter = query
    ? or(ilike(tests.title, `%${query}%`), ilike(tests.category, `%${query}%`))
    : undefined;

  const rows = await db
    .select({
      test: tests,
      attemptCount: sql<number>`count(${attempts.id})::int`,
    })
    .from(tests)
    .leftJoin(
      attempts,
      and(
        eq(attempts.testId, tests.id),
        gt(attempts.createdAt, sql`now() - interval '7 days'`)
      )
    )
    .where(and(eq(tests.status, "published"), filter))
    .groupBy(tests.id)
    .orderBy(
      ...(sort === "latest"
        ? [desc(tests.publishedAt)]
        : [desc(sql`count(${attempts.id})`), desc(tests.publishedAt)])
    )
    .limit(50);

  return rows.map((r) => ({ ...r.test, attemptCount: r.attemptCount }));
}
