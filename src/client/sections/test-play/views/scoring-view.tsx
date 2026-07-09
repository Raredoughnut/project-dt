export function ScoringView() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
      <div className="size-14 rounded-full border-4 border-primary-lighter border-t-primary animate-spin" />
      <div className="flex flex-col gap-1">
        <p className="font-display text-lg font-bold text-foreground">
          결과를 채점하고 있어요
        </p>
        <p className="text-sm text-muted-foreground">잠시만 기다려주세요…</p>
      </div>
    </div>
  );
}
