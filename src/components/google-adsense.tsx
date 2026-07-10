import Script from "next/script";

const GOOGLE_ADSENSE_CLIENT_ID = process.env.GOOGLE_ADSENSE_ID;

export function GoogleAdSense() {
  return (
    <Script
      id="google-adsense"
      strategy="afterInteractive"
      async
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADSENSE_CLIENT_ID}`}
    />
  );
}
