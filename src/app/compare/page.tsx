import type { Metadata } from "next";
import Link from "next/link";
import { RESOLUTIONS, FPS_OPTIONS, CODECS } from "@/data/presets";
import { calculate, toDurationSeconds } from "@/lib/calculate";
import CodecCompareClient from "@/components/CodecCompareClient";
import RelatedTools from "@/components/RelatedTools";


export const metadata: Metadata = {
  title: "Video Codec Comparison — H.264 vs HEVC vs VP9 vs AV1 vs ProRes",
  description:
    "Compare video codecs side-by-side: H.264, HEVC (H.265), VP9, AV1, ProRes 422, ProRes 4444. See file size, bitrate, and quality differences for every resolution.",
  alternates: {
    canonical: "/compare/",
  },
  openGraph: {
    title: "Video Codec Comparison — H.264 vs HEVC vs VP9 vs AV1 vs ProRes",
    description:
      "Compare video codecs side-by-side: H.264, HEVC (H.265), VP9, AV1, ProRes 422, ProRes 4444. See file size, bitrate, and quality differences for every resolution.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Video Codec Comparison — H.264 vs HEVC vs VP9 vs AV1 vs ProRes",
    description:
      "Compare video codecs side-by-side. See file size, bitrate, and quality differences for every resolution.",
  },
};

