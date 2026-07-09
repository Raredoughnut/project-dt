import { getSetMock } from "@/src/client/sections/sets/mock";
import { SetDetailView } from "@/src/client/sections/sets/views/set-detail-view";

/**
 * 추천 세트 상세 컨테이너 (서버 컴포넌트).
 * 초기 데이터 획득 → View에 props 전달 (MVVM).
 * TODO(로드맵 6, dev): getSetMock → Drizzle `use cache` 쿼리로 교체.
 */
export async function SetDetailContainer({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const set = getSetMock(slug);
  return <SetDetailView set={set} />;
}
