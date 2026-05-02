/**
 * HowTo schema generator for blog tutorials.
 *
 * Extracts step-style structure from blog posts that follow a tutorial pattern.
 * Only emits HowTo JSON-LD for posts that match either:
 *   - slug starts with "how-to-"
 *   - slug starts with "best-obs-settings-" (game-specific tutorials)
 *   - explicitly listed in HOWTO_BLOG_SLUGS
 *
 * Steps are extracted from H2 headings in the markdown content.
 */

const SITE = "https://streamersize.com";

/**
 * Extra blog slugs that should emit HowTo schema even though their slug
 * doesn't start with "how-to-" or "best-obs-settings-".
 */
const HOWTO_BLOG_SLUGS = new Set<string>([
  "best-obs-bitrate-settings",
  "obs-bitrate-for-1080p-60fps",
  "obs-recording-settings-guide",
  "best-codec-for-live-streaming",
  "cbr-vs-vbr-for-streaming",
  "nvenc-vs-x264-streaming",
  "best-streaming-bitrate-by-resolution",
]);

export function isHowToBlogSlug(slug: string): boolean {
  if (slug.startsWith("how-to-")) return true;
  if (slug.startsWith("best-obs-settings-")) return true;
  return HOWTO_BLOG_SLUGS.has(slug);
}

/**
 * Extract H2 headings from markdown content as HowTo steps.
 * Returns up to `maxSteps` steps; skips the introductory or closing-only sections.
 */
export function extractHowToSteps(
  markdown: string,
  maxSteps = 8
): { name: string; text: string }[] {
  const lines = markdown.split(/\r?\n/);
  const steps: { name: string; text: string }[] = [];

  let currentHeading: string | null = null;
  let currentBuffer: string[] = [];

  const flush = () => {
    if (!currentHeading) return;
    const body = currentBuffer.join(" ").replace(/\s+/g, " ").trim();
    if (!body) return;
    // Limit step text length for clean schema output
    const text =
      body.length > 320
        ? body.slice(0, 317).replace(/\s+\S*$/, "") + "..."
        : body;
    steps.push({ name: currentHeading, text });
  };

  for (const rawLine of lines) {
    const line = rawLine.replace(/\r$/, "");
    const h2 = line.match(/^##\s+(.+?)\s*$/);
    if (h2) {
      flush();
      currentHeading = h2[1].trim();
      currentBuffer = [];
      continue;
    }
    if (currentHeading) {
      // skip subheadings, code fences, tables, image lines for step text
      if (/^(###|####|`{3}|\|)/.test(line)) continue;
      // Strip markdown emphasis/links for cleaner schema text
      const stripped = line
        .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/[*_`]/g, "");
      if (stripped.trim()) currentBuffer.push(stripped.trim());
    }
  }
  flush();

  // Filter out very short step texts (likely navigation rows) and cap to maxSteps
  return steps.filter((s) => s.text.length >= 60).slice(0, maxSteps);
}

export interface HowToSchemaInput {
  slug: string;
  title: string;
  description: string;
  totalTimeMinutes?: number;
  steps: { name: string; text: string }[];
}

export function buildHowToSchema(input: HowToSchemaInput) {
  const url = `${SITE}/blog/${input.slug}/`;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: input.title,
    description: input.description,
    image: `${SITE}/og-image.png`,
    totalTime: `PT${input.totalTimeMinutes ?? 15}M`,
    supply: [],
    tool: [
      { "@type": "HowToTool", name: "OBS Studio" },
      { "@type": "HowToTool", name: "Streaming Bitrate Calculator", url: SITE },
    ],
    step: input.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      url: `${url}#step-${i + 1}`,
    })),
  };
}
