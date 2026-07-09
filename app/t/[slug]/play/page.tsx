import { Suspense } from "react";
import { getPlayableTestMock } from "@/src/client/sections/test-play/mock";
import { TestPlay } from "@/src/client/sections/test-play/test-play";
import { LoadingView } from "@/src/client/sections/loading/loading-view";

export default function TestPlayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<LoadingView />}>
      <PlayContent params={params} />
    </Suspense>
  );
}

async function PlayContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const test = getPlayableTestMock(slug);
  return <TestPlay test={test} />;
}
