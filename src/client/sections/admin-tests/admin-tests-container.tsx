import { connection } from "next/server";

import { getAdminTests } from "@/src/server/db/queries/admin-tests";
import { AdminTestsView } from "./admin-tests-view";

/**
 * 테스트 목록 Container(서버 컴포넌트).
 * connection() 으로 요청 시점 렌더 확정(Cache Components) → 항상 최신 목록.
 * 반드시 <Suspense> 하위에서 렌더한다.
 */
export async function AdminTestsContainer() {
  await connection();
  const tests = await getAdminTests();
  return <AdminTestsView tests={tests} />;
}
