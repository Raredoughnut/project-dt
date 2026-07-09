import { Suspense } from "react";
import { getPlayableTestMock } from "@/src/client/sections/test-play/mock";
import { TestIntroView } from "@/src/client/sections/test-intro/views/test-intro-view";
import { LoadingView } from "@/src/client/sections/loading/loading-view";

export default function TestIntroPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<LoadingView />}>
      <IntroContent params={params} />
    </Suspense>
  );
}

async function IntroContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // 스캐폴드: mock 주입. 실제 데이터는 DB 쿼리로 교체 예정(로드맵 6).
  const test = getPlayableTestMock(slug);
  return <TestIntroView test={test} />;
}
