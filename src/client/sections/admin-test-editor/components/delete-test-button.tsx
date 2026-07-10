"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { deleteTestAction } from "@/src/server/actions/admin-tests";

interface DeleteTestButtonProps {
  id: string;
  slug: string;
}

/** 편집 화면의 테스트 삭제 버튼. 삭제 후 목록으로 이동. */
export function DeleteTestButton({ id, slug }: DeleteTestButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function remove() {
    if (
      !window.confirm(
        `'${slug}' 테스트를 삭제할까요?\n문항·선택지·결과·응시 기록이 함께 삭제됩니다.`
      )
    )
      return;
    startTransition(async () => {
      await deleteTestAction(id);
      router.push("/admin/tests");
    });
  }

  return (
    <button
      type="button"
      onClick={remove}
      disabled={pending}
      className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-red-main transition hover:bg-red-lighter disabled:opacity-50"
    >
      {pending ? "삭제 중…" : "삭제"}
    </button>
  );
}
