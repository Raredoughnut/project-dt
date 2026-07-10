/**
 * DATABASE_URL 을 반환하되, Supabase 호스트인데 `sslmode` 가 없으면 `require` 를 붙인다.
 * (Supabase 는 TLS 필수 — 연결 문자열에 sslmode 를 깜빡해도 동작하도록 보정)
 * 앱(src/server/db/index.ts)과 drizzle-kit(drizzle.config.ts)이 공유한다.
 */
export function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL 환경변수가 설정되지 않았습니다. .env 를 확인하세요."
    );
  }
  const isSupabase = /supabase\.(co|com)/.test(url);
  if (isSupabase && !/[?&]sslmode=/.test(url)) {
    return `${url}${url.includes("?") ? "&" : "?"}sslmode=require`;
  }
  return url;
}
