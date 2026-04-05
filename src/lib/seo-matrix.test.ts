import { describe, it, expect } from "vitest";
import {
  generateSeoMatrix,
  parseMatrixSlug,
  getAllMatrixSlugs,
  getLegacySlugs,
  getAllSlugs,
} from "@/lib/seo-matrix";

describe("generateSeoMatrix", () => {
  const matrix = generateSeoMatrix();

  it("generates a non-empty array", () => {
    expect(matrix.length).toBeGreaterThan(0);
  });

  it("generates entries with valid structure", () => {
    for (const entry of matrix) {
      expect(entry).toHaveProperty("slug");
      expect(entry).toHaveProperty("resolution");
      expect(entry).toHaveProperty("fps");
      expect(entry).toHaveProperty("codec");
      expect(typeof entry.slug).toBe("string");
    }
  });

  it("excludes 8K 120fps combos", () => {
    const bad = matrix.filter(
      (e) => e.resolution === "8k" && e.fps === 120
    );
    expect(bad.length).toBe(0);
  });

  it("excludes ProRes 720p combos", () => {
    const bad = matrix.filter(
      (e) => e.resolution === "720p" && e.codec === "prores"
    );
    expect(bad.length).toBe(0);
  });

  it("excludes 8K ProRes combos", () => {
    const bad = matrix.filter(
      (e) => e.resolution === "8k" && e.codec === "prores"
    );
    expect(bad.length).toBe(0);
  });

  it("excludes AV1 120fps combos", () => {
    const bad = matrix.filter(
      (e) => e.codec === "av1" && e.fps === 120
    );
    expect(bad.length).toBe(0);
  });

  it("includes expected common combos", () => {
    const slugs = matrix.map((e) => e.slug);
    expect(slugs).toContain("1080p-30fps-h264");
    expect(slugs).toContain("4k-60fps-hevc");
    expect(slugs).toContain("1080p-60fps-av1");
  });
});

describe("parseMatrixSlug", () => {
  it("parses 3-part slug correctly", () => {
    const result = parseMatrixSlug("4k-60fps-hevc");
    expect(result).toEqual({
      resolution: "4k",
      fps: 60,
      codec: "hevc",
    });
  });

  it("parses legacy 2-part slug correctly", () => {
    const result = parseMatrixSlug("1080p-30fps");
    expect(result).toEqual({
      resolution: "1080p",
      fps: 30,
      codec: null,
    });
  });

  it("returns null for invalid resolution", () => {
    expect(parseMatrixSlug("999p-30fps-h264")).toBeNull();
  });

  it("returns null for invalid fps", () => {
    expect(parseMatrixSlug("1080p-45fps-h264")).toBeNull();
  });

  it("returns null for invalid codec", () => {
    expect(parseMatrixSlug("1080p-30fps-fake")).toBeNull();
  });

  it("returns null for malformed slug", () => {
    expect(parseMatrixSlug("")).toBeNull();
    expect(parseMatrixSlug("single")).toBeNull();
    expect(parseMatrixSlug("a-b-c-d")).toBeNull();
  });
});

describe("getAllMatrixSlugs", () => {
  it("returns array of strings", () => {
    const slugs = getAllMatrixSlugs();
    expect(Array.isArray(slugs)).toBe(true);
    expect(slugs.length).toBeGreaterThan(0);
    expect(typeof slugs[0]).toBe("string");
  });
});

describe("getLegacySlugs", () => {
  it("returns 20 legacy slugs (5 resolutions × 4 fps)", () => {
    const slugs = getLegacySlugs();
    expect(slugs.length).toBe(20);
  });

  it("contains expected legacy slugs", () => {
    const slugs = getLegacySlugs();
    expect(slugs).toContain("1080p-30fps");
    expect(slugs).toContain("4k-60fps");
    expect(slugs).toContain("720p-24fps");
  });
});

describe("getAllSlugs", () => {
  it("combines legacy and matrix slugs without duplicates in each category", () => {
    const all = getAllSlugs();
    const legacy = getLegacySlugs();
    const matrix = getAllMatrixSlugs();
    expect(all.length).toBe(legacy.length + matrix.length);
  });
});
