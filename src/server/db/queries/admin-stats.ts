import { sql } from "drizzle-orm";

import { db } from "@/src/server/db";
import { tests, testSets, attempts } from "@/src/server/db/schema";

export interface AdminOverview {
  totalTests: number;
  publishedTests: number;
  draftTests: number;
  totalSets: number;
  totalAttempts: number;
  attempts7d: number;
}

/** 어드민 대시보드 개요 지표(요청 시점 집계 · 캐시 안 함). */
export async function getAdminOverview(): Promise<AdminOverview> {
  const [testAgg] = await db
    .select({
      total: sql<number>`count(*)::int`,
      published: sql<number>`(count(*) filter (where ${tests.status} = 'published'))::int`,
      draft: sql<number>`(count(*) filter (where ${tests.status} = 'draft'))::int`,
    })
    .from(tests);

  const [setAgg] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(testSets);

  const [attemptAgg] = await db
    .select({
      total: sql<number>`count(*)::int`,
      last7d: sql<number>`(count(*) filter (where ${attempts.createdAt} >= now() - interval '7 days'))::int`,
    })
    .from(attempts);

  return {
    totalTests: testAgg?.total ?? 0,
    publishedTests: testAgg?.published ?? 0,
    draftTests: testAgg?.draft ?? 0,
    totalSets: setAgg?.total ?? 0,
    totalAttempts: attemptAgg?.total ?? 0,
    attempts7d: attemptAgg?.last7d ?? 0,
  };
}
