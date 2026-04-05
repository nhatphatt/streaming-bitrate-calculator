import { BASE_BITRATES, CODECS } from "@/data/presets";

export interface CalcInput {
  /** Resolution slug: "720p", "1080p", "1440p", "4k", "8k" */
  resolution: string;
  /** Frames per second */
  fps: number;
  /** Codec ID: "h264", "hevc", "vp9", "av1", "prores422", "prores4444" */
  codec: string;
  /** Audio bitrate in Kbps */
  audioBitrateKbps: number;
  /** Duration in seconds */
  durationSeconds: number;
}

export interface CalcResult {
  /** Estimated video bitrate in Kbps */
  videoBitrateKbps: number;
  /** Total bitrate (video + audio) in Kbps */
  totalBitrateKbps: number;
  /** Total bitrate in Mbps */
  totalBitrateMbps: number;
  /** File size in bytes */
  fileSizeBytes: number;
  /** File size in MB */
  fileSizeMB: number;
  /** File size in GB */
  fileSizeGB: number;
  /** File size in TB */
  fileSizeTB: number;
  /** Human-readable file size string */
  fileSizeFormatted: string;
  /** Recommended upload bandwidth in Mbps (1.5× total bitrate) */
  recommendedBandwidthMbps: number;
}

/**
 * Calculate estimated video bitrate based on resolution, fps, and codec.
 *
 * Formula:
 *   videoBitrate = baseBitrate(resolution) × (fps / 30) × codecEfficiency
 *
 * - baseBitrate: industry-standard H.264 bitrate at 30fps for each resolution
 * - fps scaling: linear ratio vs 30fps baseline
 * - codecEfficiency: multiplier from CODECS preset (H.264=1.0, HEVC=0.6, etc.)
 */
export function calculateVideoBitrateKbps(
  resolution: string,
  fps: number,
  codecId: string
): number {
  const baseBitrate = BASE_BITRATES[resolution] ?? 8000;
  const codec = CODECS.find((c) => c.id === codecId);
  const efficiencyFactor = codec?.efficiencyFactor ?? 1.0;

  // FPS scaling: linear interpolation from 30fps baseline
  const fpsMultiplier = fps / 30;

  return baseBitrate * fpsMultiplier * efficiencyFactor;
}

/**
 * Calculate file size from total bitrate and duration.
 *
 * Formula:
 *   fileSizeBytes = (totalBitrateKbps × 1000 / 8) × durationSeconds
 *
 * - Kbps → bps: ×1000
 * - bps → Bytes/s: ÷8
 * - Bytes/s × seconds = total bytes
 */
export function calculateFileSizeBytes(
  totalBitrateKbps: number,
  durationSeconds: number
): number {
  return (totalBitrateKbps * 1000 * durationSeconds) / 8;
}

/**
 * Format bytes into a human-readable string.
 */
export function formatFileSize(bytes: number): string {
  const TB = 1024 ** 4;
  const GB = 1024 ** 3;
  const MB = 1024 ** 2;

  if (bytes >= TB) {
    return `${(bytes / TB).toFixed(2)} TB`;
  }
  if (bytes >= GB) {
    return `${(bytes / GB).toFixed(2)} GB`;
  }
  return `${(bytes / MB).toFixed(2)} MB`;
}

/**
 * Main calculation function — takes all inputs, returns complete result.
 */
export function calculate(input: CalcInput): CalcResult {
  const videoBitrateKbps = calculateVideoBitrateKbps(
    input.resolution,
    input.fps,
    input.codec
  );

  const totalBitrateKbps = videoBitrateKbps + input.audioBitrateKbps;
  const totalBitrateMbps = totalBitrateKbps / 1000;

  const fileSizeBytes = calculateFileSizeBytes(
    totalBitrateKbps,
    input.durationSeconds
  );

  const fileSizeMB = fileSizeBytes / 1024 ** 2;
  const fileSizeGB = fileSizeBytes / 1024 ** 3;
  const fileSizeTB = fileSizeBytes / 1024 ** 4;

  // Recommend 1.5× headroom for upload bandwidth
  const recommendedBandwidthMbps =
    Math.ceil((totalBitrateMbps * 1.5) * 10) / 10;

  return {
    videoBitrateKbps: Math.round(videoBitrateKbps),
    totalBitrateKbps: Math.round(totalBitrateKbps),
    totalBitrateMbps: Math.round(totalBitrateMbps * 100) / 100,
    fileSizeBytes: Math.round(fileSizeBytes),
    fileSizeMB: Math.round(fileSizeMB * 100) / 100,
    fileSizeGB: Math.round(fileSizeGB * 100) / 100,
    fileSizeTB: Math.round(fileSizeTB * 100) / 100,
    fileSizeFormatted: formatFileSize(fileSizeBytes),
    recommendedBandwidthMbps,
  };
}

/**
 * Convert hours, minutes, seconds to total seconds.
 */
export function toDurationSeconds(
  hours: number,
  minutes: number,
  seconds: number
): number {
  return hours * 3600 + minutes * 60 + seconds;
}
