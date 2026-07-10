import Link from "next/link";

/** 어드민 좌측 네비게이션(정적). PC 에서만 노출. */
export function AdminSidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-card lg:block">
      <div className="flex h-14 items-center px-5">
        <Link
          href="/admin"
          className="font-display text-lg font-bold text-primary"
        >
          donutest
        </Link>
        <span className="ml-2 text-xs text-muted-foreground">admin</span>
      </div>
      <nav className="flex flex-col gap-0.5 px-3 py-2">
        <Link
          href="/admin"
          className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition hover:bg-secondary"
        >
          대시보드
        </Link>
        <Link
          href="/admin/tests"
          className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition hover:bg-secondary"
        >
          테스트 관리
        </Link>
        <span className="cursor-default rounded-lg px-3 py-2 text-sm text-muted-foreground/60">
          세트 관리 (준비 중)
        </span>
      </nav>
    </aside>
  );
}
