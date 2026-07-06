/**
 * Submit all sitemap URLs to IndexNow (Bing, Yandex, Seznam — and Google is piloting it).
 *
 * Run manually:   npx tsx scripts/submit-indexnow.ts
 * Runs automatically after `npm run deploy`.
 *
 * The key file must be live at https://streamersize.com/<KEY>.txt first,
 * which happens on deploy (public/<KEY>.txt is copied into the build).
 */

import { readFileSync } from "fs";
import { resolve } from "path";

const HOST = "streamersize.com";
const KEY = "072ebb6914a8168de327614ea41550b7";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

function getSitemapUrls(): string[] {
  const xml = readFileSync(resolve(__dirname, "../public/sitemap.xml"), "utf-8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function main() {
  const urlList = getSitemapUrls();
  if (urlList.length === 0) {
    console.error("No URLs found in sitemap. Run the sitemap generator first.");
    process.exit(1);
  }

  const body = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList };

  console.log(`Submitting ${urlList.length} URLs to IndexNow…`);
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  // IndexNow returns 200 (accepted) or 202 (accepted, pending). 4xx = problem.
  if (res.ok || res.status === 202) {
    console.log(`✅ IndexNow accepted (HTTP ${res.status}). ${urlList.length} URLs submitted.`);
  } else {
    const text = await res.text().catch(() => "");
    console.error(`⚠️ IndexNow returned HTTP ${res.status}. ${text}`);
    // Don't fail the deploy over a ping error.
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("IndexNow submit failed:", err);
  process.exit(0); // never break deploy pipeline
});
