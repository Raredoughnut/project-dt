/** 라우트 전환 로딩 화면 (뷰포트 중앙 정렬). loading.tsx 에서 사용. */
export function RouteLoading() {
  return (
    <div className="flex min-h-[70svh] flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
      <div className="size-10 animate-spin rounded-full border-[3px] border-neutral-200 border-t-primary-main" />
      <p className="text-sm">불러오는 중…</p>
    </div>
  );
}
