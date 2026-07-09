import { Suspense } from "react";
import { SetDetailContainer } from "@/src/client/sections/sets/set-detail-container";
import { LoadingView } from "@/src/client/sections/loading/loading-view";

export default function SetDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<LoadingView />}>
      <SetDetailContainer params={params} />
    </Suspense>
  );
}
