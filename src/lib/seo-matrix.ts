/**
 * SEO Matrix Builder
 *
 * Generates all realistic resolution + fps + codec slug combinations
 * for programmatic SEO pages. Filters out impractical combos.
 */

const RESOLUTIONS = ["720p", "1080p", "1440p", "4k", "8k"] as const;
const FPS_VALUES = [24, 30, 60, 120] as const;
const CODECS = ["h264", "hevc", "av1", "prores"] as const;

export type Resolution = (typeof RESOLUTIONS)[number];
export type Fps = (typeof FPS_VALUES)[number];
export type Codec = (typeof CODECS)[number];

export interface MatrixEntry {
  slug: string;
  resolution: Resolution;
  fps: Fps;
  codec: Codec;
}

/**
 * Rules to exclude impractical combos:
 *
 * 1. 8K + 120fps — virtually no real hardware supports this
 * 2. ProRes + 720p — nobody uses ProRes for 720p, it's a pro codec
 * 3. 8K + ProRes — extreme niche, not searchable
 * 4. AV1 + 120fps — real-time AV1 encoding at 120fps barely exists
 */
function isRealisticCombo(
  res: Resolution,
  fps: Fps,
  codec: Codec
): boolean {
  // 8K + 120fps: no consumer or pro hardware supports this
  if (res === "8k" && fps === 120) return false;

  // ProRes at 720p: no professional uses ProRes for SD/HD
  if (codec === "prores" && res === "720p") return false;

  // 8K + ProRes: extremely niche, no meaningful search volume
  if (res === "8k" && codec === "prores") return false;

  // AV1 + 120fps: real-time AV1 at 120fps is not practical yet
  if (codec === "av1" && fps === 120) return false;

  return true;
}

/**
 * Generate all valid matrix entries.
 * Returns ~70-85 realistic slug combinations.
 *
 * Slug format: "{resolution}-{fps}fps-{codec}"
 * Example: "4k-60fps-hevc", "1080p-30fps-h264"
 */
export function generateSeoMatrix(): MatrixEntry[] {
  const entries: MatrixEntry[] = [];

  for (const resolution of RESOLUTIONS) {
    for (const fps of FPS_VALUES) {
      for (const codec of CODECS) {
        if (!isRealisticCombo(resolution, fps, codec)) continue;

        entries.push({
          slug: `${resolution}-${fps}fps-${codec}`,
          resolution,
          fps,
          codec,
        });
      }
    }
  }

  return entries;
}

/**
 * Parse a 3-part slug back into components.
 * Handles both new format "4k-60fps-hevc" and legacy "4k-60fps"
 */
export function parseMatrixSlug(
  slug: string
): { resolution: Resolution; fps: Fps; codec: Codec | null } | null {
  const parts = slug.split("-");

  // New 3-part format: "4k-60fps-hevc"
  if (parts.length === 3) {
    const resolution = parts[0] as Resolution;
    const fpsStr = parts[1].replace("fps", "");
    const fps = parseInt(fpsStr, 10) as Fps;
    const codec = parts[2] as Codec;

    if (!RESOLUTIONS.includes(resolution)) return null;
    if (!FPS_VALUES.includes(fps)) return null;
    if (!CODECS.includes(codec)) return null;

    return { resolution, fps, codec };
  }

  // Legacy 2-part format: "4k-60fps" (backward compat)
  if (parts.length === 2) {
    const resolution = parts[0] as Resolution;
    const fpsStr = parts[1].replace("fps", "");
    const fps = parseInt(fpsStr, 10) as Fps;

    if (!RESOLUTIONS.includes(resolution)) return null;
    if (!FPS_VALUES.includes(fps)) return null;

    return { resolution, fps, codec: null };
  }

  return null;
}

/**
 * Get all slugs (string array) for generateStaticParams.
 */
export function getAllMatrixSlugs(): string[] {
  return generateSeoMatrix().map((e) => e.slug);
}

/**
 * Get legacy 2-part slugs (resolution-fps only) for backward compat.
 */
export function getLegacySlugs(): string[] {
  const set = new Set<string>();
  for (const res of RESOLUTIONS) {
    for (const fps of FPS_VALUES) {
      set.add(`${res}-${fps}fps`);
    }
  }
  return Array.from(set);
}

/**
 * Combined: all slugs for SSG (legacy + matrix).
 */
export function getAllSlugs(): string[] {
  return [...getLegacySlugs(), ...getAllMatrixSlugs()];
}

/**
 * Map matrix codec id to presets codec id (for calculate()).
 * "prores" in matrix → "prores422" in presets (most common ProRes variant).
 */
export const CODEC_TO_PRESET: Record<Codec, string> = {
  h264: "h264",
  hevc: "hevc",
  av1: "av1",
  prores: "prores422",
};

export const CODEC_LABELS: Record<Codec, string> = {
  h264: "H.264 (AVC)",
  hevc: "H.265 (HEVC)",
  av1: "AV1",
  prores: "Apple ProRes",
};
