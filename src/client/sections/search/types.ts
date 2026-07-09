import type { Test } from "@/src/server/db/schema";

export type SearchSort = "popular" | "latest";

/** 검색 결과 항목: 테스트 + 응시 집계 */
export type SearchResultTest = Test & { attemptCount: number };
