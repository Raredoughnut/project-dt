import { and, desc, eq, gt, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/src/server/db";
import { attempts, tests, type Test } from "@/src/server/db/schema";
import type { PlayableTest } from "@/src/client/sections/test-play/types";
import type { PopularTest } from "@/src/client/sections/home/types";

/* 최근 7일 인기 집계용 SQL 조각 */
const within7days = sql`now() - interval '7 days'`;

/**
 * 진행/소개/결과/OG 가 쓰는 전체 테스트(문항·선택지·결과카드 포함).
 * 미발행/없는 slug → null.
 */
export async function getPlayableTest(
  slug: string
): Promise<PlayableTest | null> {
  "use cache";
  cacheLife("days");
  cacheTag(`test:${slug}`);

  const row = await db.query.tests.findFirst({
    where: and(eq(tests.slug, slug), eq(tests.status, "published")),
    columns: {
      id: true,
      slug: true,
      title: true,
      description: true,
      category: true,
      coverImage: true,
      scoringType: true,
    },
    with: {
      questions: {
        columns: { id: true, text: true },
        orderBy: (q, { asc }) => asc(q.order),
        with: {
          choices: {
            columns: { id: true, label: true, scores: true },
            orderBy: (c, { asc }) => asc(c.order),
          },
        },
      },
      resultCards: {
        columns: {
          code: true,
          title: true,
          subtitle: true,
          description: true,
          image: true,
          traits: true,
        },
      },
    },
  });

  if (!row) return null;
  const { resultCards, ...rest } = row;
  return { ...rest, results: resultCards };
}

/** 최신 발행 테스트 (publishedAt desc) */
export async function getLatestTests(limit = 10): Promise<Test[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("tests");

  return db
    .select()
    .from(tests)
    .where(eq(tests.status, "published"))
    .orderBy(desc(tests.publishedAt))
    .limit(limit);
}

/** 최근 7일 응시 수 기준 인기 테스트 */
export async function getPopularTests(limit = 5): Promise<PopularTest[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("tests");
  cacheTag("attempts");

  const rows = await db
    .select({
      test: tests,
      attemptCount: sql<number>`count(${attempts.id})::int`,
    })
    .from(tests)
    .leftJoin(
      attempts,
      and(eq(attempts.testId, tests.id), gt(attempts.createdAt, within7days))
    )
    .where(eq(tests.status, "published"))
    .groupBy(tests.id)
    .orderBy(desc(sql`count(${attempts.id})`), desc(tests.publishedAt))
    .limit(limit);

  return rows.map((r) => ({ ...r.test, attemptCount: r.attemptCount }));
}
