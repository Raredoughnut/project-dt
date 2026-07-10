"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  setTestStatusAction,
  deleteTestAction,
} from "@/src/server/actions/admin-tests";

interface TestRowActionsProps {
  id: string;
  slug: string;
  status: "draft" | "published";
}

/** 목록 행별 공개 전환 · 삭제 버튼(서버 액션 호출). */
export function TestRowActions({ id, slug, status }: TestRowActionsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function toggleStatus() {
    startTransition(async () => {
      await setTestStatusAction(
        id,
        status === "published" ? "draft" : "published"
      );
      router.refresh();
    });
  }

  function remove() {
    if (
      !window.confirm(
        `'${slug}' 테스트를 삭제할까요?\n문항·선택지·결과·응시 기록이 함께 삭제됩니다.`
      )
    )
      return;
    startTransition(async () => {
      await deleteTestAction(id);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={toggleStatus}
        disabled={pending}
        className="rounded-md border border-border px-2 py-1 text-xs font-medium text-foreground transition hover:bg-secondary disabled:opacity-50"
      >
        {status === "published" ? "비공개로" : "공개로"}
      </button>
      <button
        type="button"
        onClick={remove}
        disabled={pending}
        className="rounded-md border border-border px-2 py-1 text-xs font-medium text-red-main transition hover:bg-red-lighter disabled:opacity-50"
      >
        삭제
      </button>
    </div>
  );
}
