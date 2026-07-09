import type { CuratedSet } from "@/src/client/sections/home/types";
import type { SetDetail, SetItem } from "./types";

/* 스캐폴드용 추천 세트 목업. 실제 데이터는 DB 쿼리로 교체 예정(로드맵 6). */

const now = new Date("2026-07-08T00:00:00Z");

function item(slug: string, title: string, category: string | null = null): SetItem {
  return { id: slug, slug, title, coverImage: null, category };
}

const SETS: SetDetail[] = [
  {
    id: "summer-items",
    slug: "summer-items",
    title: "올여름, 나를 표현하는 아이템들은?",
    description: "과일부터 음료까지, 여름의 나를 표현하는 아이템 3종 세트.",
    createdAt: now,
    items: [
      item("summer-fruit", "나는 무슨 과일?", "취향"),
      item("drink-me", "나를 음료수로 표현한다면", "취향"),
      item("snack-type", "나를 닮은 과자"),
    ],
  },
  {
    id: "winter-vibes",
    slug: "winter-vibes",
    title: "겨울 감성 테스트 모음",
    description: "감성 충만한 겨울, 나를 알아가는 테스트 모음.",
    createdAt: now,
    items: [
      item("movie-genre", "내 인생 영화 장르", "취향"),
      item("color-mood", "오늘의 컬러 무드", "취향"),
      item("winter-vibe", "겨울 감성 테스트"),
    ],
  },
  {
    id: "self-discovery",
    slug: "self-discovery",
    title: "나를 알아가는 시간",
    description: "가볍게 즐기며 나를 발견하는 성격 테스트 세트.",
    createdAt: now,
    items: [
      item("na-donut", "나는 무슨 도넛?"),
      item("love-donut", "나의 연애 도넛"),
      item("travel-style", "나의 여행 스타일"),
    ],
  },
];

export function getAllSetsMock(): CuratedSet[] {
  return SETS.map((set) => ({ ...set, items: set.items.slice(0, 3) }));
}

export function getSetMock(slug: string): SetDetail {
  return SETS.find((s) => s.slug === slug) ?? SETS[0];
}
