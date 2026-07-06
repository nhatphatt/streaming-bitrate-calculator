/**
 * Google Analytics (GA4) script component.
 *
 * Set this env var in .env.local for production:
 *   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
 *
 * Placeholder value (G-XXXXXXXXXX) is skipped so it never reaches production
 * HTML. Ads are served by Adsterra (see src/lib/adsterra.ts + AdsterraPopunder),
 * not AdSense.
 */

import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const isPlaceholder = (v?: string) => !v || /X{4,}/.test(v);

const VALID_GA = isPlaceholder(GA_ID) ? null : GA_ID;

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
    </>
  );
}
