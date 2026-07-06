/**
 * Upload-time programmatic SEO data.
 *
 * Generates `/upload/[slug]/` pages like "5gb-on-50mbps".
 * Targets "how long to upload X GB" keywords.
 */

export interface UploadCombo {
  slug: string;
  sizeMB: number;
  sizeLabel: string;       // "5 GB"
  speedMbps: number;
  speedLabel: string;      // "50 Mbps"
}

const FILE_SIZES: { mb: number; label: string; slug: string }[] = [
  { mb: 500,      label: "500 MB",  slug: "500mb" },
  { mb: 1024,     label: "1 GB",    slug: "1gb" },
  { mb: 2048,     label: "2 GB",    slug: "2gb" },
  { mb: 5120,     label: "5 GB",    slug: "5gb" },
  { mb: 10240,    label: "10 GB",   slug: "10gb" },
  { mb: 25600,    label: "25 GB",   slug: "25gb" },
  { mb: 51200,    label: "50 GB",   slug: "50gb" },
  { mb: 102400,   label: "100 GB",  slug: "100gb" },
  { mb: 512000,   label: "500 GB",  slug: "500gb" },
  { mb: 1048576,  label: "1 TB",    slug: "1tb" },
];

const SPEEDS: { mbps: number; label: string; slug: string }[] = [
  { mbps: 5,    label: "5 Mbps",    slug: "5mbps" },
  { mbps: 10,   label: "10 Mbps",   slug: "10mbps" },
  { mbps: 25,   label: "25 Mbps",   slug: "25mbps" },
  { mbps: 50,   label: "50 Mbps",   slug: "50mbps" },
  { mbps: 100,  label: "100 Mbps",  slug: "100mbps" },
  { mbps: 200,  label: "200 Mbps",  slug: "200mbps" },
  { mbps: 500,  label: "500 Mbps",  slug: "500mbps" },
  { mbps: 1000, label: "1 Gbps",    slug: "1gbps" },
];

/**
 * Filter impractical combos:
 * - Skip combos where upload takes > 7 days theoretical (pointless search-wise)
 * - Skip tiny file + massive speed combos (sub-second, no search intent)
 */
function isRealistic(sizeMB: number, speedMbps: number): boolean {
  const seconds = (sizeMB * 8) / speedMbps; // MB → Mb → seconds
  if (seconds > 7 * 86400) return false; // > 7 days theoretical
  if (seconds < 2) return false;          // < 2 seconds (no search intent)
  return true;
}

let _allCombos: UploadCombo[] | null = null;

export function getAllUploadCombos(): UploadCombo[] {
  if (_allCombos) return _allCombos;
  const combos: UploadCombo[] = [];
  for (const size of FILE_SIZES) {
    for (const speed of SPEEDS) {
      if (!isRealistic(size.mb, speed.mbps)) continue;
      combos.push({
        slug: `${size.slug}-on-${speed.slug}`,
        sizeMB: size.mb,
        sizeLabel: size.label,
        speedMbps: speed.mbps,
        speedLabel: speed.label,
      });
    }
  }
  _allCombos = combos;
  return combos;
}

export function getAllUploadSlugs(): string[] {
  return getAllUploadCombos().map((c) => c.slug);
}

export function getUploadCombo(slug: string): UploadCombo | null {
  return getAllUploadCombos().find((c) => c.slug === slug) ?? null;
}

/**
 * Calculate upload time in seconds.
 * sizeMB is in megabytes, speedMbps is megabits per second.
 */
export function calcUploadSeconds(sizeMB: number, speedMbps: number): number {
  return (sizeMB * 8) / speedMbps;
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  const parts: string[] = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (s > 0 && d === 0) parts.push(`${s}s`); // skip seconds for multi-day
  return parts.join(" ") || "0s";
}

/** With 80% real-world efficiency */
export function formatRealDuration(seconds: number): string {
  return formatDuration(seconds / 0.8);
}

/** All file sizes for cross-comparison on a speed page */
export { FILE_SIZES, SPEEDS };

