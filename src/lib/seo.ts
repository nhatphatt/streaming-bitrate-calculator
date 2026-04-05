import { RESOLUTIONS, FPS_OPTIONS, CODECS, BASE_BITRATES } from "@/data/presets";
import { calculate, toDurationSeconds } from "./calculate";

const SITE_URL = "https://streamersize.com";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

/**
 * Generate BreadcrumbList JSON-LD for a given dynamic page.
 */
export function breadcrumbSchema(nameOrResLabel: string, fpsLabel: string, slug: string) {
  // Support both: breadcrumbSchema("4K 60fps HEVC", "", slug) and breadcrumbSchema("4K", "60fps", slug)
  const displayName = fpsLabel
    ? `${nameOrResLabel} at ${fpsLabel}`
    : nameOrResLabel;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "File Size Calculator",
        item: absoluteUrl("/size/"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: displayName,
        item: absoluteUrl(`/size/${slug}/`),
      },
    ],
  };
}

/**
 * Generate unique FAQ data for a resolution+fps combo page.
 */
export function generateFaqForCombo(
  resSlug: string,
  resLabel: string,
  resWidth: number,
  resHeight: number,
  fpsValue: number,
  fpsLabel: string
) {
  // Pre-calculate some values for FAQ answers
  const h264Result = calculate({
    resolution: resSlug,
    fps: fpsValue,
    codec: "h264",
    audioBitrateKbps: 128,
    durationSeconds: toDurationSeconds(1, 0, 0),
  });
  const hevcResult = calculate({
    resolution: resSlug,
    fps: fpsValue,
    codec: "hevc",
    audioBitrateKbps: 128,
    durationSeconds: toDurationSeconds(1, 0, 0),
  });

  return [
    {
      q: `How large is a 1-hour ${resLabel} ${fpsLabel} video file?`,
      a: `Using H.264, a 1-hour ${resLabel} video at ${fpsLabel} is approximately ${h264Result.fileSizeFormatted}. With HEVC (H.265), it drops to around ${hevcResult.fileSizeFormatted} — about 40% smaller.`,
    },
    {
      q: `What bitrate should I use for ${resLabel} at ${fpsLabel}?`,
      a: `For ${resLabel} (${resWidth}×${resHeight}) at ${fpsLabel} with H.264, a bitrate of ${(h264Result.videoBitrateKbps / 1000).toFixed(1)} Mbps is recommended. Using HEVC or AV1, you can achieve similar quality at ${(hevcResult.videoBitrateKbps / 1000).toFixed(1)} Mbps.`,
    },
    {
      q: `What internet speed do I need to stream ${resLabel} at ${fpsLabel}?`,
      a: `You need at least ${h264Result.recommendedBandwidthMbps} Mbps upload speed for ${resLabel} ${fpsLabel} streaming with H.264. With a more efficient codec like HEVC, ${hevcResult.recommendedBandwidthMbps} Mbps is sufficient. We recommend 1.5× headroom above your stream bitrate.`,
    },
    {
      q: `Is ${resLabel} at ${fpsLabel} good for YouTube/Twitch?`,
      a: resSlug === "4k" || resSlug === "8k"
        ? `${resLabel} at ${fpsLabel} is excellent for YouTube uploads where viewers can select quality. For Twitch, most streamers use 1080p60 due to bitrate caps, but ${resLabel} recording for local editing is common among professional creators.`
        : `Yes, ${resLabel} at ${fpsLabel} is widely supported on YouTube, Twitch, and most streaming platforms. It offers a great balance of quality and file size for most content types.`,
    },
  ];
}

/**
 * Build FAQPage JSON-LD from an array of {q, a} items.
 */
export function faqPageSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}
