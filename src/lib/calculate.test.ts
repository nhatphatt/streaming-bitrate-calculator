import { describe, it, expect } from "vitest";
import {
  calculate,
  calculateVideoBitrateKbps,
  calculateFileSizeBytes,
  formatFileSize,
  toDurationSeconds,
} from "@/lib/calculate";

// ============================================================
// toDurationSeconds
// ============================================================
describe("toDurationSeconds", () => {
  it("converts 1h 0m 0s to 3600", () => {
    expect(toDurationSeconds(1, 0, 0)).toBe(3600);
  });

  it("converts 0h 30m 15s to 1815", () => {
    expect(toDurationSeconds(0, 30, 15)).toBe(1815);
  });

  it("converts 0h 0m 0s to 0", () => {
    expect(toDurationSeconds(0, 0, 0)).toBe(0);
  });

  it("converts 2h 15m 30s correctly", () => {
    expect(toDurationSeconds(2, 15, 30)).toBe(2 * 3600 + 15 * 60 + 30);
  });
});

// ============================================================
// calculateVideoBitrateKbps
// ============================================================
describe("calculateVideoBitrateKbps", () => {
  it("returns correct baseline for 1080p 30fps H.264", () => {
    // baseBitrate=8000, fps_mul=30/30=1.0, factor=1.0
    const result = calculateVideoBitrateKbps("1080p", 30, "h264");
    expect(result).toBe(8000);
  });

  it("scales linearly with fps for 1080p 60fps H.264", () => {
    // baseBitrate=8000, fps_mul=60/30=2.0, factor=1.0
    const result = calculateVideoBitrateKbps("1080p", 60, "h264");
    expect(result).toBe(16000);
  });

  it("applies HEVC efficiency factor correctly for 4K 60fps", () => {
    // baseBitrate=35000, fps_mul=60/30=2.0, factor=0.6
    const result = calculateVideoBitrateKbps("4k", 60, "hevc");
    expect(result).toBe(35000 * 2.0 * 0.6);
  });

  it("applies AV1 efficiency factor correctly", () => {
    // baseBitrate=8000, fps_mul=1.0, factor=0.5
    const result = calculateVideoBitrateKbps("1080p", 30, "av1");
    expect(result).toBe(4000);
  });

  it("handles ProRes 422 (large factor)", () => {
    // baseBitrate=8000, fps_mul=1.0, factor=3.5
    const result = calculateVideoBitrateKbps("1080p", 30, "prores422");
    expect(result).toBe(28000);
  });

  it("handles ProRes 4444 (largest factor)", () => {
    // baseBitrate=8000, fps_mul=1.0, factor=5.0
    const result = calculateVideoBitrateKbps("1080p", 30, "prores4444");
    expect(result).toBe(40000);
  });

  it("falls back to 8000 for unknown resolution", () => {
    const result = calculateVideoBitrateKbps("unknown", 30, "h264");
    expect(result).toBe(8000);
  });

  it("falls back to factor 1.0 for unknown codec", () => {
    // baseBitrate=8000, fps_mul=1.0, unknown_factor=1.0
    const result = calculateVideoBitrateKbps("1080p", 30, "fake_codec");
    expect(result).toBe(8000);
  });

  it("returns 0 when fps is 0", () => {
    const result = calculateVideoBitrateKbps("1080p", 0, "h264");
    expect(result).toBe(0);
  });

  it("scales correctly for 24fps", () => {
    // baseBitrate=8000, fps_mul=24/30=0.8
    const result = calculateVideoBitrateKbps("1080p", 24, "h264");
    expect(result).toBeCloseTo(6400, 0);
  });

  it("handles 8K resolution", () => {
    // baseBitrate=80000, fps_mul=1.0, factor=1.0
    const result = calculateVideoBitrateKbps("8k", 30, "h264");
    expect(result).toBe(80000);
  });

  it("handles 720p resolution", () => {
    const result = calculateVideoBitrateKbps("720p", 30, "h264");
    expect(result).toBe(5000);
  });

  it("handles 120fps scaling", () => {
    // baseBitrate=8000, fps_mul=120/30=4.0, factor=1.0
    const result = calculateVideoBitrateKbps("1080p", 120, "h264");
    expect(result).toBe(32000);
  });
});

// ============================================================
// calculateFileSizeBytes
// ============================================================
describe("calculateFileSizeBytes", () => {
  it("calculates correctly for known values", () => {
    // 8000 Kbps for 3600 seconds
    // = (8000 * 1000 / 8) * 3600 = 1000000 * 3600 = 3,600,000,000 bytes
    const result = calculateFileSizeBytes(8000, 3600);
    expect(result).toBe(3_600_000_000);
  });

  it("returns 0 for 0 duration", () => {
    expect(calculateFileSizeBytes(8000, 0)).toBe(0);
  });

  it("returns 0 for 0 bitrate", () => {
    expect(calculateFileSizeBytes(0, 3600)).toBe(0);
  });

  it("handles very short durations", () => {
    // 6000 Kbps for 1 second = 750,000 bytes
    const result = calculateFileSizeBytes(6000, 1);
    expect(result).toBe(750_000);
  });
});

