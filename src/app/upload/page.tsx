import type { Metadata } from "next";
import Link from "next/link";
import {
  FILE_SIZES,
  SPEEDS,
  calcUploadSeconds,
  formatDuration,
  getAllUploadCombos,
} from "@/lib/upload-seo";

export const metadata: Metadata = {
  title: "Upload Time Table — How Long to Upload Any File Size",
  description:
    "Instant lookup: how long to upload 1 GB, 5 GB, 10 GB, 50 GB, or 1 TB at any internet speed. Full cross-reference table for every file size and upload speed.",
  alternates: { canonical: "/upload/" },
  openGraph: {
    title: "Upload Time Table — How Long to Upload Any File Size",
    description: "Full cross-reference table for every file size and upload speed.",
    type: "website",
    url: "/upload/",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Upload Time Table — StreamerSize" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Upload Time Table — All File Sizes × All Speeds",
    description: "Full cross-reference table for every file size and upload speed.",
    images: ["/og-image.png"],
  },
};

export default function UploadIndexPage() {
  const allCombos = getAllUploadCombos();
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://streamersize.com/" },
              { "@type": "ListItem", position: 2, name: "Upload Time Table", item: "https://streamersize.com/upload/" },
            ],
          }),
        }}
      />

      <div className="flex flex-col gap-12">
        <section>
          <nav aria-label="Breadcrumb" className="text-sm text-[var(--muted-foreground)] mb-4">
            <ol className="flex items-center gap-1.5">
              <li><Link href="/" className="hover:text-[var(--primary)] transition-colors">Home</Link></li>
              <li>/</li>
              <li className="text-[var(--foreground)] font-medium">Upload Time Table</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Upload Time Table — All File Sizes &amp; Speeds
          </h1>
          <p className="text-[var(--muted-foreground)] text-lg max-w-2xl">
            Find how long any file takes to upload at any internet speed. Click a cell
            for a detailed breakdown with real-world estimates.
          </p>
          <p className="text-sm text-[var(--muted-foreground)] mt-2">
            <strong>{allCombos.length}</strong> combinations covered.{" "}
            Need custom values?{" "}
            <Link href="/tools/upload-time-calculator/" className="text-[var(--primary)] underline underline-offset-2">
              Use the interactive calculator →
            </Link>
          </p>
        </section>

        {/* Master cross-reference table */}
        <section>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b-2 border-[var(--border)] text-left">
                  <th className="pb-3 pr-3 font-semibold sticky left-0 bg-[var(--background)] z-10">
                    File size ↓ / Speed →
                  </th>
                  {SPEEDS.map((s) => (
                    <th key={s.slug} className="pb-3 px-2 font-semibold text-center whitespace-nowrap">
                      {s.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FILE_SIZES.map((f) => (
                  <tr
                    key={f.slug}
                    className="border-b border-[var(--border)] last:border-0"
                  >
                    <td className="py-3 pr-3 font-medium sticky left-0 bg-[var(--background)] z-10 whitespace-nowrap">
                      {f.label}
                    </td>
                    {SPEEDS.map((s) => {
                      const secs = calcUploadSeconds(f.mb, s.mbps);
                      const valid = secs >= 2 && secs <= 7 * 86400;
                      const comboSlug = `${f.slug}-on-${s.slug}`;
                      return (
                        <td key={s.slug} className="py-3 px-2 text-center">
                          {valid ? (
                            <Link
                              href={`/upload/${comboSlug}/`}
                              className="inline-block rounded-md border border-[var(--border)] px-2.5 py-1.5 text-xs font-medium tabular-nums hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors whitespace-nowrap"
                            >
                              {formatDuration(secs)}
                            </Link>
                          ) : (
                            <span className="text-xs text-[var(--muted-foreground)]">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Explanation */}
        <section>
          <h2 className="text-2xl font-bold mb-4">How to read this table</h2>
          <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
            Each cell shows the <strong>theoretical upload time</strong> — how long a
            file would take if your internet ran at full advertised speed the entire
            time. In practice, expect <strong>20–25% longer</strong> due to protocol
            overhead, Wi-Fi signal loss, and ISP fluctuations. Click any cell for a
            detailed page with real-world estimates.
          </p>
          <p className="text-[var(--muted-foreground)] leading-relaxed">
            Cells marked "—" represent combos that either finish in under 2 seconds (too
            fast to be meaningful) or take over 7 days (impractical). For those edge
            cases, use our{" "}
            <Link href="/tools/upload-time-calculator/" className="text-[var(--primary)] underline underline-offset-2">
              interactive calculator
            </Link>
            .
          </p>
        </section>
      </div>
    </>
  );
}
