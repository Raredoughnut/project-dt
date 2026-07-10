import type { SetMetaInitial } from "./types";

interface SetMetaFormViewProps {
  mode: "create" | "edit";
  setId?: string;
  initial?: SetMetaInitial;
  formAction: (formData: FormData) => void;
  pending: boolean;
  error?: string;
  ok?: boolean;
}

const FIELD =
  "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30";
const LABEL = "text-sm font-medium text-foreground";

/** 세트 메타 폼(프레젠테이션). */
export function SetMetaFormView({
  mode,
  setId,
  initial,
  formAction,
  pending,
  error,
  ok,
}: SetMetaFormViewProps) {
  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      {mode === "edit" && setId ? (
        <input type="hidden" name="id" value={setId} />
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
          placeholder="예) 가볍게 시작하는 테스트"
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
          placeholder="starter-pack"
        />
        <p className="text-xs text-muted-foreground">
          /sets/&lt;slug&gt; 로 공개됩니다. 영소문자·숫자·하이픈(-)만 가능.
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
          placeholder="세트 소개 (선택)"
        />
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
              ? "세트 만들기"
              : "변경사항 저장"}
        </button>
      </div>
    </form>
  );
}
