import Link from "next/link";

import type { AdminSetListItem } from "@/src/server/db/queries/admin-sets";
import { SetRowActions } from "./components/set-row-actions";

interface AdminSetsViewProps {
  sets: AdminSetListItem[];
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

/** 세트 관리 목록(프레젠테이션). */
export function AdminSetsView({ sets }: AdminSetsViewProps) {
  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">세트 관리</h1>
          <p className="mt-1 text-sm text-muted-foreground">전체 {sets.length}개</p>
        </div>
        <Link
          href="/admin/sets/new"
          className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-dark"
        >
          + 새 세트
        </Link>
      </header>

      {sets.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          아직 세트가 없습니다.{" "}
          <Link
            href="/admin/sets/new"
            className="font-medium text-primary underline"
          >
            새 세트 만들기
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
                <th className="px-4 py-3 font-medium">제목</th>
                <th className="px-4 py-3 text-right font-medium">구성 테스트</th>
                <th className="px-4 py-3 font-medium">생성일</th>
                <th className="px-4 py-3 font-medium">관리</th>
              </tr>
            </thead>
            <tbody>
              {sets.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/sets/${s.id}`}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {s.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">/{s.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                    {s.itemCount}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(s.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <SetRowActions id={s.id} title={s.title} />
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
