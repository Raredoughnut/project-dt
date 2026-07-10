"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { deleteSetAction } from "@/src/server/actions/admin-sets";

interface SetRowActionsProps {
  id: string;
  title: string;
}

/** 세트 목록 행 삭제 버튼. */
export function SetRowActions({ id, title }: SetRowActionsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function remove() {
    if (!window.confirm(`'${title}' 세트를 삭제할까요?`)) return;
    startTransition(async () => {
      await deleteSetAction(id);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={remove}
      disabled={pending}
      className="rounded-md border border-border px-2 py-1 text-xs font-medium text-red-main transition hover:bg-red-lighter disabled:opacity-50"
    >
      삭제
    </button>
  );
}
