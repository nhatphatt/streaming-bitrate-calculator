import Script from "next/script";
import { ADSTERRA_POPUNDER_SRC } from "@/lib/adsterra";

/**
 * Adsterra Popunder — loaded once globally from the root layout.
 * One popunder per page is recommended, so this must NOT be placed per-page.
 * next/script dedupes by `id`, guaranteeing a single instance.
 */
export default function AdsterraPopunder() {
  return (
    <Script
      id="adsterra-popunder"
      src={ADSTERRA_POPUNDER_SRC}
      strategy="afterInteractive"
    />
  );
}
