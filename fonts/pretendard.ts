import localFont from "next/font/local";

// Pretendard 로컬 폰트 (woff2)
// - 명시적 weight 없는 본문은 400(Regular)로 렌더링되므로 400을 포함한다.
// - 실사용 weight(500~900) + 기본 400 = 6종 등록. Thin/ExtraLight/Light(100~300)는 미사용이라 제외.
export const pretendard = localFont({
  src: [
    { path: "./Pretendard-Regular.woff2", weight: "400", style: "normal" },
    { path: "./Pretendard-Medium.woff2", weight: "500", style: "normal" },
    { path: "./Pretendard-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./Pretendard-Bold.woff2", weight: "700", style: "normal" },
    { path: "./Pretendard-ExtraBold.woff2", weight: "800", style: "normal" },
    { path: "./Pretendard-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-pretendard",
  display: "swap",
});
