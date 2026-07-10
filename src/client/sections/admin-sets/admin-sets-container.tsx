import { connection } from "next/server";

import { getAdminSets } from "@/src/server/db/queries/admin-sets";
import { AdminSetsView } from "./admin-sets-view";

/** 세트 목록 Container(서버 컴포넌트). connection() 으로 요청 시점 렌더 확정. */
export async function AdminSetsContainer() {
  await connection();
  const sets = await getAdminSets();
  return <AdminSetsView sets={sets} />;
}
