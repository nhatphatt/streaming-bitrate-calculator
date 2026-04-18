export interface PlatformContent {
  slug: string;
  name: string;
  description: string;
  h1: string;
  intro: string;
  maxBitrateKbps: number;
  maxResolution: string;
  supportedCodecs: string[];
  ingestProtocol: string;
  settings: { resolution: string; fps: number; bitrateKbps: number; uploadMbps: string }[];
  tips: string[];
  faqs: { q: string; a: string }[];
  relatedBlogSlugs: string[];
}

export const PLATFORM_CONTENT: PlatformContent[] = [
  {
    slug: "twitch",
    name: "Twitch",
    description: "Find the best Twitch streaming settings for 2026. Recommended bitrate, resolution, and OBS settings for every quality level.",
    h1: "Best Twitch Streaming Settings (2026)",
    intro: "Twitch is the largest live streaming platform for gamers. Getting your bitrate and resolution right is critical — too high and non-transcoded viewers will buffer, too low and your stream looks pixelated. Here are the recommended settings for every quality level.",
    maxBitrateKbps: 6000,
    maxResolution: "1080p",
    supportedCodecs: ["H.264 (AVC)"],
    ingestProtocol: "RTMP",
    settings: [
      { resolution: "720p", fps: 30, bitrateKbps: 2500, uploadMbps: "5+" },
      { resolution: "720p", fps: 60, bitrateKbps: 4000, uploadMbps: "7+" },
      { resolution: "1080p", fps: 30, bitrateKbps: 4500, uploadMbps: "8+" },
      { resolution: "1080p", fps: 60, bitrateKbps: 6000, uploadMbps: "10+" },
    ],
    tips: [
      "Non-partners should stay at or below 6,000 Kbps to avoid buffering for viewers without transcoding options.",
      "Use NVENC (GPU encoding) if you have an NVIDIA GPU — it provides excellent quality with minimal CPU impact.",
      "Set your keyframe interval to 2 seconds — Twitch requires this for proper transcoding.",
      "720p 60fps at 4,000–5,000 Kbps often looks better than 1080p 60fps at 6,000 Kbps for fast-paced games.",
      "Enable CBR (Constant Bitrate) mode for the most stable stream quality.",
    ],
    faqs: [
      { q: "What is the max bitrate for Twitch?", a: "Twitch recommends a maximum of 6,000 Kbps for non-partners. Partners may go higher, but transcoding is not guaranteed above 6,000 Kbps, meaning some viewers may experience buffering." },
      { q: "Should I stream at 1080p or 720p on Twitch?", a: "If your upload speed supports 6,000+ Kbps reliably, 1080p 30fps or 900p 60fps works well. For fast-paced games, 720p 60fps at 4,000–5,000 Kbps often provides a better viewer experience than 1080p at the same bitrate." },
      { q: "What encoder should I use for Twitch?", a: "NVENC (New) is recommended for NVIDIA GPU users. x264 on Medium preset is best for CPU encoding. Apple Silicon users should use the hardware H.264 encoder." },
      { q: "Does Twitch support HEVC or AV1?", a: "As of 2026, Twitch only supports H.264 (AVC) for live streaming. HEVC and AV1 are not supported for ingest." },
    ],
    relatedBlogSlugs: ["twitch-streaming-bitrate-guide", "best-obs-bitrate-settings", "obs-bitrate-for-1080p-60fps"],
  },
  {
    slug: "youtube",
    name: "YouTube Live",
    description: "Optimal YouTube Live streaming settings for 2026. Bitrate recommendations for 720p to 4K, including HDR and codec support.",
    h1: "Best YouTube Live Streaming Settings (2026)",
    intro: "YouTube Live supports the widest range of streaming quality — from 720p all the way to 4K 60fps. Unlike Twitch, YouTube transcodes all streams automatically, so higher source bitrate always means better quality for viewers at every resolution.",
    maxBitrateKbps: 51000,
    maxResolution: "4K (2160p)",
    supportedCodecs: ["H.264 (AVC)", "H.265 (HEVC)", "VP9", "AV1"],
    ingestProtocol: "RTMP / HLS",
    settings: [
      { resolution: "720p", fps: 30, bitrateKbps: 2500, uploadMbps: "5+" },
      { resolution: "720p", fps: 60, bitrateKbps: 4000, uploadMbps: "7+" },
      { resolution: "1080p", fps: 30, bitrateKbps: 4500, uploadMbps: "8+" },
      { resolution: "1080p", fps: 60, bitrateKbps: 9000, uploadMbps: "14+" },
      { resolution: "1440p", fps: 30, bitrateKbps: 10000, uploadMbps: "15+" },
      { resolution: "1440p", fps: 60, bitrateKbps: 15000, uploadMbps: "22+" },
      { resolution: "4K", fps: 30, bitrateKbps: 25000, uploadMbps: "38+" },
      { resolution: "4K", fps: 60, bitrateKbps: 40000, uploadMbps: "60+" },
    ],
    tips: [
      "YouTube transcodes all streams, so pushing higher bitrate always improves viewer quality at every resolution level.",
      "For 1080p 60fps, aim for 9,000–12,000 Kbps — significantly higher than Twitch's 6,000 Kbps cap.",
      "YouTube supports HEVC and AV1 for live streaming — if your encoder supports it, you can achieve better quality at lower bitrates.",
      "Set keyframe interval to 2 seconds for optimal transcoding.",
      "Enable low-latency mode for interactive streams, or use ultra-low latency for real-time interaction (adds slight quality reduction).",
    ],
    faqs: [
      { q: "What bitrate should I use for YouTube 1080p 60fps?", a: "YouTube recommends 4,500–9,000 Kbps for 1080p 60fps. For the best quality, aim for 9,000–12,000 Kbps if your upload speed allows it." },
      { q: "Can I stream 4K on YouTube?", a: "Yes, YouTube supports up to 4K 60fps streaming. You need at least 25,000 Kbps (25 Mbps) for 4K 30fps and 40,000 Kbps for 4K 60fps, plus a stable upload speed of 40–60+ Mbps." },
      { q: "Does YouTube support AV1 streaming?", a: "Yes, YouTube supports AV1 for live streaming. AV1 provides better compression than H.264, meaning better quality at the same bitrate. However, real-time AV1 encoding requires modern hardware (NVIDIA RTX 40 series or newer)." },
      { q: "YouTube vs Twitch — which has better stream quality?", a: "YouTube allows much higher bitrates (up to 51,000 Kbps vs Twitch's 6,000 Kbps) and supports more codecs. YouTube also transcodes all streams, while Twitch only guarantees transcoding for partners." },
    ],
    relatedBlogSlugs: ["youtube-streaming-bitrate-guide", "best-obs-bitrate-settings", "best-video-format-for-youtube"],
  },
  {
    slug: "kick",
    name: "Kick",
    description: "Best Kick streaming settings for 2026. Recommended bitrate and resolution for Kick.com live streaming.",
    h1: "Best Kick Streaming Settings (2026)",
    intro: "Kick has quickly grown as a Twitch alternative with more favorable revenue splits for creators. Its streaming requirements are similar to Twitch, with a slightly higher bitrate cap of 8,000 Kbps.",
    maxBitrateKbps: 8000,
    maxResolution: "1080p",
    supportedCodecs: ["H.264 (AVC)"],
    ingestProtocol: "RTMP",
    settings: [
      { resolution: "720p", fps: 30, bitrateKbps: 3000, uploadMbps: "5+" },
      { resolution: "720p", fps: 60, bitrateKbps: 4500, uploadMbps: "8+" },
      { resolution: "1080p", fps: 30, bitrateKbps: 5000, uploadMbps: "8+" },
      { resolution: "1080p", fps: 60, bitrateKbps: 7000, uploadMbps: "12+" },
    ],
    tips: [
      "Kick's 8,000 Kbps cap gives you more headroom than Twitch for 1080p 60fps streaming.",
      "Use the same OBS settings as Twitch — Kick uses the same RTMP ingest protocol.",
      "For fast-paced games, 720p 60fps at 4,500–5,000 Kbps provides excellent quality.",
      "Set keyframe interval to 2 seconds for best compatibility.",
      "Kick provides transcoding for most streamers, but lower bitrate still helps viewers on slower connections.",
    ],
    faqs: [
      { q: "What is the max bitrate for Kick?", a: "Kick supports up to 8,000 Kbps, which is 2,000 Kbps higher than Twitch's recommended maximum. This allows for better 1080p quality." },
      { q: "Can I use the same OBS settings for Kick and Twitch?", a: "Yes, Kick uses RTMP just like Twitch. You can use identical encoder settings — just change the stream server URL and stream key." },
      { q: "Does Kick support 4K streaming?", a: "Kick currently supports up to 1080p. 4K streaming is not available on the platform." },
    ],
    relatedBlogSlugs: ["best-obs-bitrate-settings", "best-streaming-bitrate-by-resolution"],
  },
  {
    slug: "facebook",
    name: "Facebook Gaming",
    description: "Recommended Facebook Gaming stream settings for 2026. Bitrate, resolution, and encoder settings for Facebook Live.",
    h1: "Best Facebook Gaming Stream Settings (2026)",
    intro: "Facebook Gaming (Facebook Live) supports streaming up to 1080p at 8,000 Kbps. While it has a smaller gaming audience than Twitch or YouTube, it offers strong discoverability through the Facebook social graph.",
    maxBitrateKbps: 8000,
    maxResolution: "1080p",
    supportedCodecs: ["H.264 (AVC)"],
    ingestProtocol: "RTMP",
    settings: [
      { resolution: "720p", fps: 30, bitrateKbps: 3000, uploadMbps: "5+" },
      { resolution: "720p", fps: 60, bitrateKbps: 4500, uploadMbps: "8+" },
      { resolution: "1080p", fps: 30, bitrateKbps: 5000, uploadMbps: "8+" },
      { resolution: "1080p", fps: 60, bitrateKbps: 7000, uploadMbps: "12+" },
    ],
    tips: [
      "Facebook recommends 720p at 4,000 Kbps as the sweet spot for most streamers.",
      "Many Facebook viewers watch on mobile — 720p often provides a better experience than 1080p on small screens.",
      "Use a persistent stream key to avoid reconfiguring OBS each time.",
      "Facebook Live supports scheduled streams — use this for better discoverability.",
    ],
    faqs: [
      { q: "What bitrate should I use for Facebook Gaming?", a: "Facebook recommends up to 8,000 Kbps for 1080p. For most streamers, 4,000–5,000 Kbps at 720p 60fps provides the best balance of quality and viewer compatibility." },
      { q: "Does Facebook Gaming support 4K?", a: "No, Facebook Gaming currently supports up to 1080p resolution." },
      { q: "Can I stream to Facebook and Twitch at the same time?", a: "Yes, using multistreaming software like Restream or OBS with multiple outputs. Keep in mind this doubles your upload bandwidth requirement." },
    ],
    relatedBlogSlugs: ["best-obs-bitrate-settings", "streaming-bandwidth-requirements"],
  },
  {
    slug: "discord",
    name: "Discord",
    description: "Best Discord streaming settings for 2026. Go Live quality settings for free users and Nitro subscribers.",
    h1: "Best Discord Streaming Settings (2026)",
    intro: "Discord's Go Live feature lets you stream to up to 10 viewers in a voice channel (50 with Nitro). Free users are limited to 720p 30fps, while Nitro subscribers can stream at 1080p 60fps with higher bitrate.",
    maxBitrateKbps: 8000,
    maxResolution: "1080p (Nitro) / 720p (Free)",
    supportedCodecs: ["H.264 (AVC)"],
    ingestProtocol: "WebRTC",
    settings: [
      { resolution: "720p", fps: 30, bitrateKbps: 2500, uploadMbps: "5+" },
      { resolution: "720p", fps: 60, bitrateKbps: 4000, uploadMbps: "7+" },
      { resolution: "1080p", fps: 30, bitrateKbps: 5000, uploadMbps: "8+" },
      { resolution: "1080p", fps: 60, bitrateKbps: 8000, uploadMbps: "12+" },
    ],
    tips: [
      "Free users are limited to 720p 30fps. Nitro unlocks 1080p 60fps and higher bitrate.",
      "Discord uses WebRTC, not RTMP — you stream directly from the Discord app, not OBS.",
      "For screen sharing, 1080p is more important than high FPS. For gaming, prioritize 60fps.",
      "Close unnecessary applications to reduce CPU usage — Discord encoding happens locally.",
      "If viewers report lag, lower your resolution or FPS in Discord stream settings.",
    ],
    faqs: [
      { q: "What quality can I stream on Discord for free?", a: "Free Discord users can stream at 720p 30fps. Discord Nitro ($9.99/month) unlocks 1080p 60fps streaming and higher bitrate." },
      { q: "Can I use OBS to stream on Discord?", a: "Not directly. Discord uses WebRTC for Go Live. However, you can use a virtual camera (OBS Virtual Camera) to send your OBS output to Discord, though this adds latency." },
      { q: "How many people can watch my Discord stream?", a: "Free users can stream to up to 10 viewers in a voice channel. Nitro subscribers can stream to up to 50 viewers." },
    ],
    relatedBlogSlugs: ["streaming-bandwidth-requirements", "best-streaming-bitrate-by-resolution"],
  },
];

export function getPlatformContent(slug: string): PlatformContent | undefined {
  return PLATFORM_CONTENT.find((p) => p.slug === slug);
}

export function getAllPlatformSlugs(): string[] {
  return PLATFORM_CONTENT.map((p) => p.slug);
}
