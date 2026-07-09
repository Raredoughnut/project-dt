import type { SearchResultTest, SearchSort } from "./types";

/* 스캐폴드용 검색 카탈로그. 실제 검색은 DB 쿼리(+ /api/search)로 교체 예정(로드맵 6). */

const BASE = new Date("2026-07-08T00:00:00Z");

function daysBefore(days: number): Date {
  return new Date(BASE.getTime() - days * 24 * 60 * 60 * 1000);
}

function make(
  slug: string,
  title: string,
  attemptCount: number,
  daysAgo: number,
  category = "성격"
): SearchResultTest {
  const at = daysBefore(daysAgo);
  return {
    id: slug,
    slug,
    title,
    description: null,
    category,
    coverImage: null,
    scoringType: "sum",
    status: "published",
    authorName: "donutest",
    publishedAt: at,
    createdAt: at,
    updatedAt: at,
    attemptCount,
  };
}

const CATALOG: SearchResultTest[] = [
  make("na-donut", "나는 무슨 도넛?", 12000, 2),
  make("love-mbti", "나의 연애 MBTI", 8600, 1, "연애"),
  make("love-donut", "나의 연애 도넛", 9800, 5),
  make("summer-fruit", "여름 과일 성격", 7100, 1, "취향"),
  make("cafe-mbti", "카페 취향 MBTI", 5400, 8, "취향"),
  make("snack-type", "나를 닮은 과자", 4200, 3),
  make("drink-me", "나를 음료수로 표현한다면", 3900, 0, "취향"),
  make("color-mood", "오늘의 컬러 무드", 3100, 6, "취향"),
  make("travel-style", "나의 여행 스타일", 2700, 4),
  make("study-type", "나의 공부 유형", 1800, 10, "학습"),
  make("pet-match", "나와 찰떡인 반려동물", 1500, 7),
  make("movie-genre", "내 인생 영화 장르", 900, 9, "취향"),
  make("winter-vibe", "겨울 감성 테스트", 600, 12),
];

export function searchTestsMock({
  q,
  sort,
}: {
  q: string;
  sort: SearchSort;
}): SearchResultTest[] {
  const query = q.trim().toLowerCase();
  const filtered = CATALOG.filter(
    (t) =>
      !query ||
      t.title.toLowerCase().includes(query) ||
      (t.category ?? "").toLowerCase().includes(query)
  );
  return [...filtered].sort((a, b) =>
    sort === "latest"
      ? (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0)
      : b.attemptCount - a.attemptCount
  );
}