// ---------------------------------------------------------------------------
// Context helpers — give every /upload/[slug]/ page genuinely different prose
// (not just swapped numbers) so search engines don't treat them as duplicates.
// All outputs are a deterministic function of the size/speed, so a given page
// always renders the same text.
// ---------------------------------------------------------------------------

interface SpeedTier {
  name: string;
  blurb: string;
}

function getSpeedTier(mbps: number): SpeedTier {
  if (mbps < 10)
    return {
      name: "entry-level broadband",
      blurb:
        "This sits at the slower end of today's connections — common on older DSL lines, rural links, or throttled mobile hotspots. Uploads are the bottleneck here, so plan large transfers for when you're not using the connection for anything else.",
    };
  if (mbps < 50)
    return {
      name: "standard home broadband",
      blurb:
        "This is a typical cable or entry fiber plan that most households run. It handles day-to-day uploads comfortably, though very large files still take real time.",
    };
  if (mbps < 200)
    return {
      name: "fast fiber / cable",
      blurb:
        "This is a fast, upload-friendly connection — great for creators who regularly push 4K footage or large project files to the cloud without waiting around.",
    };
  return {
    name: "gigabit-class fiber",
    blurb:
      "This is a top-tier symmetrical fiber connection. Upload time is rarely a concern at this speed; your storage drive or the receiving server is usually the real limit.",
  };
}

interface SizeContext {
  examples: string;
  useCase: string;
}

function getSizeContext(mb: number): SizeContext {
  if (mb <= 1024)
    return {
      examples:
        "a short HD video clip, a batch of RAW photos, or a small app installer",
      useCase: "sharing on Discord, emailing a client, or a quick cloud sync",
    };
  if (mb <= 10240)
    return {
      examples:
        "a full-length HD movie, a folder of 4K clips, or a mid-size game update",
      useCase: "uploading to YouTube or backing up to Google Drive / Dropbox",
    };
  if (mb <= 102400)
    return {
      examples:
        "a finished 4K video project, a AAA game install, or an entire photo library",
      useCase:
        "cloud backup to Backblaze or handing off project files to an editor",
    };
  return {
    examples:
      "a full system backup, an archive of raw footage, or a large media-server library",
    useCase: "offsite backup or migrating an entire media collection",
  };
}

/** A practical, duration-aware tip that differs across pages. */
function getDurationTip(seconds: number): string {
  const realSeconds = seconds / 0.8;
  if (realSeconds < 60)
    return "This finishes almost instantly, so you can fire it off mid-task without a second thought.";
  if (realSeconds < 15 * 60)
    return "This is quick enough to wait out with a coffee — just avoid starting a second big upload at the same time, since they'll share your bandwidth.";
  if (realSeconds < 2 * 3600)
    return "For a transfer this long, a wired Ethernet connection instead of Wi-Fi will keep the speed steady and prevent stalls that restart chunks.";
  if (realSeconds < 12 * 3600)
    return "Uploads this size are best kicked off in the evening and left to run — pause other heavy network use so it doesn't get starved of bandwidth.";
  return "A transfer this large realistically runs overnight (or across days). Consider splitting it into batches, or use a service with resumable uploads so a dropped connection doesn't force you to start over.";
}

export interface UploadInsight {
  speedTierName: string;
  speedBlurb: string;
  sizeExamples: string;
  useCase: string;
  durationTip: string;
  /** Minimum real-world Mbps needed to finish this file in under an hour. */
  mbpsForOneHour: number;
}

export function getUploadInsight(combo: UploadCombo): UploadInsight {
  const secs = calcUploadSeconds(combo.sizeMB, combo.speedMbps);
  const tier = getSpeedTier(combo.speedMbps);
  const size = getSizeContext(combo.sizeMB);
  return {
    speedTierName: tier.name,
    speedBlurb: tier.blurb,
    sizeExamples: size.examples,
    useCase: size.useCase,
    durationTip: getDurationTip(secs),
    mbpsForOneHour: Math.max(0.1, (combo.sizeMB * 8) / 3600 / 0.8),
  };
}
