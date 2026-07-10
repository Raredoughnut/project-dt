"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  addSetItemAction,
  removeSetItemAction,
  moveSetItemAction,
} from "@/src/server/actions/admin-sets";
import type {
  AdminSetItem,
  AssignableTest,
} from "@/src/server/db/queries/admin-sets";
import type { ActionResult } from "@/src/domain/types";

interface SetItemsEditorProps {
  setId: string;
  items: AdminSetItem[];
  assignableTests: AssignableTest[];
}

/** 세트 구성 테스트 편집(추가·제거·순서 변경). */
export function SetItemsEditor({
  setId,
  items,
  assignableTests,
}: SetItemsEditorProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string>();
  const [pick, setPick] = useState("");

  const available = assignableTests.filter(
    (t) => !items.some((i) => i.testId === t.id)
  );

  function run(fn: () => Promise<ActionResult>) {
    setError(undefined);
    startTransition(async () => {
      const res = await fn();
      if (res.ok) router.refresh();
      else setError(res.error);
    });
  }

  function add() {
    if (!pick) return;
    const testId = pick;
    setPick("");
    run(() => addSetItemAction(setId, testId));
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-foreground">
          구성 테스트{" "}
          <span className="text-sm font-normal text-muted-foreground">
            ({items.length})
          </span>
        </h2>
        <p className="text-xs text-muted-foreground">
          위/아래 버튼으로 노출 순서를 조정합니다.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          아직 구성된 테스트가 없습니다. 아래에서 추가해주세요.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li
              key={item.itemId}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
            >
              <span className="w-6 shrink-0 text-center text-sm font-semibold text-muted-foreground tabular-nums">
                {idx + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {item.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  /{item.slug}
                  {item.status === "draft" ? (
                    <span className="ml-2 rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] font-medium text-neutral-600">
                      초안
                    </span>
                  ) : null}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => run(() => moveSetItemAction(item.itemId, "up"))}
                  disabled={pending || idx === 0}
                  className="rounded-md border border-border px-2 py-1 text-xs text-foreground transition hover:bg-secondary disabled:opacity-40"
                  title="위로"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() =>
                    run(() => moveSetItemAction(item.itemId, "down"))
                  }
                  disabled={pending || idx === items.length - 1}
                  className="rounded-md border border-border px-2 py-1 text-xs text-foreground transition hover:bg-secondary disabled:opacity-40"
                  title="아래로"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => run(() => removeSetItemAction(item.itemId))}
                  disabled={pending}
                  className="rounded-md border border-border px-2 py-1 text-xs font-medium text-red-main transition hover:bg-red-lighter disabled:opacity-50"
                >
                  제거
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-3">
        <select
          value={pick}
          onChange={(e) => setPick(e.target.value)}
          disabled={pending || available.length === 0}
          className="h-10 flex-1 rounded-lg border border-input bg-background px-2 text-sm outline-none focus:border-primary disabled:opacity-50"
        >
          <option value="">
            {available.length === 0
              ? "추가할 테스트가 없습니다"
              : "테스트 선택…"}
          </option>
          {available.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title} (/{t.slug}){t.status === "draft" ? " · 초안" : ""}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={add}
          disabled={pending || !pick}
          className="h-10 shrink-0 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary-dark disabled:opacity-50"
        >
          추가
        </button>
      </div>
    </section>
  );
}
