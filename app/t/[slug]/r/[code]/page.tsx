import type { Metadata } from "next";
import { Suspense } from "react";
import { getPlayableTest } from "@/src/server/db/queries/tests";
import { TestResultContainer } from "@/src/client/sections/test-result/test-result-container";
import { LoadingView } from "@/src/client/sections/loading/loading-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; code: string }>;
}): Promise<Metadata> {
  const { slug, code } = await params;
  const test = await getPlayableTest(slug);
  const result = test?.results.find((r) => r.code === code) ?? test?.results[0];
  if (!test || !result) return { title: "donutest — 30초 심리테스트" };

  const title = `${result.title} · ${test.title}`;
  const description = result.subtitle
    ? `${result.subtitle} — ${test.title} 결과 확인하기`
    : `${test.title} 결과 확인하기`;

  // og:image / twitter:image 는 같은 세그먼트의 opengraph-image.tsx 에서 자동 연결됨.
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function TestResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; code: string }>;
  searchParams: Promise<{ name?: string }>;
}) {
  return (
    <Suspense fallback={<LoadingView />}>
      <TestResultContainer params={params} searchParams={searchParams} />
    </Suspense>
  );
}
