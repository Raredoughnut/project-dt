import { getAllSets } from "@/src/server/db/queries/sets";
import { SetsIndexView } from "@/src/client/sections/sets/views/sets-index-view";

/**
 * 추천 세트 목록 컨테이너 (서버 컴포넌트).
 * 초기 데이터 획득 → View에 props 전달 (MVVM).
 */
export async function SetsIndexContainer() {
  const sets = await getAllSets();
  return <SetsIndexView sets={sets} />;
}
