import { getPlayableTestMock } from "@/src/client/sections/test-play/mock";
import { TestIntroView } from "@/src/client/sections/test-intro/views/test-intro-view";

/**
 * 테스트 소개 컨테이너 (서버 컴포넌트).
 * 초기 데이터 획득·분기 → View에 props 전달 (MVVM · fetch-strategy §6: 초기 데이터=서버 컴포넌트).
 * TODO(로드맵 6, dev): getPlayableTestMock → Drizzle `use cache` 쿼리로 교체.
 */
export async function TestIntroContainer({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const test = getPlayableTestMock(slug);
  return <TestIntroView test={test} />;
}
