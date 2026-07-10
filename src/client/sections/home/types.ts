import type { Test, TestSet, Banner } from "@/src/server/db/schema";

/** 캐러셀 배너 항목 (공개 표시에 필요한 필드만) */
export type BannerItem = Pick<
  Banner,
  "id" | "title" | "imageUrl" | "mobileImageUrl" | "linkUrl"
>;

/** 인기 목록 항목: 테스트 + 응시 집계 */
export type PopularTest = Test & { attemptCount: number };

/** 추천 세트 + 미리보기 아이템. items 는 최대 3개(Container/쿼리에서 제한). */
export type CuratedSet = TestSet & {
  items: Pick<Test, "id" | "slug" | "title" | "coverImage">[];
};

/** 메인 화면 뷰가 받는 데이터 계약 (개발과 합의한 조합 DTO) */
export type HomeData = {
  liveCount?: number;
  banners: BannerItem[];
  popular: PopularTest[];
  latest: Test[];
  sets: CuratedSet[];
};
