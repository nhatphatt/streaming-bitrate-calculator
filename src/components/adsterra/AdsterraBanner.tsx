"use client";

import { useMemo } from "react";
import {
  ADSTERRA_DOMAIN,
  ADSTERRA_BANNER_468,
  ADSTERRA_BANNER_320,
  type AdsterraBannerConfig,
} from "@/lib/adsterra";

/**
 * Renders an Adsterra iframe banner inside a sandboxed <iframe srcDoc> so the
 * global `atOptions` object each banner sets does NOT collide when multiple
 * banners appear on the same page (Adsterra's snippet is not multi-instance
 * safe on its own). Each frame is fully isolated.
 */
function bannerHtml({ key, width, height }: AdsterraBannerConfig) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}body{display:flex;align-items:center;justify-content:center}</style></head><body><script type="text/javascript">atOptions={'key':'${key}','format':'iframe','height':${height},'width':${width},'params':{}};</script><script type="text/javascript" src="${ADSTERRA_DOMAIN}/${key}/invoke.js"></script></body></html>`;
}

function BannerFrame({
  config,
  className = "",
}: {
  config: AdsterraBannerConfig;
  className?: string;
}) {
  const html = useMemo(() => bannerHtml(config), [config]);
  return (
    <iframe
      title="Advertisement"
      srcDoc={html}
      width={config.width}
      height={config.height}
      scrolling="no"
      style={{
        width: config.width,
        height: config.height,
        border: 0,
        overflow: "hidden",
        display: "block",
      }}
      className={className}
      aria-hidden="true"
    />
  );
}

type Variant = "responsive" | "banner468" | "banner320";

/**
 * Ad banner slot.
 * - `responsive` (default): 468x60 on >=sm screens, 320x50 on mobile.
 * - `banner468` / `banner320`: force a single fixed size.
 */
export default function AdsterraBanner({
  variant = "responsive",
  className = "",
}: {
  variant?: Variant;
  className?: string;
}) {
  return (
    <div
      className={`my-6 flex w-full justify-center ${className}`}
      role="complementary"
      aria-label="Advertisement"
    >
      {variant === "banner468" && <BannerFrame config={ADSTERRA_BANNER_468} />}
      {variant === "banner320" && <BannerFrame config={ADSTERRA_BANNER_320} />}
      {variant === "responsive" && (
        <>
          <BannerFrame config={ADSTERRA_BANNER_468} className="hidden sm:block" />
          <BannerFrame config={ADSTERRA_BANNER_320} className="block sm:hidden" />
        </>
      )}
    </div>
  );
}
