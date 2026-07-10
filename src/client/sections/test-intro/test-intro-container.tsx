import { notFound } from "next/navigation";

import { getPlayableTest } from "@/src/server/db/queries/tests";
import { TestIntroView } from "@/src/client/sections/test-intro/views/test-intro-view";

/**
 * 테스트 소개 컨테이너 (서버 컴포넌트).
 * 초기 데이터 획득·분기 → View에 props 전달 (MVVM · fetch-strategy §6).
 */
export async function TestIntroContainer({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const test = await getPlayableTest(slug);
  if (!test) notFound();
  return <TestIntroView test={test} />;
}
