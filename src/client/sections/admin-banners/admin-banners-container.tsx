import { connection } from "next/server";

import { getAdminBanners } from "@/src/server/db/queries/banners";
import { AdminBannersView } from "./admin-banners-view";

/** 배너 목록 Container(서버 컴포넌트). connection() 으로 요청 시점 렌더 확정. */
export async function AdminBannersContainer() {
  await connection();
  const banners = await getAdminBanners();
  return <AdminBannersView banners={banners} />;
}
