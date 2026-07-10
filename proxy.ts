import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_COOKIE_NAME, verifySession } from "@/src/server/auth/session";

/* /admin/* 접근 게이트 (Next 16 proxy 규칙, 구 middleware).
   세션 JWT(jose)만 검증 → Edge 런타임 호환.
   실제 비밀번호 검증(argon2)은 서버 액션(Node)에서만 수행한다. */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = token ? await verifySession(token) : null;

  const isLoginRoute = pathname === "/admin/login";

  if (isLoginRoute) {
    // 이미 로그인 상태면 대시보드로 되돌린다.
    if (session) return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.next();
  }

  // 그 외 /admin/* : 세션 없으면 로그인으로.
  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
