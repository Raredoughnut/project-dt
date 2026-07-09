import Link from "next/link";
import { Menu, Search } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background">
      <div className="mx-auto flex h-14 w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link href="/" aria-label="donutest 홈">
          {/* 벡터 아웃라인 로고(폰트 비의존) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/donutest-logo.svg" alt="donutest" className="h-7 w-auto" />
        </Link>
        <nav className="flex items-center gap-3 text-muted-foreground">
          <Link href="/search" aria-label="검색">
            <Search className="size-5" />
          </Link>
          <button type="button" aria-label="메뉴">
            <Menu className="size-5" />
          </button>
        </nav>
      </div>
    </header>
  );
}
