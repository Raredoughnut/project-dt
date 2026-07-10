import { eq } from "drizzle-orm";

import { db } from "@/src/server/db";
import { adminUsers, type AdminUser } from "@/src/server/db/schema";

/** 아이디로 어드민 계정 조회(로그인 검증용). 없으면 null. */
export async function getAdminByUsername(
  username: string
): Promise<AdminUser | null> {
  const [admin] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.username, username))
    .limit(1);

  return admin ?? null;
}
