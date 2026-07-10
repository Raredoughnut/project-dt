"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  deleteBannerAction,
  toggleBannerActiveAction,
} from "@/src/server/actions/admin-banners";

interface BannerRowActionsProps {
  id: string;
  title: string;
  isActive: boolean;
}

/** 배너 목록 행: 노출 토글 + 삭제. */
export function BannerRowActions({ id, title, isActive }: BannerRowActionsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      await toggleBannerActiveAction(id, !isActive);
      router.refresh();
    });
  }

  function remove() {
    if (!window.confirm(`'${title}' 배너를 삭제할까요? 이미지도 함께 삭제됩니다.`))
      return;
    startTransition(async () => {
      await deleteBannerAction(id);
      router.refresh();
    });
  }

  return (
    <div className="flex gap-1.5">
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        className="rounded-md border border-border px-2 py-1 text-xs font-medium text-foreground transition hover:bg-secondary disabled:opacity-50"
      >
        {isActive ? "숨기기" : "노출"}
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
