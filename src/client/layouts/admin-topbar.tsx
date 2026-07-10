import { Suspense } from "react";

import { logoutAction } from "@/src/server/auth/actions";
import { AdminUserBadge } from "./admin-user-badge";

/** 어드민 상단바: 사용자 배지 + 로그아웃(서버 액션). */
export function AdminTopbar() {
  return (
    <header className="flex h-14 items-center justify-end gap-3 border-b border-border bg-background px-4 lg:px-6">
      <Suspense
        fallback={<span className="text-sm text-muted-foreground">…</span>}
      >
        <AdminUserBadge />
      </Suspense>
      <form action={logoutAction}>
        <button
          type="submit"
          className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-secondary"
        >
          로그아웃
        </button>
      </form>
    </header>
  );
}