// ============================================================
// formatFileSize
// ============================================================
describe("formatFileSize", () => {
  it("formats bytes to MB", () => {
    const mb = 50 * 1024 * 1024; // 50 MB
    expect(formatFileSize(mb)).toBe("50.00 MB");
  });

  it("formats bytes to GB", () => {
    const gb = 2.5 * 1024 ** 3;
    expect(formatFileSize(gb)).toBe("2.50 GB");
  });

  it("formats bytes to TB", () => {
    const tb = 1.5 * 1024 ** 4;
    expect(formatFileSize(tb)).toBe("1.50 TB");
  });

  it("formats small value as MB", () => {
    const smallMB = 0.5 * 1024 * 1024;
    expect(formatFileSize(smallMB)).toBe("0.50 MB");
  });

  it("formats exactly 1 GB", () => {
    const oneGB = 1024 ** 3;
    expect(formatFileSize(oneGB)).toBe("1.00 GB");
  });

  it("formats exactly 1 TB", () => {
    const oneTB = 1024 ** 4;
    expect(formatFileSize(oneTB)).toBe("1.00 TB");
  });
});

// ============================================================
// calculate (integration)
// ============================================================
describe("calculate (full integration)", () => {
  it("returns all fields for 1080p 30fps H.264 1hr", () => {
    const result = calculate({
      resolution: "1080p",
      fps: 30,
      codec: "h264",
      audioBitrateKbps: 128,
      durationSeconds: 3600,
    });

    expect(result.videoBitrateKbps).toBe(8000);
    expect(result.totalBitrateKbps).toBe(8128);
    expect(result.totalBitrateMbps).toBeCloseTo(8.13, 1);
    expect(result.fileSizeBytes).toBeGreaterThan(0);
    expect(result.fileSizeMB).toBeGreaterThan(0);
    expect(result.fileSizeGB).toBeGreaterThan(0);
    expect(result.fileSizeFormatted).toMatch(/GB$/);
    expect(result.recommendedBandwidthMbps).toBeGreaterThan(result.totalBitrateMbps);
  });

  it("HEVC file size is ~60% of H.264", () => {
    const h264 = calculate({
      resolution: "1080p",
      fps: 30,
      codec: "h264",
      audioBitrateKbps: 128,
      durationSeconds: 3600,
    });
    const hevc = calculate({
      resolution: "1080p",
      fps: 30,
      codec: "hevc",
      audioBitrateKbps: 128,
      durationSeconds: 3600,
    });

    const ratio = hevc.fileSizeBytes / h264.fileSizeBytes;
    expect(ratio).toBeLessThan(0.7);
    expect(ratio).toBeGreaterThan(0.5);
  });

  it("AV1 file size is ~50% of H.264", () => {
    const h264 = calculate({
      resolution: "4k",
      fps: 60,
      codec: "h264",
      audioBitrateKbps: 128,
      durationSeconds: 600,
    });
    const av1 = calculate({
      resolution: "4k",
      fps: 60,
      codec: "av1",
      audioBitrateKbps: 128,
      durationSeconds: 600,
    });

    const ratio = av1.fileSizeBytes / h264.fileSizeBytes;
    expect(ratio).toBeLessThan(0.6);
    expect(ratio).toBeGreaterThan(0.4);
  });

  it("recommended bandwidth is 1.5× total bitrate", () => {
    const result = calculate({
      resolution: "1080p",
      fps: 30,
      codec: "h264",
      audioBitrateKbps: 128,
      durationSeconds: 60,
    });

    expect(result.recommendedBandwidthMbps).toBeGreaterThanOrEqual(
      result.totalBitrateMbps * 1.5
    );
  });

  it("handles extreme 8K 120fps ProRes 4444", () => {
    const result = calculate({
      resolution: "8k",
      fps: 120,
      codec: "prores4444",
      audioBitrateKbps: 320,
      durationSeconds: 3600,
    });

    expect(result.videoBitrateKbps).toBeGreaterThan(0);
    expect(result.fileSizeBytes).toBeGreaterThan(0);
    expect(result.fileSizeFormatted).toMatch(/(GB|TB)$/);
    // Should not be NaN or Infinity
    expect(Number.isFinite(result.fileSizeMB)).toBe(true);
    expect(Number.isFinite(result.fileSizeGB)).toBe(true);
    expect(Number.isFinite(result.fileSizeTB)).toBe(true);
  });

  it("handles 1s duration correctly", () => {
    const result = calculate({
      resolution: "720p",
      fps: 24,
      codec: "h264",
      audioBitrateKbps: 96,
      durationSeconds: 1,
    });

    expect(result.fileSizeBytes).toBeGreaterThan(0);
    expect(result.fileSizeMB).toBeGreaterThan(0);
  });
});
