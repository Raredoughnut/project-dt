import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16 Cache Components(PPR) — 서버 컴포넌트 캐시/재검증 전략의 기반.
  cacheComponents: true,
  // Docker standalone 배포용 최소 출력.
  output: "standalone",
  // 네이티브 애드온(argon2)은 번들 대상에서 제외 → 서버에서 require 로 로드.
  serverExternalPackages: ["@node-rs/argon2"],
};

export default nextConfig;
