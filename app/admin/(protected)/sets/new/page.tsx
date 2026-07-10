import Link from "next/link";

import { SetMetaFormContainer } from "@/src/client/sections/admin-set-editor/set-meta-form-container";

export default function NewSetPage() {
  return (
    <div className="space-y-6">
      <header>
        <Link
          href="/admin/sets"
          className="text-sm text-muted-foreground transition hover:text-foreground"
        >
          ← 세트 목록
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-foreground">새 세트</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          기본 정보를 먼저 만들고, 이후 구성 테스트를 추가합니다.
        </p>
      </header>

      <SetMetaFormContainer mode="create" />
    </div>
  );
}
