import localFont from "next/font/local";

// Bagel Fat One 로컬 폰트 (ttf)
// - 명시적 weight 없는 본문은 400(Regular)로 렌더링되므로 400을 포함한다.
export const bagelFatOne = localFont({
  src: [
    { path: "./BagelFatOne-Regular.ttf", weight: "400", style: "normal" },
  ],
  variable: "--font-bagel-fat-one",
  display: "swap",
});
