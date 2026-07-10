import type { ReactNode } from "react";

import { AdminSidebar } from "@/src/client/layouts/admin-sidebar";
import { AdminTopbar } from "@/src/client/layouts/admin-topbar";

/**
 * 인증된 어드민 영역의 셸(사이드바 + 상단바).
 * 접근 게이트는 middleware 가 담당하므로 여기서는 UI 골격만 구성한다.
 */
export default function AdminProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar />
        <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 lg:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
