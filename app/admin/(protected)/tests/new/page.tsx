import Link from "next/link";

import { TestMetaFormContainer } from "@/src/client/sections/admin-test-editor/test-meta-form-container";

export default function NewTestPage() {
  return (
    <div className="space-y-6">
      <header>
        <Link
          href="/admin/tests"
          className="text-sm text-muted-foreground transition hover:text-foreground"
        >
          ← 테스트 목록
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-foreground">새 테스트</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          기본 정보를 먼저 만들고, 이후 문항을 추가합니다.
        </p>
      </header>

      <TestMetaFormContainer mode="create" />
    </div>
  );
}
