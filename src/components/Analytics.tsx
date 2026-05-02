/**
 * Google Analytics (GA4) + AdSense script component.
 *
 * Set these env vars in .env.local for production:
 *   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
 *   NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXX
 *
 * Placeholder values (G-XXXXXXXXXX, ca-pub-XXXXXXXXXX) are skipped so they
 * never reach production HTML.
 */

import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

const isPlaceholder = (v?: string) => !v || /X{4,}/.test(v);

const VALID_GA = isPlaceholder(GA_ID) ? null : GA_ID;
const VALID_ADSENSE = isPlaceholder(ADSENSE_CLIENT) ? null : ADSENSE_CLIENT;

export default function Analytics() {
  return (
    <>
      {VALID_GA && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${VALID_GA}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${VALID_GA}');`}
          </Script>
        </>
      )}

      {VALID_ADSENSE && (
        <Script
          id="adsense-loader"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${VALID_ADSENSE}`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      )}
    </>
  );
}
