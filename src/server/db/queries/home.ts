import type { HomeData } from "@/src/client/sections/home/types";
import { getLatestTests, getPopularTests } from "@/src/server/db/queries/tests";
import { getActiveBanners } from "@/src/server/db/queries/banners";
import { getAllSets } from "@/src/server/db/queries/sets";

/** 메인에 노출할 추천 세트 최대 개수 */
const HOME_SETS_LIMIT = 4;

/**
 * 메인 화면 데이터. 캐시된 개별 쿼리를 조합한다.
 */
export async function getHomeData(): Promise<HomeData> {
  const [banners, popular, latest, allSets] = await Promise.all([
    getActiveBanners(),
    getPopularTests(5),
    getLatestTests(10),
    getAllSets(),
  ]);
  return {
    banners,
    popular,
    latest,
    sets: allSets.slice(0, HOME_SETS_LIMIT),
  };
}
