"use client";

import { useEffect, useRef } from "react";

type AdFormat = "leaderboard" | "rectangle" | "in-article" | "responsive";

interface AdSlotProps {
  format?: AdFormat;
  className?: string;
}

/**
 * AdSense ad slot component.
 * Renders nothing (no DOM element at all) when AdSense is not configured.
 * When configured, renders the ad with appropriate spacing.
 */
export default function AdSlot({ format = "responsive", className = "" }: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const adsenseSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT;

  useEffect(() => {
    if (adsenseClient && typeof window !== "undefined") {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch {
        // AdSense not loaded
      }
    }
  }, [adsenseClient]);

  if (!adsenseClient || !adsenseSlot) return null;

  return (
    <div ref={adRef} className={`my-8 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adsenseClient}
        data-ad-slot={adsenseSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
