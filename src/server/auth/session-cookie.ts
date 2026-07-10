import { cookies } from "next/headers";

import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_TTL_SECONDS,
  verifySession,
  type AdminSession,
} from "./session";

/* next/headers 를 사용하므로 서버(RSC·서버 액션) 전용. 미들웨어에서 import 금지. */

/** 로그인 성공 시 세션 쿠키 설정. */
export async function setSessionCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  });
}

/** 로그아웃 시 세션 쿠키 제거. */
export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE_NAME);
}

/** 현재 요청의 어드민 세션(쿠키 → 검증). 없거나 무효면 null. */
export async function getCurrentAdmin(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}
