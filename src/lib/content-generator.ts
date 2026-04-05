/**
 * Content Generator — Spintax-style unique content for each SEO page.
 *
 * Produces ~150-200 words of unique text per (resolution, fps, codec) combo,
 * ensuring 30%+ content differentiation between pages to satisfy
 * Google Helpful Content guidelines.
 */

import type { Resolution, Fps, Codec } from "./seo-matrix";
import { calculate, toDurationSeconds, formatFileSize } from "./calculate";

/* ------------------------------------------------------------------ */
/*  Data Maps — resolution/fps/codec specific phrases                 */
/* ------------------------------------------------------------------ */

const RES_CONTEXT: Record<Resolution, {
  name: string;
  pixels: string;
  audience: string[];
  detail: string;
}> = {
  "720p": {
    name: "720p (HD)",
    pixels: "1280×720",
    audience: [
      "casual streamers and mobile viewers",
      "budget-conscious content creators",
      "educators and webinar hosts",
    ],
    detail:
      "While 720p is no longer the gold standard, it remains a practical choice for bandwidth-limited environments and platforms that prioritize smooth playback over pixel density.",
  },
  "1080p": {
    name: "1080p (Full HD)",
    pixels: "1920×1080",
    audience: [
      "the majority of YouTube creators and Twitch streamers",
      "corporate video producers and online educators",
      "gamers streaming competitive titles where frame rate matters more than resolution",
    ],
    detail:
      "Full HD at 1080p is the most widely adopted resolution for online video. It strikes the ideal balance between visual clarity and manageable file sizes, making it the default for platforms like YouTube, Twitch, and Vimeo.",
  },
  "1440p": {
    name: "1440p (2K / QHD)",
    pixels: "2560×1440",
    audience: [
      "PC gaming content creators who want sharper visuals than 1080p",
      "tech reviewers and product demo channels",
      "streamers with high-end rigs targeting quality-conscious audiences",
    ],
    detail:
      "QHD at 1440p offers a noticeable quality jump over 1080p without the extreme bandwidth demands of 4K. It is increasingly popular among gaming YouTubers and desktop-focused content.",
  },
  "4k": {
    name: "4K (Ultra HD / 2160p)",
    pixels: "3840×2160",
    audience: [
      "professional filmmakers and cinematographers",
      "nature and travel vloggers seeking cinematic quality",
      "high-end YouTube channels focused on visual storytelling",
    ],
    detail:
      "4K Ultra HD delivers four times the pixel count of 1080p, producing stunningly detailed footage. It has become the standard for professional production and is increasingly expected by audiences on large screens and smart TVs.",
  },
  "8k": {
    name: "8K (Full Ultra HD / 4320p)",
    pixels: "7680×4320",
    audience: [
      "cutting-edge production studios and VR content creators",
      "large-format display and digital signage producers",
      "future-proofing archivists who want maximum source quality",
    ],
    detail:
      "8K pushes the boundaries of current display technology with 33 million pixels per frame. While consumer 8K adoption is still limited, it provides unmatched flexibility for cropping, stabilization, and future-proof archiving.",
  },
};

const FPS_CONTEXT: Record<number, {
  name: string;
  useCase: string[];
  feel: string;
}> = {
  24: {
    name: "24 fps",
    useCase: [
      "cinematic film productions and short films",
      "narrative storytelling that benefits from the classic film look",
      "music videos and artistic content",
    ],
    feel: "This frame rate produces the classic cinematic motion blur that audiences associate with Hollywood films. It is the standard for theatrical releases and gives footage a warm, filmic quality.",
  },
  30: {
    name: "30 fps",
    useCase: [
      "standard YouTube uploads and social media content",
      "live-action vlogs, tutorials, and talking-head videos",
      "broadcast television and news production",
    ],
    feel: "At 30 frames per second, video appears smooth and natural for most content types. It is the default for the vast majority of online video platforms and provides excellent compatibility across all devices.",
  },
  60: {
    name: "60 fps",
    useCase: [
      "fast-paced gaming content and esports highlights",
      "sports coverage and action sequences",
      "screen recordings and software demos where smooth scrolling matters",
    ],
    feel: "Doubling the frame rate to 60fps delivers noticeably smoother motion, especially in scenes with fast movement. Viewers on 60Hz+ displays will immediately notice the fluidity compared to 30fps content.",
  },
  120: {
    name: "120 fps",
    useCase: [
      "slow-motion footage when played back at 30 or 60fps",
      "competitive gaming captures where every frame counts",
      "high-end sports analysis and biomechanics research",
    ],
    feel: "Recording at 120fps is primarily used for creating smooth slow-motion effects. When played back at 30fps, you get a beautiful 4× slow-motion effect that reveals details invisible to the naked eye.",
  },
};

