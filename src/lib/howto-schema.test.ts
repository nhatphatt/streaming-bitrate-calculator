import { describe, it, expect } from "vitest";
import {
  extractHowToSteps,
  buildHowToSchema,
  isHowToBlogSlug,
} from "./howto-schema";

describe("isHowToBlogSlug", () => {
  it("matches how-to- prefix", () => {
    expect(isHowToBlogSlug("how-to-stream-on-twitch")).toBe(true);
    expect(isHowToBlogSlug("how-to-multistream")).toBe(true);
  });

  it("matches best-obs-settings- prefix (game tutorials)", () => {
    expect(isHowToBlogSlug("best-obs-settings-fortnite")).toBe(true);
    expect(isHowToBlogSlug("best-obs-settings-helldivers-2")).toBe(true);
    expect(isHowToBlogSlug("best-obs-settings-roblox")).toBe(true);
  });

  it("matches explicit allowlist", () => {
    expect(isHowToBlogSlug("best-obs-bitrate-settings")).toBe(true);
    expect(isHowToBlogSlug("nvenc-vs-x264-streaming")).toBe(true);
  });

  it("rejects non-tutorial posts", () => {
    expect(isHowToBlogSlug("h264-vs-h265-vs-av1")).toBe(false);
    expect(isHowToBlogSlug("youtube-streaming-bitrate-guide")).toBe(false);
    expect(isHowToBlogSlug("mp4-vs-mkv-vs-mov")).toBe(false);
  });
});

describe("extractHowToSteps", () => {
  const sampleMd = `Intro paragraph that should be ignored because it has no heading above it. This goes on for a bit so it has enough text to be content but it should never appear as a step.

## First Step Heading
This is the body of the first step. It contains useful instructions for the reader. The text should be long enough to pass the minimum length filter we apply during extraction.

### Subheading should not split steps
More content under the same H2. This text gets concatenated into the first step body since the H3 stays inside it.

\`\`\`bash
some code that should be skipped
\`\`\`

| col1 | col2 |
|------|------|
| a | b |

## Second Step Heading
The second step body has its own paragraph. It also has enough text to pass the length filter and become a real step in the schema.

## Tiny

Too short.

## Third Step Heading
A third step with a [markdown link](https://example.com) and **bold text** and *italic text* that should all be stripped from the schema output to keep it clean.
`;

  it("extracts H2 sections as steps", () => {
    const steps = extractHowToSteps(sampleMd);
    expect(steps.length).toBe(3);
    expect(steps[0].name).toBe("First Step Heading");
    expect(steps[1].name).toBe("Second Step Heading");
    expect(steps[2].name).toBe("Third Step Heading");
  });

  it("strips markdown emphasis and links from step text", () => {
    const steps = extractHowToSteps(sampleMd);
    const third = steps[2].text;
    expect(third).not.toContain("**");
    expect(third).not.toContain("*italic*");
    expect(third).not.toMatch(/\[.+\]\(.+\)/);
    expect(third).toContain("markdown link");
    expect(third).toContain("bold text");
  });

  it("filters out steps with text shorter than 60 chars", () => {
    const steps = extractHowToSteps(sampleMd);
    expect(steps.find((s) => s.name === "Tiny")).toBeUndefined();
  });

  it("respects maxSteps cap", () => {
    const md = Array.from({ length: 12 }, (_, i) => `## Heading ${i + 1}\nThis is body text for heading ${i + 1} that exceeds the minimum length filter so it is kept.`).join("\n\n");
    const steps = extractHowToSteps(md, 5);
    expect(steps.length).toBe(5);
  });

  it("truncates very long step text with ellipsis", () => {
    const longBody = "x".repeat(500);
    const md = `## Long\n${longBody}`;
    const steps = extractHowToSteps(md);
    expect(steps[0].text.length).toBeLessThanOrEqual(320);
    expect(steps[0].text).toMatch(/\.\.\.$/);
  });

  it("returns empty array when there are no H2 headings", () => {
    expect(extractHowToSteps("Just a paragraph with no headings at all in the content.")).toEqual([]);
  });
});

describe("buildHowToSchema", () => {
  it("produces valid HowTo JSON-LD", () => {
    const schema = buildHowToSchema({
      slug: "best-obs-settings-fortnite",
      title: "Best OBS Settings for Fortnite",
      description: "How to configure OBS for streaming Fortnite.",
      totalTimeMinutes: 12,
      steps: [
        { name: "Set bitrate", text: "Configure your bitrate to 6000 Kbps for Twitch." },
        { name: "Pick encoder", text: "Use NVENC if you have an NVIDIA GPU." },
      ],
    });

    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("HowTo");
    expect(schema.name).toBe("Best OBS Settings for Fortnite");
    expect(schema.totalTime).toBe("PT12M");
    expect(schema.step).toHaveLength(2);
    expect(schema.step[0]).toMatchObject({
      "@type": "HowToStep",
      position: 1,
      name: "Set bitrate",
    });
    expect(schema.step[0].url).toContain("/blog/best-obs-settings-fortnite/#step-1");
  });

  it("defaults totalTime when not provided", () => {
    const schema = buildHowToSchema({
      slug: "x",
      title: "T",
      description: "D",
      steps: [{ name: "n", text: "t" }],
    });
    expect(schema.totalTime).toBe("PT15M");
  });
});
