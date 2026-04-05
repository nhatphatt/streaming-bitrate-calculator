import type { Metadata } from "next";

export const PRIORITY_SIZE_SLUGS = [
  "720p-60fps",
  "1080p-30fps",
  "1080p-60fps",
  "1440p-60fps",
  "4k-30fps",
  "4k-60fps",
] as const;

export function isPrioritySizeSlug(slug: string): boolean {
  return (PRIORITY_SIZE_SLUGS as readonly string[]).includes(slug);
}

export const SIZE_HUBS = {
  "720p-streaming-bitrate": {
    title: "Best Streaming Bitrate for 720p",
    description:
      "Find the ideal bitrate for 720p streaming, with recommendations for 30fps, 60fps, Twitch, YouTube, and OBS.",
    h1: "Best Streaming Bitrate for 720p",
    intro:
      "720p is still one of the best resolutions for streamers with limited upload speed. It offers a strong balance of clarity, stability, and viewer compatibility.",
    rows: [
      ["Twitch", "30fps", "2,500–4,000 Kbps", "5–7 Mbps"],
      ["Twitch", "60fps", "3,500–5,000 Kbps", "7–9 Mbps"],
      ["YouTube", "30fps", "2,500–4,500 Kbps", "5–8 Mbps"],
      ["YouTube", "60fps", "3,500–5,500 Kbps", "7–10 Mbps"],
    ],
    links: [
      { href: "/size/720p-60fps/", label: "720p 60fps calculator" },
      { href: "/blog/twitch-streaming-bitrate-guide/", label: "Twitch bitrate guide" },
      { href: "/blog/youtube-streaming-bitrate-guide/", label: "YouTube bitrate guide" },
      { href: "/tools/bandwidth-calculator/", label: "upload speed calculator" },
    ],
  },
  "1080p-streaming-bitrate": {
    title: "Best Streaming Bitrate for 1080p",
    description:
      "Find the best bitrate for 1080p streaming on YouTube, Twitch, and OBS, including 30fps vs 60fps recommendations and upload speed guidance.",
    h1: "Best Streaming Bitrate for 1080p",
    intro:
      "1080p is the sweet spot for most streamers. It looks sharp, is widely supported, and still works well on mainstream upload speeds when bitrate is tuned properly.",
    rows: [
      ["Twitch", "30fps", "4,500–6,000 Kbps", "8–10 Mbps"],
      ["Twitch", "60fps", "6,000 Kbps", "10+ Mbps"],
      ["YouTube", "30fps", "4,500–9,000 Kbps", "8–14 Mbps"],
      ["YouTube", "60fps", "6,000–12,000 Kbps", "10–18 Mbps"],
    ],
    links: [
      { href: "/size/1080p-30fps/", label: "1080p 30fps calculator" },
      { href: "/size/1080p-60fps/", label: "1080p 60fps calculator" },
      { href: "/blog/twitch-streaming-bitrate-guide/", label: "Twitch bitrate guide" },
      { href: "/blog/youtube-streaming-bitrate-guide/", label: "YouTube bitrate guide" },
      { href: "/blog/obs-bitrate-for-1080p-60fps/", label: "OBS 1080p 60fps guide" },
    ],
  },
  "1440p-streaming-bitrate": {
    title: "Best Streaming Bitrate for 1440p",
    description:
      "Discover the best bitrate settings for 1440p streaming, including upload speed and platform-specific recommendations.",
    h1: "Best Streaming Bitrate for 1440p",
    intro:
      "1440p, often called 2K by creators, gives a visible quality jump over 1080p. It also needs much more bitrate, so it works best on stronger setups.",
    rows: [
      ["YouTube", "30fps", "8,000–15,000 Kbps", "12–22 Mbps"],
      ["YouTube", "60fps", "12,000–20,000 Kbps", "18–30 Mbps"],
      ["Twitch", "30fps", "Not ideal", "10+ Mbps"],
      ["Twitch", "60fps", "Usually not practical", "15+ Mbps"],
    ],
    links: [
      { href: "/size/1440p-60fps/", label: "1440p 60fps calculator" },
      { href: "/blog/youtube-streaming-bitrate-guide/", label: "YouTube bitrate guide" },
      { href: "/blog/best-streaming-bitrate-by-resolution/", label: "bitrate by resolution guide" },
      { href: "/tools/bandwidth-calculator/", label: "upload speed calculator" },
    ],
  },
  "4k-streaming-bitrate": {
    title: "Best Streaming Bitrate for 4K",
    description:
      "Learn the recommended bitrate for 4K streaming, including 30fps vs 60fps settings, upload speed needs, and codec tips.",
    h1: "Best Streaming Bitrate for 4K",
    intro:
      "4K streaming can look excellent, but it quickly exposes weak upload speeds and underpowered encoders. For most creators, stability matters more than chasing the highest possible resolution.",
    rows: [
      ["YouTube", "30fps", "20,000–35,000 Kbps", "30–50 Mbps"],
      ["YouTube", "60fps", "30,000–51,000 Kbps", "45–75 Mbps"],
      ["Twitch", "30fps", "Not ideal", "20+ Mbps"],
      ["Twitch", "60fps", "Generally not practical", "35+ Mbps"],
    ],
    links: [
      { href: "/size/4k-30fps/", label: "4K 30fps calculator" },
      { href: "/size/4k-60fps/", label: "4K 60fps calculator" },
      { href: "/blog/youtube-streaming-bitrate-guide/", label: "YouTube bitrate guide" },
      { href: "/compare/", label: "codec comparison" },
      { href: "/tools/bandwidth-calculator/", label: "upload speed calculator" },
    ],
  },
} as const;

export type SizeHubSlug = keyof typeof SIZE_HUBS;

export function isSizeHubSlug(slug: string): slug is SizeHubSlug {
  return slug in SIZE_HUBS;
}

export function getSizeHubMetadata(slug: SizeHubSlug): Metadata {
  const hub = SIZE_HUBS[slug];
  return {
    title: hub.title,
    description: hub.description,
    alternates: { canonical: `/size/${slug}/` },
    openGraph: { title: hub.title, description: hub.description, type: "website" },
    twitter: { card: "summary_large_image", title: hub.title, description: hub.description },
  };
}