const CODEC_CONTEXT: Record<Codec, {
  fullName: string;
  strength: string;
  weakness: string;
  bestFor: string;
  compressionNote: string;
}> = {
  h264: {
    fullName: "H.264 (AVC)",
    strength:
      "universal hardware and software compatibility across all devices, browsers, and platforms",
    weakness:
      "larger file sizes compared to newer codecs, requiring more storage and bandwidth",
    bestFor:
      "maximum compatibility when your audience uses a wide range of devices",
    compressionNote:
      "As the baseline codec, H.264 produces the largest files among modern streaming codecs but guarantees playback on virtually every device manufactured in the last decade.",
  },
  hevc: {
    fullName: "H.265 (HEVC)",
    strength:
      "approximately 40% better compression than H.264 at equivalent visual quality",
    weakness:
      "licensing costs and slower encoding speed, plus limited browser support in some cases",
    bestFor:
      "4K and higher resolution content where storage savings are critical",
    compressionNote:
      "HEVC cuts file sizes by nearly half compared to H.264, making it the go-to codec for 4K workflows. Hardware decoding support is now widespread on modern GPUs, smartphones, and smart TVs.",
  },
  av1: {
    fullName: "AV1",
    strength:
      "best-in-class compression efficiency with roughly 50% savings over H.264, and it is completely royalty-free",
    weakness:
      "significantly slower encoding times, though hardware encoders on newer GPUs (NVIDIA RTX 40-series, Intel Arc) are closing this gap",
    bestFor:
      "web-first distribution where YouTube, Netflix, or browser playback is the primary target",
    compressionNote:
      "AV1 represents the future of video compression. YouTube, Netflix, and all major browsers now support it. While encoding is demanding, the bandwidth savings are substantial — especially valuable for creators paying for CDN delivery.",
  },
  prores: {
    fullName: "Apple ProRes",
    strength:
      "exceptional editing performance with minimal quality loss, designed for post-production workflows",
    weakness:
      "extremely large file sizes (3–5× H.264), making it impractical for streaming or web delivery",
    bestFor:
      "professional editing, color grading, and VFX pipelines where quality is non-negotiable",
    compressionNote:
      "ProRes is an intra-frame codec, meaning each frame is independently compressed. This makes scrubbing and editing buttery smooth but results in much larger files. It is a production codec, not a delivery codec.",
  },
};

/* ------------------------------------------------------------------ */
/*  Intro paragraph templates — 6 variants, selected by hash          */
/* ------------------------------------------------------------------ */

