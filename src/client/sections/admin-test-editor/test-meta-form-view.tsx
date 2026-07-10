import type { TestMetaInitial } from "./types";

interface TestMetaFormViewProps {
  mode: "create" | "edit";
  testId?: string;
  initial?: TestMetaInitial;
  formAction: (formData: FormData) => void;
  pending: boolean;
  error?: string;
  ok?: boolean;
}

const FIELD =
  "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30";
const LABEL = "text-sm font-medium text-foreground";

/** 테스트 메타 폼(프레젠테이션). 비제어 폼 → FormData 로 서버 액션에 전달. */
export function TestMetaFormView({
  mode,
  testId,
  initial,
  formAction,
  pending,
  error,
  ok,
}: TestMetaFormViewProps) {
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
