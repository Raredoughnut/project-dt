import { Suspense } from "react";
import Link from "next/link";

import { SetEditContainer } from "@/src/client/sections/admin-set-editor/set-edit-container";

export default async function EditSetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="space-y-4">
      <Link
        href="/admin/sets"
        className="text-sm text-muted-foreground transition hover:text-foreground"
      >
        ← 세트 목록
      </Link>
      <Suspense
        fallback={<p className="text-sm text-muted-foreground">불러오는 중…</p>}
      >
        <SetEditContainer setId={id} />
      </Suspense>
    </div>
  );
}
