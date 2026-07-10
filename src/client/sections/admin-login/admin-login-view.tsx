interface AdminLoginViewProps {
  formAction: (formData: FormData) => void;
  pending: boolean;
  error?: string;
}

const INPUT_CLASS =
  "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30";

/** 어드민 로그인 화면(프레젠테이션). 상태·로직은 ViewModel/서버 액션에 위임. */
export function AdminLoginView({
  formAction,
  pending,
  error,
}: AdminLoginViewProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-display text-2xl font-bold text-primary">donutest</p>
          <p className="mt-1 text-sm text-muted-foreground">관리자 콘솔</p>
        </div>

        <form
          action={formAction}
          className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-rd-md"
        >
          <div className="space-y-1.5">
            <label
              htmlFor="username"
              className="text-sm font-medium text-foreground"
            >
              아이디
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              autoFocus
              required
              className={INPUT_CLASS}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={INPUT_CLASS}
            />
          </div>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition hover:bg-primary-dark disabled:opacity-60"
          >
            {pending ? "로그인 중…" : "로그인"}
          </button>
        </form>
      </div>
    </main>
  );
}
