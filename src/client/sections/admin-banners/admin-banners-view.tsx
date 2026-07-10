import Link from "next/link";

import type { Banner } from "@/src/server/db/schema";
import { BannerRowActions } from "./components/banner-row-actions";

interface AdminBannersViewProps {
  banners: Banner[];
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

/** 배너 관리 목록(프레젠테이션). */
export function AdminBannersView({ banners }: AdminBannersViewProps) {
  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">배너 관리</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            전체 {banners.length}개 · 메인 기획전 캐러셀
          </p>
        </div>
        <Link
          href="/admin/banners/new"
          className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-dark"
        >
          + 새 배너
        </Link>
      </header>

      {banners.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          아직 배너가 없습니다.{" "}
          <Link
            href="/admin/banners/new"
            className="font-medium text-primary underline"
          >
            새 배너 만들기
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
                <th className="px-4 py-3 font-medium">미리보기</th>
                <th className="px-4 py-3 font-medium">제목 · 링크</th>
                <th className="px-4 py-3 text-right font-medium">순서</th>
                <th className="px-4 py-3 font-medium">노출</th>
                <th className="px-4 py-3 font-medium">생성일</th>
                <th className="px-4 py-3 font-medium">관리</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/banners/${b.id}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={b.imageUrl}
                        alt={b.title}
                        className="h-12 w-28 rounded-md border border-border object-cover"
                      />
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/banners/${b.id}`}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {b.title}
                    </Link>
                    <p className="max-w-[240px] truncate text-xs text-muted-foreground">
                      {b.linkUrl || "링크 없음"}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                    {b.sortOrder}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        b.isActive
                          ? "inline-flex items-center gap-1 rounded-full bg-green-lighter px-2 py-0.5 text-xs font-medium text-green-dark"
                          : "inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground"
                      }
                    >
                      {b.isActive ? "노출" : "숨김"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(b.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <BannerRowActions
                      id={b.id}
                      title={b.title}
                      isActive={b.isActive}
                    />
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
