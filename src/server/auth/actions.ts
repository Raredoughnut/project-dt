"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { getAdminByUsername } from "@/src/server/db/queries/admin";
import { verifyPassword } from "./password";
import { signSession } from "./session";
import { setSessionCookie, clearSessionCookie } from "./session-cookie";
import type { LoginState } from "./types";

const credentialsSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
});

/** 로그인: 아이디/비번 검증 → 세션 쿠키 발급 → /admin 이동. */
export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = credentialsSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "아이디와 비밀번호를 모두 입력해주세요." };
  }

  const admin = await getAdminByUsername(parsed.data.username);
  const ok = admin
    ? await verifyPassword(admin.passwordHash, parsed.data.password)
    : false;
  // 계정 존재 여부를 노출하지 않도록 실패 메시지는 동일하게.
  if (!admin || !ok) {
    return { error: "아이디 또는 비밀번호가 올바르지 않습니다." };
  }

  const token = await signSession({ sub: admin.id, username: admin.username });
  await setSessionCookie(token);
  redirect("/admin");
}

/** 로그아웃: 세션 쿠키 제거 → 로그인 화면. */
export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/admin/login");
}
