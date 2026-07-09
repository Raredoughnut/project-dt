export function LoadingView() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-32 text-muted-foreground">
      <div className="w-7 h-7 rounded-full border-2 border-neutral-200 border-t-primary-main animate-spin" />
      <p className="text-[13px]">불러오는 중…</p>
    </div>
  );
}
