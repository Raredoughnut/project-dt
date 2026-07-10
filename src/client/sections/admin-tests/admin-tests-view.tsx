import Link from "next/link";

import type { AdminTestListItem } from "@/src/server/db/queries/admin-tests";
import { TestRowActions } from "./components/test-row-actions";

interface AdminTestsViewProps {
  tests: AdminTestListItem[];
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

/** 테스트 관리 목록(프레젠테이션). */
export function AdminTestsView({ tests }: AdminTestsViewProps) {
  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">테스트 관리</h1>
          <p className="mt-1 text-sm text-muted-foreground">전체 {tests.length}개</p>
        </div>
        <Link
          href="/admin/tests/new"
          className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-dark"
        >
          + 새 테스트
        </Link>
      </header>

      {tests.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          아직 테스트가 없습니다.{" "}
          <Link
            href="/admin/tests/new"
            className="font-medium text-primary underline"
          >
            새 테스트 만들기
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
                <th className="px-4 py-3 font-medium">제목</th>
                <th className="px-4 py-3 font-medium">상태</th>
                <th className="px-4 py-3 font-medium">유형</th>
                <th className="px-4 py-3 text-right font-medium">문항</th>
                <th className="px-4 py-3 text-right font-medium">응시</th>
                <th className="px-4 py-3 font-medium">생성일</th>
                <th className="px-4 py-3 font-medium">관리</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/tests/${t.id}`}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {t.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">/{t.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        t.status === "published"
                          ? "inline-flex rounded-full bg-green-lighter px-2 py-0.5 text-xs font-medium text-green-dark"
                          : "inline-flex rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600"
                      }
                    >
                      {t.status === "published" ? "공개" : "초안"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {t.scoringType === "axis" ? "MBTI(axis)" : "최고점(sum)"}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                    {t.questionCount}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                    {t.attemptCount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(t.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <TestRowActions id={t.id} slug={t.slug} status={t.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
