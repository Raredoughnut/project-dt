import { SignJWT, jwtVerify } from "jose";

/* ========================================================================
   어드민 세션 토큰(JWT · HS256).
   - jose 만 의존 → 미들웨어(Edge 런타임)와 서버 양쪽에서 사용 가능.
   - next/headers·DB·argon2 등 Node 전용 모듈은 여기서 import 금지.
   ======================================================================== */

/** 세션 쿠키 이름 (미들웨어·서버 공용). */
export const ADMIN_COOKIE_NAME = "dt_admin_session";
/** 세션 유효기간(초) — 8시간. 쿠키 maxAge · JWT exp 공통값. */
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8;

export interface AdminSession {
  /** admin_users.id */
  sub: string;
  username: string;
}

function getSecretKey(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET 환경변수가 필요합니다(.env). 세션 서명/검증 불가."
    );
  }
  return new TextEncoder().encode(secret);
}

/** 세션 페이로드 → 서명된 JWT. */
export async function signSession(session: AdminSession): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({ username: session.username })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.sub)
    .setIssuedAt(now)
    .setExpirationTime(now + ADMIN_SESSION_TTL_SECONDS)
    .sign(getSecretKey());
}

/** JWT 검증 → 세션. 만료·위조 등 실패 시 null. */
export async function verifySession(
  token: string
): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    });
    const { sub, username } = payload;
    if (typeof sub !== "string" || typeof username !== "string") return null;
    return { sub, username };
  } catch {
    return null;
  }
}