const INTRO_TEMPLATES = [
  (r: string, f: string, c: string) =>
    `When working with ${r} video at ${f} using the ${c} codec, understanding your storage and bandwidth requirements is essential for a smooth production workflow.`,

  (r: string, f: string, c: string) =>
    `Planning to record or stream ${r} footage at ${f} with ${c}? Knowing the exact file size and bitrate before you start saves both time and storage headaches.`,

  (r: string, f: string, c: string) =>
    `Producing ${r} content at ${f} encoded with ${c} demands careful planning around storage capacity and upload bandwidth.`,

  (r: string, f: string, c: string) =>
    `If you are capturing ${r} video at ${f} and encoding with ${c}, you need to know exactly how much disk space and network bandwidth your workflow requires.`,

  (r: string, f: string, c: string) =>
    `Streaming or recording at ${r} resolution and ${f} with the ${c} codec? Here is everything you need to know about file sizes, bitrates, and recommended bandwidth.`,

  (r: string, f: string, c: string) =>
    `Whether you are a streamer, filmmaker, or content creator, working with ${r} at ${f} using ${c} encoding comes with specific storage and bandwidth considerations.`,

  (r: string, f: string, c: string) =>
    `${r} video recorded at ${f} with the ${c} codec strikes a specific balance between quality and file size — here is exactly what to expect from your storage and bandwidth.`,

  (r: string, f: string, c: string) =>
    `For anyone serious about video production at ${r} and ${f}, choosing ${c} as your codec is a deliberate decision. Let us break down the real-world numbers behind that choice.`,

  (r: string, f: string, c: string) =>
    `Before you hit record on your next ${r} ${f} project using ${c}, take two minutes to understand your storage footprint and upload bandwidth requirements — it can save hours of frustration.`,

  (r: string, f: string, c: string) =>
    `The combination of ${r} resolution, ${f} frame rate, and ${c} encoding defines your video's quality ceiling and its storage demands. Here is a precise breakdown for your workflow.`,

  (r: string, f: string, c: string) =>
    `Running out of disk space mid-shoot is every creator's nightmare. If you are working with ${r} at ${f} using ${c}, this guide gives you the exact numbers to plan your storage in advance.`,

  (r: string, f: string, c: string) =>
    `Not all ${r} video is created equal — your ${f} frame rate and ${c} codec choice dramatically affect how much storage you need. Here is a data-driven breakdown of what to expect.`,

  (r: string, f: string, c: string) =>
    `Comparing codecs for your ${r} ${f} workflow? ${c} is a popular choice — but understanding its file size and bandwidth profile is critical before committing to a production pipeline.`,

  (r: string, f: string, c: string) =>
    `Uploading ${r} content encoded with ${c} at ${f} requires careful Internet bandwidth planning. This page calculates exactly how much upload speed you need and how large your files will be.`,

  (r: string, f: string, c: string) =>
    `Professional and amateur creators alike face the same question when working in ${r} at ${f}: how much storage is \"enough\"? With ${c}, the answer depends on your specific workflow — and we have the numbers.`,
];

/* ------------------------------------------------------------------ */
/*  Main generator function                                           */
/* ------------------------------------------------------------------ */

/**
 * Simple deterministic hash to pick template variants consistently.
 */
function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export interface GeneratedContent {
  /** ~150-200 word article HTML string */
  articleHtml: string;
  /** Plain text summary (for meta/schema) */
  summary: string;
  /** Unique FAQ entries for this combo */
  faqs: { q: string; a: string }[];
}

export function generateContent(
  resolution: Resolution,
  fps: Fps,
  codec: Codec
): GeneratedContent {
  const res = RES_CONTEXT[resolution];
  const fpsCtx = FPS_CONTEXT[fps];
  const codecCtx = CODEC_CONTEXT[codec];
  const slug = `${resolution}-${fps}fps-${codec}`;
  const hash = hashSlug(slug);

  // Calculate real numbers for this combo
  const calc1hr = calculate({
    resolution,
    fps,
    codec,
    audioBitrateKbps: 128,
    durationSeconds: toDurationSeconds(1, 0, 0),
  });
  const calc10min = calculate({
    resolution,
    fps,
    codec,
    audioBitrateKbps: 128,
    durationSeconds: toDurationSeconds(0, 10, 0),
  });

  // Pick intro template deterministically
  const introFn = INTRO_TEMPLATES[hash % INTRO_TEMPLATES.length];
  const intro = introFn(res.name, fpsCtx.name, codecCtx.fullName);

  // Pick audience variant
  const audience = res.audience[hash % res.audience.length];

  // Build article paragraphs
  const p1 = intro;

  const p2 = `${res.detail} This resolution is particularly favored by ${audience}.`;

  const p3 = `${fpsCtx.feel}`;

  const p4 = `The ${codecCtx.fullName} codec offers ${codecCtx.strength}. ${codecCtx.compressionNote}`;

  const p5 = `With these settings, a <strong>10-minute clip weighs approximately ${calc10min.fileSizeFormatted}</strong>, while a <strong>full hour reaches ${calc1hr.fileSizeFormatted}</strong>. You will need a minimum upload speed of <strong>${calc1hr.recommendedBandwidthMbps} Mbps</strong> for reliable streaming. The total video bitrate for this configuration is <strong>${(calc1hr.videoBitrateKbps / 1000).toFixed(1)} Mbps</strong>.`;

  const articleHtml = [
    `<p>${p1}</p>`,
    `<p>${p2}</p>`,
    `<p>${p3}</p>`,
    `<p>${p4}</p>`,
    `<p>${p5}</p>`,
  ].join("\n");

  const summary = `${res.name} at ${fpsCtx.name} with ${codecCtx.fullName}: ${calc1hr.fileSizeFormatted}/hour, ${calc1hr.totalBitrateMbps} Mbps bitrate. ${codecCtx.bestFor}.`;

  // Unique FAQs
  const faqs = generateFaqs(resolution, fps, codec, calc1hr, calc10min, res, fpsCtx, codecCtx);

  return { articleHtml, summary, faqs };
}

