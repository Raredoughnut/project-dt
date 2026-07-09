import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16 Cache Components(PPR) — 서버 컴포넌트 캐시/재검증 전략의 기반.
  cacheComponents: true,
  // Docker standalone 배포용 최소 출력.
  output: "standalone",
};

export default nextConfig;
