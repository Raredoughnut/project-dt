import { getCurrentAdmin } from "@/src/server/auth/session-cookie";
import { getAdminOverview } from "@/src/server/db/queries/admin-stats";
import { AdminDashboardView } from "./admin-dashboard-view";

/**
 * 대시보드 Container(서버 컴포넌트).
 * 쿠키 접근으로 동적 렌더 확정(Cache Components) → 이후 DB 집계는 요청 시점 실행.
 * 반드시 <Suspense> 하위에서 렌더한다(page.tsx).
 */
export async function AdminDashboardContainer() {
  const admin = await getCurrentAdmin();
  const overview = await getAdminOverview();
  return (
    <AdminDashboardView
      username={admin?.username ?? "관리자"}
      overview={overview}
    />
  );
}
