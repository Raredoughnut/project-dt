import { notFound } from "next/navigation";

import { getSetBySlug } from "@/src/server/db/queries/sets";
import { SetDetailView } from "@/src/client/sections/sets/views/set-detail-view";

/**
 * 추천 세트 상세 컨테이너 (서버 컴포넌트).
 * 초기 데이터 획득·분기 → View에 props 전달 (MVVM).
 */
export async function SetDetailContainer({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const set = await getSetBySlug(slug);
  if (!set) notFound();
  return <SetDetailView set={set} />;
}