export default function ComparePage() {
  // Pre-calculate a reference table: all codecs × all resolutions at 30fps, 1hr
  const referenceData = RESOLUTIONS.map((res) => ({
    resolution: res,
    codecs: CODECS.map((codec) => {
      const result = calculate({
        resolution: res.slug,
        fps: 30,
        codec: codec.id,
        audioBitrateKbps: 128,
        durationSeconds: toDurationSeconds(1, 0, 0),
      });
      return { codec, result };
    }),
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Video Codec Comparison Tool",
            applicationCategory: "UtilityApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />

      <div className="flex flex-col gap-12">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="text-sm text-[var(--muted-foreground)]"
      >
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-[var(--primary)] transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="text-[var(--foreground)] font-medium">
            Codec Comparison
          </li>
        </ol>
      </nav>

      <section>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
          Video Codec Comparison
        </h1>
        <p className="text-[var(--muted-foreground)] text-lg max-w-2xl">
          Compare H.264, HEVC, VP9, AV1, and ProRes codecs side-by-side.
          See how each codec affects file size, bitrate, and bandwidth for
          every resolution.
        </p>
      </section>

      {/* Interactive comparison */}
      <section>
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-sm">
          <CodecCompareClient />
        </div>
      </section>

      {/* === AD SLOT === */}

      {/* Static reference tables per resolution */}
      <section>
        <h2 className="text-2xl font-bold mb-6">
          Reference: 1-Hour File Sizes at 30fps
        </h2>
        {referenceData.map(({ resolution: res, codecs }) => (
          <div key={res.slug} className="mb-8">
            <h3 className="text-lg font-semibold mb-3">
              {res.label} ({res.width}&times;{res.height})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left text-xs text-[var(--muted-foreground)] border-b border-[var(--border)]">
                    <th className="pb-2 pr-4">Codec</th>
                    <th className="pb-2 pr-4">Video Bitrate</th>
                    <th className="pb-2 pr-4">Total Bitrate</th>
                    <th className="pb-2 pr-4">1-Hour Size</th>
                    <th className="pb-2">vs H.264</th>
                  </tr>
                </thead>
                <tbody>
                  {codecs.map(({ codec, result }) => {
                    const h264Size =
                      codecs.find((c) => c.codec.id === "h264")?.result
                        .fileSizeBytes ?? 1;
                    const pct = Math.round(
                      (result.fileSizeBytes / h264Size) * 100
                    );
                    return (
                      <tr
                        key={codec.id}
                        className="border-b border-[var(--border)] last:border-0"
                      >
                        <td className="py-2.5 pr-4 font-medium">
                          {codec.label}
                        </td>
                        <td className="py-2.5 pr-4 tabular-nums">
                          {(result.videoBitrateKbps / 1000).toFixed(1)} Mbps
                        </td>
                        <td className="py-2.5 pr-4 tabular-nums">
                          {result.totalBitrateMbps} Mbps
                        </td>
                        <td className="py-2.5 pr-4 tabular-nums font-medium">
                          {result.fileSizeFormatted}
                        </td>
                        <td className="py-2.5 tabular-nums">
                          <span
                            className={
                              pct < 100
                                ? "text-green-600 font-medium"
                                : pct > 100
                                ? "text-orange-500"
                                : "text-[var(--muted-foreground)]"
                            }
                          >
                            {pct}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </section>

      {/* === AD SLOT === */}

      {/* SEO Content */}
      <section className="max-w-none">
        <h2 className="text-2xl font-bold mb-4">
          Which Video Codec Should You Use?
        </h2>

        <div className="space-y-6 text-[var(--muted-foreground)] leading-relaxed">
          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
              H.264 (AVC) — The Universal Standard
            </h3>
            <p>
              H.264 remains the most widely supported codec across all devices,
              browsers, and streaming platforms. It&apos;s the safest choice for
              maximum compatibility, but produces the largest files among modern
              codecs.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
              H.265 / HEVC — The Efficiency Upgrade
            </h3>
            <p>
              HEVC delivers approximately 40% better compression than H.264 at
              equivalent quality. Ideal for 4K content and storage-limited
              workflows. Hardware decoding is now available on most modern
              devices.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
              VP9 — Google&apos;s Open Alternative
            </h3>
            <p>
              VP9 offers compression comparable to HEVC and is royalty-free.
              It&apos;s the default codec for YouTube and works well in Chrome
              and Firefox. A solid choice for web-first content.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
              AV1 — The Future of Video
            </h3>
            <p>
              AV1 provides roughly 50% better compression than H.264 and is
              royalty-free. It&apos;s gaining support rapidly — YouTube, Netflix,
              and major browsers support it. Encoding is slower, but hardware
              encoders are becoming available.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
              ProRes — Professional Production
            </h3>
            <p>
              Apple ProRes is designed for video editing, not delivery. ProRes
              422 and 4444 maintain maximum quality during post-production but
              produce significantly larger files (3.5&ndash;5&times; H.264).
              Essential for professional color grading and VFX workflows.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {[
            {
              q: "Which codec gives the smallest file size?",
              a: "AV1 produces the smallest files — approximately 50% smaller than H.264 at comparable quality. HEVC and VP9 are close runners-up at about 40% smaller.",
            },
            {
              q: "Can I use AV1 for live streaming?",
              a: "AV1 encoding is currently too slow for real-time streaming on most hardware. HEVC or H.264 are better choices for live streaming. However, AV1 hardware encoders (NVIDIA RTX 40-series, Intel Arc) are making real-time AV1 increasingly viable.",
            },
            {
              q: "Is HEVC the same as H.265?",
              a: "Yes, HEVC (High Efficiency Video Coding) and H.265 are the same codec. HEVC is the common name, while H.265 is the ITU-T standard designation.",
            },
          ].map(({ q, a }) => (
            <details
              key={q}
              className="group border border-[var(--border)] rounded-lg"
            >
              <summary className="cursor-pointer px-4 py-3 font-medium">
                {q}
              </summary>
              <p className="px-4 pb-3 text-[var(--muted-foreground)] leading-relaxed">
                {a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <RelatedTools current="/compare/" />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Which codec gives the smallest file size?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "AV1 produces the smallest files — approximately 50% smaller than H.264 at comparable quality.",
                },
              },
              {
                "@type": "Question",
                name: "Can I use AV1 for live streaming?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "AV1 encoding is currently too slow for real-time streaming on most hardware. HEVC or H.264 are better choices for live streaming.",
                },
              },
              {
                "@type": "Question",
                name: "Is HEVC the same as H.265?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, HEVC (High Efficiency Video Coding) and H.265 are the same codec.",
                },
              },
            ],
          }),
        }}
      />
    </>
  );
}
