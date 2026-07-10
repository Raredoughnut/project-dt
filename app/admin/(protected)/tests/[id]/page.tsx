import { Suspense } from "react";
import Link from "next/link";

import { TestEditContainer } from "@/src/client/sections/admin-test-editor/test-edit-container";

export default async function EditTestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="space-y-4">
      <Link
        href="/admin/tests"
        className="text-sm text-muted-foreground transition hover:text-foreground"
      >
        ← 테스트 목록
      </Link>
      <Suspense
        fallback={<p className="text-sm text-muted-foreground">불러오는 중…</p>}
      >
        <TestEditContainer testId={id} />
      </Suspense>
    </div>
  );
}
