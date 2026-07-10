import Link from "next/link";

import type { AdminOverview } from "@/src/server/db/queries/admin-stats";
import { StatCard } from "./components/stat-card";

interface AdminDashboardViewProps {
  username: string;
  overview: AdminOverview;
}

/** 어드민 대시보드(프레젠테이션). props 만 받아 그린다. */
export function AdminDashboardView({
  username,
  overview,
}: AdminDashboardViewProps) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">대시보드</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {username}님, 환영합니다.
        </p>
      </header>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="전체 테스트"
          value={overview.totalTests}
          hint={`공개 ${overview.publishedTests} · 초안 ${overview.draftTests}`}
        />
        <StatCard label="추천 세트" value={overview.totalSets} />
        <StatCard label="총 응시" value={overview.totalAttempts} />
        <StatCard label="최근 7일 응시" value={overview.attempts7d} />
      </section>

      <section className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground">빠른 작업</p>
        <Link
          href="/admin/tests"
          className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-secondary"
        >
          테스트 관리
        </Link>
        <Link
          href="/admin/tests/new"
          className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-dark"
        >
          + 새 테스트
        </Link>
      </section>
    </div>
  );
}
