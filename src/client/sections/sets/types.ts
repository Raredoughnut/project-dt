import type { Test, TestSet } from "@/src/server/db/schema";

/** 세트 상세의 구성 테스트 (최소 필드) */
export type SetItem = Pick<
  Test,
  "id" | "slug" | "title" | "coverImage" | "category"
>;

/** 세트 상세: 세트 + 구성 테스트 전체 */
export type SetDetail = TestSet & { items: SetItem[] };
