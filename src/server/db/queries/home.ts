import type { HomeData } from "@/src/client/sections/home/types";
import { getLatestTests, getPopularTests } from "@/src/server/db/queries/tests";

/**
 * 메인 화면 데이터. 캐시된 개별 쿼리를 조합한다.
 * 추천 세트는 현재 메인에서 미표시 → 빈 배열(뷰가 무시). /sets 페이지는 별도 조회.
 */
export async function getHomeData(): Promise<HomeData> {
  const [popular, latest] = await Promise.all([
    getPopularTests(5),
    getLatestTests(10),
  ]);
  return { popular, latest, sets: [] };
}
