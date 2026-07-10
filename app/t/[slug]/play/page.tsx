import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getPlayableTest } from "@/src/server/db/queries/tests";
import { TestPlayContainer } from "@/src/client/sections/test-play/test-play-container";
import { LoadingView } from "@/src/client/sections/loading/loading-view";

export default function TestPlayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<LoadingView />}>
      <PlayLoader params={params} />
    </Suspense>
  );
}

// 서버 데이터 경계: 초기 데이터(test)를 획득해 클라이언트 컨테이너에 주입 (fetch-strategy §6).
async function PlayLoader({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const test = await getPlayableTest(slug);
  if (!test) notFound();
  return <TestPlayContainer test={test} />;
}
