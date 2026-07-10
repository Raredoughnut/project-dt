"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  saveResultCardAction,
  deleteResultCardAction,
} from "@/src/server/actions/admin-content";
import type { SaveResultCardInput } from "@/src/domain/schemas";
import type { AdminResultData } from "@/src/server/db/queries/admin-tests";

interface ResultCardFormProps {
  mode: "create" | "edit";
  testId: string;
  initial?: AdminResultData;
  onDone?: () => void;
}

const INPUT =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30";
const LABEL = "text-xs text-muted-foreground";

/** 결과카드 1개 편집(생성/수정 겸용). */
export function ResultCardForm({
  mode,
  testId,
  initial,
  onDone,
}: ResultCardFormProps) {
  const router = useRouter();
  const [code, setCode] = useState(initial?.code ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [traits, setTraits] = useState((initial?.traits ?? []).join(", "));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  const imageSrc = imagePreview ?? initial?.image ?? null;

  function pickImage(file: File | null) {
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  }

  function save() {
    setError(undefined);
    const input: SaveResultCardInput = {
      testId,
      cardId: initial?.id,
      code: code.trim(),
      title: title.trim(),
      subtitle: subtitle.trim(),
      description: description.trim(),
      traits: traits
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== ""),
    };
    startTransition(async () => {
      const res = await saveResultCardAction(input, imageFile);
      if (res.ok) {
        router.refresh();
        onDone?.();
      } else {
        setError(res.error);
      }
    });
  }

  function remove() {
    const id = initial?.id;
    if (!id) {
      onDone?.();
      return;
    }
    if (!window.confirm("이 결과카드를 삭제할까요?")) return;
    startTransition(async () => {
      const res = await deleteResultCardAction(id);
      if (res.ok) router.refresh();
      else setError(res.error);
    });
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label className={LABEL}>결과 코드</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="ENFP 또는 classic"
            className={INPUT}
          />
        </div>
        <div className="space-y-1">
          <label className={LABEL}>제목</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="결과 제목"
            className={INPUT}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className={LABEL}>부제목 (선택)</label>
        <input
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className={INPUT}
        />
      </div>

      <div className="space-y-1">
        <label className={LABEL}>설명 (선택)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className={INPUT}
        />
      </div>

      <div className="space-y-1">
        <label className={LABEL}>특성 태그 (쉼표로 구분)</label>
        <input
          value={traits}
          onChange={(e) => setTraits(e.target.value)}
          placeholder="안정적, 성실, 편안함"
          className={INPUT}
        />
      </div>

      <div className="space-y-1.5">
        <label className={LABEL}>결과 이미지 (선택)</label>
        <div className="flex items-center gap-3">
          {imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt="결과 이미지 미리보기"
              className="size-16 shrink-0 rounded-lg border border-border object-cover"
            />
          ) : null}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => pickImage(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground hover:file:bg-secondary/70"
          />
        </div>
        {initial?.image ? (
          <p className="text-xs text-muted-foreground">
            새로 선택하지 않으면 기존 이미지를 유지합니다.
          </p>
        ) : null}
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-dark disabled:opacity-60"
        >
          {pending ? "저장 중…" : "결과 저장"}
        </button>
        <button
          type="button"
          onClick={remove}
          disabled={pending}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-red-main transition hover:bg-red-lighter disabled:opacity-50"
        >
          {mode === "create" ? "취소" : "삭제"}
        </button>
      </div>
    </div>
  );
}
