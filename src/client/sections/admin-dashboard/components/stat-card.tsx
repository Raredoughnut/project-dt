interface StatCardProps {
  label: string;
  value: number;
  hint?: string;
}

/** 대시보드 지표 카드(프레젠테이션). */
export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">
        {value.toLocaleString()}
      </p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
