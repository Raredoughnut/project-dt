import { Suspense } from "react";

import { AdminDashboardContainer } from "@/src/client/sections/admin-dashboard/admin-dashboard-container";

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <p className="text-sm text-muted-foreground">불러오는 중…</p>
      }
    >
      <AdminDashboardContainer />
    </Suspense>
  );
}
