import { desc, sql } from "drizzle-orm";
import { eq } from "drizzle-orm";

import { db } from "@/src/server/db";
import { tests, questions, attempts, type Test } from "@/src/server/db/schema";
import type { ScoreMap } from "@/src/domain/types";

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

/* ── 콘텐츠 편집용 전체 로드(메타 + 문항·선택지 + 결과카드) ─────────────── */

export interface AdminChoiceData {
  id: string;
  order: number;
  label: string;
  scores: ScoreMap;
}

export interface AdminQuestionData {
  id: string;
  order: number;
  text: string;
  groupKey: string | null;
  choices: AdminChoiceData[];
}

export interface AdminResultData {
  id: string;
  code: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image: string | null;
  traits: string[];
}

export interface AdminTestFull {
  test: Test;
  questions: AdminQuestionData[];
  results: AdminResultData[];
}

/** 편집 화면 전체 데이터(문항·선택지·결과카드 포함, order 순). 없으면 null. */
export async function getAdminTestFull(id: string): Promise<AdminTestFull | null> {
  const row = await db.query.tests.findFirst({
    where: eq(tests.id, id),
    with: {
      questions: {
        orderBy: (q, { asc }) => asc(q.order),
        with: {
          choices: { orderBy: (c, { asc }) => asc(c.order) },
        },
      },
      resultCards: { orderBy: (r, { asc }) => asc(r.code) },
    },
  });
  if (!row) return null;

  const { questions: qs, resultCards: rcs, ...test } = row;
  return {
    test: test as Test,
    questions: qs.map((q) => ({
      id: q.id,
      order: q.order,
      text: q.text,
      groupKey: q.groupKey,
      choices: q.choices.map((c) => ({
        id: c.id,
        order: c.order,
        label: c.label,
        scores: c.scores,
      })),
    })),
    results: rcs.map((r) => ({
      id: r.id,
      code: r.code,
      title: r.title,
      subtitle: r.subtitle,
      description: r.description,
      image: r.image,
      traits: r.traits,
    })),
  };
}
