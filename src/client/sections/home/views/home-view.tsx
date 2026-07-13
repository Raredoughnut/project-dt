import { SiteHeader } from "@/src/client/layouts/site-header";
import { SiteFooter } from "@/src/client/layouts/site-footer";
import { SectionHeader } from "@/src/client/sections/home/components/section-header";
import { TestCard } from "@/src/client/sections/home/components/test-card";
import { SetCard } from "@/src/client/sections/home/components/set-card";
import { BannerCarousel } from "@/src/client/sections/home/components/banner-carousel";
import type { HomeData } from "@/src/client/sections/home/types";

interface HomeViewProps {
  data: HomeData;
}

/**
 * 메인 화면 (프레젠테이션). props(HomeData)만 받아 그린다.
 * 모바일 우선 · 최대 너비 1440px 반응형.
 */
export function HomeView({ data }: HomeViewProps) {
  return (
    <div className="min-h-full bg-background">
      <SiteHeader />

      <main className="mx-auto w-full max-w-[1440px] px-4 pb-16 sm:px-6 lg:px-10">
        {/* 기획전 배너 · 캐러셀 */}
        {data.banners.length > 0 ? (
          <section className="pt-4 lg:pt-6">
            <BannerCarousel banners={data.banners} />
          </section>
        ) : null}

        {/* 실시간 참여 (검색은 헤더로 이동) */}
        {data.liveCount ? (
          <section className="mt-4 lg:mt-6">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-2 rounded-full bg-green-main" />
              지금 {data.liveCount.toLocaleString()}명이 테스트 중
            </p>
          </section>
        ) : null}

        {/* 이번 주 인기 — 모바일 가로 스크롤 / PC 5열 그리드 */}
        <section className="mt-8 lg:mt-12">
          <SectionHeader title="이번 주 인기" href="/search?sort=popular" />
          <div className="flex gap-3 overflow-x-auto pb-1 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible">
            {data.popular.map((test, i) => (
              <TestCard
                key={test.id}
                test={test}
                rank={i + 1}
                meta={`${test.attemptCount.toLocaleString()}명 응시`}
                className="w-[150px] shrink-0 lg:w-auto"
              />
            ))}
          </div>
        </section>

        {/* 최신 테스트 — 2열 → 3열 → 5열 */}
        <section className="mt-8 lg:mt-12">
          <SectionHeader title="최신 테스트" href="/search?sort=latest" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
            {data.latest.map((test) => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        </section>

        {/* 추천 세트 — 1열 → 2열 → 4열 */}
        {data.sets.length > 0 ? (
          <section className="mt-8 lg:mt-12">
            <SectionHeader title="추천 세트" href="/sets" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
              {data.sets.map((set) => (
                <SetCard key={set.id} set={set} />
              ))}
            </div>
          </section>
        ) : null}

        {/* 네이티브 광고 슬롯 */}
        <div className="mt-8 flex h-16 items-center justify-center rounded-xl border border-dashed border-border text-xs text-muted-foreground lg:mt-12">
          AD · 네이티브 광고 슬롯
        </div>

        <SiteFooter />
      </main>
    </div>
  );
}
