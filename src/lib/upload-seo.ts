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
