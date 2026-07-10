import { ImageResponse } from "next/og";
import { getPlayableTest } from "@/src/server/db/queries/tests";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "donutest 결과 카드";

// satori는 woff2를 지원하지 않으므로 OTF를 사용한다(리포 폰트는 woff2뿐).
// TODO(운영): layout의 CDN 폰트와 함께 self-host(OTF 동봉)로 전환.
const FONT_URL =
  "https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/public/static/Pretendard-Bold.otf";

let fontPromise: Promise<ArrayBuffer> | null = null;
function loadFont(): Promise<ArrayBuffer> {
  if (!fontPromise) {
    fontPromise = fetch(FONT_URL).then((res) => {
      if (!res.ok) throw new Error(`OG font fetch 실패: ${res.status}`);
      return res.arrayBuffer();
    });
  }
  return fontPromise;
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string; code: string }>;
}) {
  const { slug, code } = await params;
  const test = await getPlayableTest(slug);
  const result = test?.results.find((r) => r.code === code) ?? test?.results[0];
  const font = await loadFont();

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          fontFamily: "Pretendard",
          padding: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 34,
            color: "#c21e56",
            marginBottom: 28,
          }}
        >
          {test?.title ?? "심리테스트"}
        </div>

        {/* 도넛 링 */}
        <div
          style={{
            display: "flex",
            width: 200,
            height: 200,
            borderRadius: 999,
            borderWidth: 50,
            borderStyle: "solid",
            borderColor: "#ffa5c1",
            backgroundColor: "#ffffff",
            marginBottom: 44,
          }}
        />

        {result?.subtitle ? (
          <div
            style={{
              display: "flex",
              fontSize: 36,
              color: "#ff4f87",
              marginBottom: 14,
            }}
          >
            {result.subtitle}
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            fontSize: 76,
            color: "#111827",
            textAlign: "center",
          }}
        >
          {result?.title ?? "donutest"}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#9ca3af",
            marginTop: 52,
            letterSpacing: 2,
          }}
        >
          donutest
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Pretendard", data: font, weight: 700, style: "normal" }],
    }
  );
}
