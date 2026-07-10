import { getCurrentAdmin } from "@/src/server/auth/session-cookie";

/** 현재 로그인한 어드민 아이디 배지(동적 · Suspense 하위에서 렌더). */
export async function AdminUserBadge() {
  const admin = await getCurrentAdmin();
  if (!admin) return null;
  return (
    <span className="text-sm font-medium text-foreground">
      {admin.username}
    </span>
  );
}
