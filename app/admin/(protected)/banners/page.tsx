import { Suspense } from "react";

import { AdminBannersContainer } from "@/src/client/sections/admin-banners/admin-banners-container";

export default function AdminBannersPage() {
  return (
    <Suspense
      fallback={<p className="text-sm text-muted-foreground">불러오는 중…</p>}
    >
      <AdminBannersContainer />
    </Suspense>
  );
}
