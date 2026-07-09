import { getAllSetsMock } from "@/src/client/sections/sets/mock";
import { SetsIndexView } from "@/src/client/sections/sets/views/sets-index-view";

/**
 * 추천 세트 목록 컨테이너 (서버 컴포넌트).
 * 초기 데이터 획득 → View에 props 전달 (MVVM).
 * TODO(로드맵 6, dev): getAllSetsMock → Drizzle `use cache` 쿼리로 교체.
 */
export function SetsIndexContainer() {
  const sets = getAllSetsMock();
  return <SetsIndexView sets={sets} />;
}
