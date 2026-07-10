import { Suspense } from "react";

import { AdminTestsContainer } from "@/src/client/sections/admin-tests/admin-tests-container";

export default function AdminTestsPage() {
  return (
    <Suspense
      fallback={<p className="text-sm text-muted-foreground">불러오는 중…</p>}
    >
      <AdminTestsContainer />
    </Suspense>
  );
}
