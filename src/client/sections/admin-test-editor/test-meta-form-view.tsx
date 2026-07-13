import type { ChangeEvent } from "react";

import type { TestMetaInitial } from "./types";

interface TestMetaFormViewProps {
  mode: "create" | "edit";
  testId?: string;
  initial?: TestMetaInitial;
  formAction: (formData: FormData) => void;
  pending: boolean;
  error?: string;
  ok?: boolean;
  coverPreview: string | null;
  onPickCover: (file: File | null) => void;
}

const FIELD =
  "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30";
const LABEL = "text-sm font-medium text-foreground";

/** 테스트 메타 폼(프레젠테이션). 비제어 폼 → multipart FormData 로 서버 액션에 전달. */
export function TestMetaFormView({
  mode,
  testId,
  initial,
  formAction,
  pending,
  error,
  ok,
  coverPreview,
  onPickCover,
}: TestMetaFormViewProps) {
  const coverSrc = coverPreview ?? initial?.coverImage ?? null;

  function handleCover(e: ChangeEvent<HTMLInputElement>) {
    onPickCover(e.target.files?.[0] ?? null);
  }

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      {mode === "edit" && testId ? (
        <input type="hidden" name="id" value={testId} />
      ) : null}

      <div className="space-y-1.5">
        <label htmlFor="title" className={LABEL}>
          제목
        </label>
        <input
          id="title"
          name="title"
          defaultValue={initial?.title ?? ""}
          required
          className={FIELD}
          placeholder="예) 나는 무슨 도넛?"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="slug" className={LABEL}>
          slug (공개 URL)
        </label>
        <input
          id="slug"
          name="slug"
          defaultValue={initial?.slug ?? ""}
          required
          className={FIELD}
          placeholder="what-donut"
        />
        <p className="text-xs text-muted-foreground">
          /t/&lt;slug&gt; 로 공개됩니다. 영소문자·숫자·하이픈(-)만 가능.
        </p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="description" className={LABEL}>
          설명
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={initial?.description ?? ""}
          rows={3}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"
          placeholder="한 줄 소개 (선택)"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="coverImage" className={LABEL}>
          대표 이미지 <span className="text-muted-foreground">(선택)</span>
        </label>
        {coverSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverSrc}
            alt="대표 이미지 미리보기"
            className="aspect-[4/3] w-full max-w-xs rounded-xl border border-border object-cover"
          />
        ) : null}
        <input
          id="coverImage"
          name="coverImage"
          type="file"
          accept="image/*"
          onChange={handleCover}
          className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary-dark"
        />
        <p className="text-xs text-muted-foreground">
          소개·목록·OG 카드에 쓰입니다. JPG·PNG·WebP, 5MB 이하.
          {mode === "edit" ? " 새로 선택하지 않으면 기존 이미지를 유지합니다." : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label htmlFor="category" className={LABEL}>
            카테고리
          </label>
          <input
            id="category"
            name="category"
            defaultValue={initial?.category ?? ""}
            className={FIELD}
            placeholder="성격 (선택)"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="scoringType" className={LABEL}>
            채점 방식
          </label>
          <select
            id="scoringType"
            name="scoringType"
            defaultValue={initial?.scoringType ?? "sum"}
            className={FIELD}
          >
            <option value="sum">최고점 유형 (sum)</option>
            <option value="axis">MBTI 축 (axis)</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="status" className={LABEL}>
            상태
          </label>
          <select
            id="status"
            name="status"
            defaultValue={initial?.status ?? "draft"}
            className={FIELD}
          >
            <option value="draft">초안</option>
            <option value="published">공개</option>
          </select>
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
              ? "테스트 만들기"
              : "변경사항 저장"}
        </button>
      </div>
    </form>
  );
}
