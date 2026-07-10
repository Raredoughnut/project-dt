const GOOGLE_ADSENSE_CLIENT_ID = process.env.GOOGLE_ADSENSE_ID;

export function GoogleAdSense() {
  if (!GOOGLE_ADSENSE_CLIENT_ID) return null;

  // 애드센스 콘솔이 제공하는 스니펫과 동일하게 <head>에 서버 렌더링되도록
  // next/script(afterInteractive: 하이드레이션 후 클라이언트 주입) 대신 순수 <script> 사용
  return (
    <script
      async
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADSENSE_CLIENT_ID}`}
    />
  );
}