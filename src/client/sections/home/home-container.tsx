import { HomeView } from "@/src/client/sections/home/views/home-view";
import { homeMock } from "@/src/client/sections/home/mock";

/**
 * Home Container (서버 컴포넌트).
 * 초기 데이터 획득·분기 담당 → View에는 props만 전달 (MVVM · fetch-strategy §6: 초기 데이터=서버 컴포넌트).
 * TODO(로드맵 5, dev): homeMock → `await getHomeData()` 서버 쿼리(use cache)로 교체.
 */
export function HomeContainer() {
  const data = homeMock;
  return <HomeView data={data} />;
}
