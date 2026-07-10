import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  jsonb,
  timestamp,
  index,
  unique,
} from "drizzle-orm/pg-core";
import type { ScoreMap } from "../../domain/types";

/* ========================================================================
   donutest — Drizzle 스키마 (PostgreSQL)
   도메인: 테스트 콘텐츠(어드민 저작) + 큐레이션 + 통계 + 어드민 계정
   상세 설계는 docs/ARCHITECTURE.md 참고.
   ======================================================================== */

// ── Enums ──────────────────────────────────────────────────────────────
/** 채점 방식: axis(축별 승자 조합) | sum(최고점 유형) */
export const scoringTypeEnum = pgEnum("scoring_type", ["axis", "sum"]);
/** 공개 상태: draft(작성 중) | published(공개) */
export const testStatusEnum = pgEnum("test_status", ["draft", "published"]);

/** 선택지가 각 차원에 기여하는 점수 맵. 도메인(src/domain/types)이 SSOT. */
export type { ScoreMap };

// ── tests ──────────────────────────────────────────────────────────────
export const tests = pgTable(
  "tests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** 공개 URL 식별자 (/t/[slug]) */
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    description: text("description"),
    category: text("category"),
    /** 커버/메인 이미지 경로 또는 URL */
    coverImage: text("cover_image"),
    scoringType: scoringTypeEnum("scoring_type").notNull().default("sum"),
    status: testStatusEnum("status").notNull().default("draft"),
    authorName: text("author_name"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("tests_status_published_idx").on(t.status, t.publishedAt)]
);

// ── questions ──────────────────────────────────────────────────────────
export const questions = pgTable(
  "questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    testId: uuid("test_id")
      .notNull()
      .references(() => tests.id, { onDelete: "cascade" }),
    /** 테스트 내 출제 순서 */
    order: integer("order").notNull(),
    text: text("text").notNull(),
    /** "유형별" 그룹핑 키 (예: 축 이름) */
    groupKey: text("group_key"),
  },
  (t) => [index("questions_test_idx").on(t.testId)]
);

// ── choices ────────────────────────────────────────────────────────────
export const choices = pgTable(
  "choices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    questionId: uuid("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    order: integer("order").notNull(),
    label: text("label").notNull(),
    /** 차원별 점수 기여. Record<DimensionKey, number> */
    scores: jsonb("scores")
      .$type<ScoreMap>()
      .notNull()
      .default(sql`'{}'::jsonb`),
  },
  (t) => [index("choices_question_idx").on(t.questionId)]
);

// ── result_cards ───────────────────────────────────────────────────────
export const resultCards = pgTable(
  "result_cards",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    testId: uuid("test_id")
      .notNull()
      .references(() => tests.id, { onDelete: "cascade" }),
    /** 결과 코드 (예: "ISTJ", "strawberry"). 테스트 내 유일. */
    code: text("code").notNull(),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    description: text("description"),
    image: text("image"),
    /** 특성 태그 목록 */
    traits: jsonb("traits")
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    /** 추천 테스트 slug 목록 (느슨한 참조 — 외부/미발행 허용) */
    recommendedSlugs: jsonb("recommended_slugs")
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
  },
  (t) => [
    unique("result_cards_test_code_unq").on(t.testId, t.code),
    index("result_cards_test_idx").on(t.testId),
  ]
);

// ── test_sets (추천 세트) ────────────────────────────────────────────────
export const testSets = pgTable("test_sets", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** 세트 ↔ 테스트 조인 (순서 있는 큐레이션) */
export const testSetItems = pgTable(
  "test_set_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    testSetId: uuid("test_set_id")
      .notNull()
      .references(() => testSets.id, { onDelete: "cascade" }),
    testId: uuid("test_id")
      .notNull()
      .references(() => tests.id, { onDelete: "cascade" }),
    order: integer("order").notNull(),
  },
  (t) => [
    unique("test_set_items_unq").on(t.testSetId, t.testId),
    index("test_set_items_set_idx").on(t.testSetId),
  ]
);

