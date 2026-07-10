import { desc, eq, sql } from "drizzle-orm";

import { db } from "@/src/server/db";
import {
  testSets,
  testSetItems,
  tests,
  type TestSet,
} from "@/src/server/db/schema";

/* ── 목록 ──────────────────────────────────────────────────────────────── */

export interface AdminSetListItem {
  id: string;
  slug: string;
  title: string;
  itemCount: number;
  createdAt: Date;
}

/** 어드민 세트 목록(구성 테스트 수 포함). 요청 시점 · 캐시 안 함. */
export async function getAdminSets(): Promise<AdminSetListItem[]> {
  return db
    .select({
      id: testSets.id,
      slug: testSets.slug,
      title: testSets.title,
      itemCount: sql<number>`(select count(*) from ${testSetItems} where ${testSetItems.testSetId} = ${testSets.id})::int`,
      createdAt: testSets.createdAt,
    })
    .from(testSets)
    .orderBy(desc(testSets.createdAt));
}

/* ── 편집용 전체 로드 ──────────────────────────────────────────────────── */

export interface AdminSetItem {
  itemId: string;
  order: number;
  testId: string;
  slug: string;
  title: string;
  status: "draft" | "published";
}

export interface AdminSetFull {
  set: TestSet;
  items: AdminSetItem[];
}

/** 세트 메타 + 구성 테스트(order 순). 없으면 null. */
export async function getAdminSetFull(id: string): Promise<AdminSetFull | null> {
  const row = await db.query.testSets.findFirst({
    where: eq(testSets.id, id),
    with: {
      items: {
        orderBy: (i, { asc }) => asc(i.order),
        with: {
          test: {
            columns: { id: true, slug: true, title: true, status: true },
          },
        },
      },
    },
  });
  if (!row) return null;

  const { items, ...set } = row;
  return {
    set: set as TestSet,
    items: items.map((i) => ({
      itemId: i.id,
      order: i.order,
      testId: i.test.id,
      slug: i.test.slug,
      title: i.test.title,
      status: i.test.status,
    })),
  };
}

/* ── 세트에 추가할 수 있는 테스트 목록 ─────────────────────────────────── */

export interface AssignableTest {
  id: string;
  slug: string;
  title: string;
  status: "draft" | "published";
}

/** 전체 테스트(세트 구성 후보). 이미 포함된 것 제외는 클라이언트에서 처리. */
export async function getAssignableTests(): Promise<AssignableTest[]> {
  return db
    .select({
      id: tests.id,
      slug: tests.slug,
      title: tests.title,
      status: tests.status,
    })
    .from(tests)
    .orderBy(desc(tests.createdAt));
}
