import type { ChangeEvent } from "react";

import type { BannerMetaInitial } from "./types";

interface BannerFormViewProps {
  mode: "create" | "edit";
  bannerId?: string;
  initial?: BannerMetaInitial;
  formAction: (formData: FormData) => void;
  pending: boolean;
  error?: string;
  ok?: boolean;
  pcPreview: string | null;
  mobilePreview: string | null;
  onPickPc: (file: File | null) => void;
  onPickMobile: (file: File | null) => void;
}

const FIELD =
  "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30";
const LABEL = "text-sm font-medium text-foreground";
const HINT = "text-xs text-muted-foreground";

/** 배너 폼(프레젠테이션). 비제어 폼 → multipart FormData 로 서버 액션에 전달. */
export function BannerFormView({
  mode,
  bannerId,
  initial,
  formAction,
  pending,
  error,
  ok,
  pcPreview,
  mobilePreview,
  onPickPc,
  onPickMobile,
}: BannerFormViewProps) {
  const pcSrc = pcPreview ?? initial?.imageUrl ?? null;
  const mobileSrc = mobilePreview ?? initial?.mobileImageUrl ?? null;

  function handlePc(e: ChangeEvent<HTMLInputElement>) {
    onPickPc(e.target.files?.[0] ?? null);
  }
  function handleMobile(e: ChangeEvent<HTMLInputElement>) {
    onPickMobile(e.target.files?.[0] ?? null);
  }

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {mode === "edit" && bannerId ? (
        <input type="hidden" name="id" value={bannerId} />
      ) : null}

      <div className="space-y-1.5">
        <label htmlFor="title" className={LABEL}>
          제목 (alt · 접근성)
        </label>
        <input
          id="title"
          name="title"
          defaultValue={initial?.title ?? ""}
          required
          maxLength={80}
          className={FIELD}
          placeholder="예) 여름 특집 심리테스트"
        />
      </div>

      {/* PC 이미지 */}
      <div className="space-y-2">
        <label htmlFor="image" className={LABEL}>
          PC 이미지 {mode === "create" ? <span className="text-primary">*</span> : null}
        </label>
        {pcSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pcSrc}
            alt="PC 배너 미리보기"
            className="aspect-[1440/360] w-full rounded-xl border border-border object-cover"
          />
        ) : null}
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={handlePc}
          className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary-dark"
        />
        <p className={HINT}>권장 비율 4:1 (예: 1440×360). JPG·PNG·WebP, 5MB 이하.</p>
      </div>

      {/* 모바일 이미지 */}
      <div className="space-y-2">
        <label htmlFor="mobileImage" className={LABEL}>
          모바일 이미지 <span className="text-muted-foreground">(선택)</span>
        </label>
        {mobileSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mobileSrc}
            alt="모바일 배너 미리보기"
            className="aspect-[2/1] w-full max-w-xs rounded-xl border border-border object-cover"
          />
        ) : null}
        <input
          id="mobileImage"
          name="mobileImage"
          type="file"
          accept="image/*"
          onChange={handleMobile}
          className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-sm file:font-semibold file:text-foreground hover:file:bg-secondary/70"
        />
        <p className={HINT}>비우면 모바일에서도 PC 이미지를 사용합니다. 권장 비율 2:1.</p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="linkUrl" className={LABEL}>
          링크 URL <span className="text-muted-foreground">(선택)</span>
        </label>
        <input
          id="linkUrl"
          name="linkUrl"
          defaultValue={initial?.linkUrl ?? ""}
          className={FIELD}
          placeholder="/t/what-donut 또는 https://…"
        />
        <p className={HINT}>클릭 시 이동할 주소. 비우면 클릭 불가.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="sortOrder" className={LABEL}>
            정렬 순서
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            min={0}
            max={9999}
            defaultValue={initial?.sortOrder ?? 0}
            className={FIELD}
          />
          <p className={HINT}>작을수록 앞에 노출됩니다.</p>
        </div>
        <div className="space-y-1.5">
          <span className={LABEL}>노출</span>
          <label className="flex h-11 items-center gap-2 rounded-lg border border-input bg-background px-3 text-sm">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={initial?.isActive ?? true}
              className="size-4 accent-primary"
            />
            메인 캐러셀에 노출
          </label>
        </div>
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {ok ? <p className="text-sm text-green-dark">저장되었습니다.</p> : null}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="h-11 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-dark disabled:opacity-60"
        >
          {pending
            ? "저장 중…"
            : mode === "create"
              ? "배너 만들기"
              : "변경사항 저장"}
        </button>
      </div>
    </form>
  );
}
