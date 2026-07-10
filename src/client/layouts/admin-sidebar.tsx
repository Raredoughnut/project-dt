import Link from "next/link";

/** 어드민 좌측 네비게이션(정적). PC 에서만 노출. */
export function AdminSidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-card lg:sticky lg:top-0 lg:block lg:h-screen lg:self-start lg:overflow-y-auto">
      <div className="flex h-14 items-center px-5">
        <Link
          href="/admin"
          className="font-display text-lg font-bold text-primary"
        >
          <img
            src="/logo/donutest-logo.svg"
            alt="donutest"
            className="h-7 w-auto"
          />
        </Link>
        <div className="flex items-center bg-primary-lighter px-1.5 py-0.5 rounded-sm text-primary-dark">
          <span className="text-sm font-bold text-primary-dark">ADMIN</span>
        </div>
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
        <Link
          href="/admin/sets"
          className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition hover:bg-secondary"
        >
          세트 관리
        </Link>
      </nav>
    </aside>
  );
}