/* ------------------------------------------------------------------ */
/*  FAQ generator                                                     */
/* ------------------------------------------------------------------ */

function generateFaqs(
  resolution: Resolution,
  fps: Fps,
  codec: Codec,
  calc1hr: ReturnType<typeof calculate>,
  calc10min: ReturnType<typeof calculate>,
  res: (typeof RES_CONTEXT)[Resolution],
  fpsCtx: (typeof FPS_CONTEXT)[number],
  codecCtx: (typeof CODEC_CONTEXT)[Codec]
): { q: string; a: string }[] {
  // Compare with H.264 baseline
  const h264Calc = calculate({
    resolution,
    fps,
    codec: "h264",
    audioBitrateKbps: 128,
    durationSeconds: toDurationSeconds(1, 0, 0),
  });
  const savingsVsH264 =
    codec !== "h264"
      ? Math.round(
          (1 - calc1hr.fileSizeBytes / h264Calc.fileSizeBytes) * 100
        )
      : 0;

  return [
    {
      q: `How large is a 1-hour ${res.name} video at ${fpsCtx.name} with ${codecCtx.fullName}?`,
      a: `A 1-hour ${res.name} video at ${fpsCtx.name} encoded with ${codecCtx.fullName} is approximately ${calc1hr.fileSizeFormatted}. A 10-minute clip would be around ${calc10min.fileSizeFormatted}.`,
    },
    {
      q: `What bitrate does ${res.name} at ${fpsCtx.name} with ${codecCtx.fullName} require?`,
      a: `This configuration requires a video bitrate of ${(calc1hr.videoBitrateKbps / 1000).toFixed(1)} Mbps, with a total bitrate (including 128 Kbps audio) of ${calc1hr.totalBitrateMbps} Mbps. We recommend an upload speed of at least ${calc1hr.recommendedBandwidthMbps} Mbps for reliable streaming.`,
    },
    {
      q: `How much bandwidth do I need to stream ${res.name} ${fpsCtx.name} ${codecCtx.fullName}?`,
      a: `You need at least ${calc1hr.recommendedBandwidthMbps} Mbps upload speed. This includes a 1.5× safety margin above the ${calc1hr.totalBitrateMbps} Mbps stream bitrate to prevent buffering and dropped frames.`,
    },
    ...(codec !== "h264"
      ? [
          {
            q: `How does ${codecCtx.fullName} compare to H.264 for ${res.name} ${fpsCtx.name}?`,
            a: `${codecCtx.fullName} ${savingsVsH264 > 0 ? `saves approximately ${savingsVsH264}% in file size` : `produces files about ${Math.abs(savingsVsH264)}% larger`} compared to H.264 for ${res.name} at ${fpsCtx.name}. H.264 produces ${h264Calc.fileSizeFormatted}/hour, while ${codecCtx.fullName} produces ${calc1hr.fileSizeFormatted}/hour.`,
          },
        ]
      : [
          {
            q: `Is H.264 still the best codec for ${res.name} at ${fpsCtx.name}?`,
            a: `H.264 offers the widest device compatibility but produces the largest files. For ${res.name} at ${fpsCtx.name}, consider HEVC (~40% smaller files) or AV1 (~50% smaller) if your audience's devices support them.`,
          },
        ]),
  ];
}
