import type { Metadata } from "next";
import { Suspense } from "react";
import { getPlayableTestMock } from "@/src/client/sections/test-play/mock";
import { TestResultView } from "@/src/client/sections/test-result/views/test-result-view";
import { LoadingView } from "@/src/client/sections/loading/loading-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; code: string }>;
}): Promise<Metadata> {
  const { slug, code } = await params;
  const test = getPlayableTestMock(slug);
  const result = test.results.find((r) => r.code === code) ?? test.results[0];

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
      <ResultContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function ResultContent({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; code: string }>;
  searchParams: Promise<{ name?: string }>;
}) {
  const { slug, code } = await params;
  const { name } = await searchParams;
  const test = getPlayableTestMock(slug);
  // 코드가 없거나 매칭되지 않으면 첫 결과로 폴백(스캐폴드).
  const result = test.results.find((r) => r.code === code) ?? test.results[0];
  return <TestResultView test={test} result={result} name={name} />;
}
