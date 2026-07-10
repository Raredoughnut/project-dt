import { notFound } from "next/navigation";
import { connection } from "next/server";

import {
  getAdminSetFull,
  getAssignableTests,
} from "@/src/server/db/queries/admin-sets";
import { SetItemsEditor } from "@/src/client/sections/admin-set-content/set-items-editor";
import { SetMetaFormContainer } from "./set-meta-form-container";
import { DeleteSetButton } from "./components/delete-set-button";
import type { SetMetaInitial } from "./types";

/**
 * 세트 편집 Container(서버 컴포넌트): 메타 + 구성 테스트 + 추가 후보 로드.
 * 반드시 <Suspense> 하위에서 렌더한다.
 */
export async function SetEditContainer({ setId }: { setId: string }) {
  await connection();
  const full = await getAdminSetFull(setId);
  if (!full) notFound();
  const assignableTests = await getAssignableTests();

  const { set, items } = full;
  const initial: SetMetaInitial = {
    title: set.title,
    slug: set.slug,
    description: set.description ?? "",
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">세트 편집</h1>
            <p className="mt-1 text-sm text-muted-foreground">/{set.slug}</p>
          </div>
          <DeleteSetButton id={set.id} title={set.title} />
        </header>
        <SetMetaFormContainer mode="edit" setId={set.id} initial={initial} />
      </div>

      <SetItemsEditor
        setId={set.id}
        items={items}
        assignableTests={assignableTests}
      />
    </div>
  );
}
