import { Suspense } from "react";

import { AdminSetsContainer } from "@/src/client/sections/admin-sets/admin-sets-container";

export default function AdminSetsPage() {
  return (
    <Suspense
      fallback={<p className="text-sm text-muted-foreground">불러오는 중…</p>}
    >
      <AdminSetsContainer />
    </Suspense>
  );
}
