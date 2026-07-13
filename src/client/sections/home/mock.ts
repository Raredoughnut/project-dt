import type { Test } from "@/src/server/db/schema";
import type { HomeData, PopularTest } from "@/src/client/sections/home/types";

/* 스캐폴드용 목업 픽스처. 실제 데이터는 서버 컴포넌트/쿼리로 주입 예정(로드맵 5). */

const now = new Date("2026-07-08T00:00:00Z");

function makeTest(slug: string, title: string, category = "성격"): Test {
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
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
  };
}

function popular(slug: string, title: string, attemptCount: number): PopularTest {
  return { ...makeTest(slug, title), attemptCount };
}

export const homeMock: HomeData = {
  liveCount: 462,
  banners: [],
  popular: [
    popular("na-donut", "나는 무슨 도넛?", 12000),
    popular("love-donut", "나의 연애 도넛", 9800),
    popular("summer-fruit", "여름 과일 성격", 7100),
    popular("cafe-mbti", "카페 취향 MBTI", 5400),
    popular("snack-type", "나를 닮은 과자", 4200),
  ],
  latest: Array.from({ length: 10 }, (_, i) =>
    makeTest(`t${i + 1}`, "테스트 제목이 들어갑니다")
  ),
  sets: [
    {
      id: "summer-items",
      slug: "summer-items",
      title: "올여름, 나를 표현하는 아이템들은?",
      description: null,
      createdAt: now,
      items: [
        { id: "fruit", slug: "fruit", title: "과일", coverImage: null },
        { id: "drink", slug: "drink", title: "음료", coverImage: null },
        { id: "snack", slug: "snack", title: "과자", coverImage: null },
      ],
    },
    {
      id: "winter-vibes",
      slug: "winter-vibes",
      title: "겨울 감성 테스트 모음",
      description: null,
      createdAt: now,
      items: [
        { id: "movie", slug: "movie", title: "영화", coverImage: null },
        { id: "music", slug: "music", title: "음악", coverImage: null },
        { id: "food", slug: "food", title: "음식", coverImage: null },
      ],
    },
  ],
};
