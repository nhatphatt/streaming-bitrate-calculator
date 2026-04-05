export interface ResolutionPreset {
  label: string;
  width: number;
  height: number;
  slug: string;
}

export interface FpsPreset {
  label: string;
  value: number;
  slug: string;
}

export const RESOLUTIONS: ResolutionPreset[] = [
  { label: "720p (HD)", width: 1280, height: 720, slug: "720p" },
  { label: "1080p (Full HD)", width: 1920, height: 1080, slug: "1080p" },
  { label: "1440p (2K)", width: 2560, height: 1440, slug: "1440p" },
  { label: "4K (2160p)", width: 3840, height: 2160, slug: "4k" },
  { label: "8K (4320p)", width: 7680, height: 4320, slug: "8k" },
];

export const FPS_OPTIONS: FpsPreset[] = [
  { label: "24 fps", value: 24, slug: "24fps" },
  { label: "30 fps", value: 30, slug: "30fps" },
  { label: "60 fps", value: 60, slug: "60fps" },
  { label: "120 fps", value: 120, slug: "120fps" },
];

export interface CodecPreset {
  label: string;
  id: string;
  /** Efficiency multiplier relative to raw. Lower = more efficient */
  efficiencyFactor: number;
}

export const CODECS: CodecPreset[] = [
  { label: "H.264 (AVC)", id: "h264", efficiencyFactor: 1.0 },
  { label: "H.265 (HEVC)", id: "hevc", efficiencyFactor: 0.6 },
  { label: "VP9", id: "vp9", efficiencyFactor: 0.6 },
  { label: "AV1", id: "av1", efficiencyFactor: 0.5 },
  { label: "ProRes 422", id: "prores422", efficiencyFactor: 3.5 },
  { label: "ProRes 4444", id: "prores4444", efficiencyFactor: 5.0 },
];

/**
 * Recommended base bitrates in Kbps for H.264 at 30fps.
 * Keyed by resolution slug.
 */
export const BASE_BITRATES: Record<string, number> = {
  "720p": 5000,
  "1080p": 8000,
  "1440p": 16000,
  "4k": 35000,
  "8k": 80000,
};

export const AUDIO_BITRATE_OPTIONS = [
  { label: "96 Kbps (Low)", value: 96 },
  { label: "128 Kbps (Standard)", value: 128 },
  { label: "192 Kbps (High)", value: 192 },
  { label: "256 Kbps (Very High)", value: 256 },
  { label: "320 Kbps (Lossless-like)", value: 320 },
];

/**
 * Generate all valid slug combos for programmatic SEO pages.
 * e.g. "4k-60fps", "1080p-30fps"
 */
export function generateAllSlugs(): string[] {
  const slugs: string[] = [];
  for (const res of RESOLUTIONS) {
    for (const fps of FPS_OPTIONS) {
      slugs.push(`${res.slug}-${fps.slug}`);
    }
  }
  return slugs;
}
