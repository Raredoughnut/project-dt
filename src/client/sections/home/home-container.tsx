import { HomeView } from "@/src/client/sections/home/views/home-view";
import { getHomeData } from "@/src/server/db/queries/home";

/**
 * Home Container (서버 컴포넌트).
 * 초기 데이터 획득·분기 담당 → View에는 props만 전달 (MVVM · fetch-strategy §6: 초기 데이터=서버 컴포넌트).
 */
export async function HomeContainer() {
  const data = await getHomeData();
  return <HomeView data={data} />;
}
