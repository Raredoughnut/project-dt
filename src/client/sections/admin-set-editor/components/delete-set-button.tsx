"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { deleteSetAction } from "@/src/server/actions/admin-sets";

interface DeleteSetButtonProps {
  id: string;
  title: string;
}

/** 편집 화면의 세트 삭제 버튼. 삭제 후 목록으로 이동. */
export function DeleteSetButton({ id, title }: DeleteSetButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function remove() {
    if (!window.confirm(`'${title}' 세트를 삭제할까요?`)) return;
    startTransition(async () => {
      await deleteSetAction(id);
      router.push("/admin/sets");
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
