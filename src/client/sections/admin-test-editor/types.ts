/** 메타 폼 초기값(생성 시 undefined). */
export interface TestMetaInitial {
  title: string;
  slug: string;
  description: string;
  category: string;
  scoringType: "sum" | "axis";
  status: "draft" | "published";
}