// ── attempts (통계) ──────────────────────────────────────────────────────
export const attempts = pgTable(
  "attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    testId: uuid("test_id")
      .notNull()
      .references(() => tests.id, { onDelete: "cascade" }),
    /** 응시 결과 코드 (비정규화 — 결과카드 변경/삭제와 무관하게 기록 보존) */
    resultCode: text("result_code").notNull(),
    /** 유입 경로 */
    referrer: text("referrer"),
    channel: text("channel"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("attempts_test_created_idx").on(t.testId, t.createdAt),
    index("attempts_created_idx").on(t.createdAt),
  ]
);

// ── banners (메인 기획전 캐러셀) ──────────────────────────────────────────
// 이미지는 Supabase Storage(공개 버킷)에 업로드하고 공개 URL 을 저장한다.
// mobileImageUrl 이 없으면 캐러셀은 imageUrl(PC) 로 폴백한다.
export const banners = pgTable(
  "banners",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** 접근성 alt · 어드민 식별용 제목 */
    title: text("title").notNull(),
    /** PC 이미지 공개 URL (필수) */
    imageUrl: text("image_url").notNull(),
    /** 모바일 이미지 공개 URL (선택 — 없으면 imageUrl 폴백) */
    mobileImageUrl: text("mobile_image_url"),
    /** 클릭 시 이동 링크 (선택 — 내부 경로 '/…' 또는 외부 http(s)) */
    linkUrl: text("link_url"),
    /** 공개 노출 여부 */
    isActive: boolean("is_active").notNull().default(true),
    /** 캐러셀 정렬 순서(오름차순) */
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("banners_active_order_idx").on(t.isActive, t.sortOrder)]
);

// ── admin_users ──────────────────────────────────────────────────────────
// 로그인 식별자는 이메일이 아닌 아이디(username). 최초 계정은 db:seed:admin 로 주입.
export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ── Relations ────────────────────────────────────────────────────────────
export const testsRelations = relations(tests, ({ many }) => ({
  questions: many(questions),
  resultCards: many(resultCards),
  attempts: many(attempts),
  setItems: many(testSetItems),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  test: one(tests, {
    fields: [questions.testId],
    references: [tests.id],
  }),
  choices: many(choices),
}));

export const choicesRelations = relations(choices, ({ one }) => ({
  question: one(questions, {
    fields: [choices.questionId],
    references: [questions.id],
  }),
}));

export const resultCardsRelations = relations(resultCards, ({ one }) => ({
  test: one(tests, {
    fields: [resultCards.testId],
    references: [tests.id],
  }),
}));

export const testSetsRelations = relations(testSets, ({ many }) => ({
  items: many(testSetItems),
}));

export const testSetItemsRelations = relations(testSetItems, ({ one }) => ({
  testSet: one(testSets, {
    fields: [testSetItems.testSetId],
    references: [testSets.id],
  }),
  test: one(tests, {
    fields: [testSetItems.testId],
    references: [tests.id],
  }),
}));

export const attemptsRelations = relations(attempts, ({ one }) => ({
  test: one(tests, {
    fields: [attempts.testId],
    references: [tests.id],
  }),
}));

// ── Inferred types ───────────────────────────────────────────────────────
export type Test = typeof tests.$inferSelect;
export type NewTest = typeof tests.$inferInsert;
export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;
export type Choice = typeof choices.$inferSelect;
export type NewChoice = typeof choices.$inferInsert;
export type ResultCard = typeof resultCards.$inferSelect;
export type NewResultCard = typeof resultCards.$inferInsert;
export type TestSet = typeof testSets.$inferSelect;
export type NewTestSet = typeof testSets.$inferInsert;
export type TestSetItem = typeof testSetItems.$inferSelect;
export type NewTestSetItem = typeof testSetItems.$inferInsert;
export type Attempt = typeof attempts.$inferSelect;
export type NewAttempt = typeof attempts.$inferInsert;
export type Banner = typeof banners.$inferSelect;
export type NewBanner = typeof banners.$inferInsert;
export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;
