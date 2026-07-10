import Link from "next/link";
import { SearchBar } from "@/src/client/sections/search/components/search-bar";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background">
      <div className="mx-auto flex h-14 w-full max-w-[1440px] items-center gap-3 px-4 sm:px-6 lg:px-10">
        <Link href="/" aria-label="donutest 홈" className="shrink-0">
          {/* 벡터 아웃라인 로고(폰트 비의존) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/donutest-logo.svg" alt="donutest" className="h-7 w-auto" />
        </Link>
        <div className="min-w-0 flex-1 lg:max-w-md">
          <SearchBar defaultQuery="" sort="popular" />
        </div>
      </div>
    </header>
  );
}
