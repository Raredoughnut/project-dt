import { desc, sql } from "drizzle-orm";
import { eq } from "drizzle-orm";

import { db } from "@/src/server/db";
import { tests, questions, attempts, type Test } from "@/src/server/db/schema";

export interface AdminTestListItem {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  scoringType: "axis" | "sum";
  status: "draft" | "published";
  questionCount: number;
  attemptCount: number;
  createdAt: Date;
  publishedAt: Date | null;
}

/** 어드민 테스트 목록(문항 수·응시 수 포함). 요청 시점 집계 · 캐시 안 함. */
export async function getAdminTests(): Promise<AdminTestListItem[]> {
  return db
    .select({
      id: tests.id,
      slug: tests.slug,
      title: tests.title,
      category: tests.category,
      scoringType: tests.scoringType,
      status: tests.status,
      questionCount: sql<number>`(select count(*) from ${questions} where ${questions.testId} = ${tests.id})::int`,
      attemptCount: sql<number>`(select count(*) from ${attempts} where ${attempts.testId} = ${tests.id})::int`,
      createdAt: tests.createdAt,
      publishedAt: tests.publishedAt,
    })
    .from(tests)
    .orderBy(desc(tests.createdAt));
}

/** 어드민 편집용 단일 테스트(메타 전체). 없으면 null. */
export async function getAdminTestById(id: string): Promise<Test | null> {
  const [row] = await db.select().from(tests).where(eq(tests.id, id)).limit(1);
  return row ?? null;
}
