import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/src/components/query-provider";
import { cn } from "@/lib/utils";
import { bagelFatOne } from "@/fonts/bagel-fat-one";
import { pretendard } from "@/fonts/pretendard";
import { suit } from "@/fonts/suit";
import { GoogleAdSense } from "@/src/components/google-adsense";
import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "donutest — 30초 심리테스트",
  description:
    "로그인 없이 30초만에 즐기고 공유하는 심리테스트. 나는 무슨 도넛?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={cn(
        pretendard.variable,
        suit.variable,
        bagelFatOne.variable,
        "h-full",
        "antialiased",
        geistMono.variable,
        "font-sans",
        geistSans.variable,
      )}
    >
      <head>
        {/* 본문·UI = Pretendard / 디스플레이·헤드라인 = SUIT (둘 다 SIL OFL).
            TODO(운영): 자가호스팅(next/font/local, woff2)으로 전환해 외부 의존·CLS 제거. */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendard-variable.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/sun-typeface/SUIT/fonts/variable/woff2/SUIT.css"
        />
        <GoogleAdSense />
      </head>
      <body className="min-h-full flex flex-col">
        <QueryProvider>{children}</QueryProvider>
        {process.env.GOOGLE_ANALYTICS_ID && (
          <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS_ID!} />
        )}
      </body>
    </html>
  );
}
