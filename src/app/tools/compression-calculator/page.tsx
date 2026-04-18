import type { Metadata } from "next";
import CompressionCalculator from "@/components/CompressionCalculator";
import RelatedTools from "@/components/RelatedTools";

export const metadata: Metadata = {
  title: "Video Compression Calculator — Estimate File Size After Converting",
  description:
    "Estimate video file size after converting between codecs. Compare H.264, HEVC, VP9, AV1, and ProRes compression ratios instantly.",
  alternates: { canonical: "/tools/compression-calculator/" },
  openGraph: {
    title: "Video Compression Calculator",
    description: "Estimate file size after converting between H.264, HEVC, AV1, and more.",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Video Compression Calculator",
    description: "Estimate file size after codec conversion.",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    q: "How much smaller is HEVC compared to H.264?",
    a: "HEVC (H.265) typically produces files about 40% smaller than H.264 at the same visual quality. A 1 GB H.264 file would be approximately 600 MB in HEVC.",
  },
  {
    q: "Is AV1 better than HEVC for compression?",
    a: "Yes, AV1 offers about 50% better compression than H.264 and roughly 20% better than HEVC. However, AV1 encoding is significantly slower, making it better suited for pre-recorded content than live streaming.",
  },
  {
    q: "Does video compression reduce quality?",
    a: "Re-encoding always introduces some quality loss (generation loss). To minimize this, use a high-quality preset (slow/slower) and a reasonable bitrate. Converting from H.264 to HEVC at the right settings can reduce file size with minimal visible quality difference.",
  },
  {
    q: "What is the best codec for reducing video file size?",
    a: "AV1 offers the best compression ratio, followed by HEVC (H.265) and VP9. For live streaming, HEVC with hardware encoding (NVENC) is the most practical choice. For uploads and archiving, AV1 provides the smallest files.",
  },
];

export default function CompressionCalcPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Video Compression Calculator",
            applicationCategory: "UtilityApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://streamersize.com/" },
              { "@type": "ListItem", position: 2, name: "Tools", item: "https://streamersize.com/tools/" },
              { "@type": "ListItem", position: 3, name: "Compression Calculator", item: "https://streamersize.com/tools/compression-calculator/" },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      <div className="flex flex-col gap-12">
        <section>
          <nav aria-label="Breadcrumb" className="text-sm text-[var(--muted-foreground)] mb-4">
            <ol className="flex items-center gap-1.5">
              <li><a href="/" className="hover:text-[var(--primary)] transition-colors">Home</a></li>
              <li>/</li>
              <li><a href="/tools/" className="hover:text-[var(--primary)] transition-colors">Tools</a></li>
              <li>/</li>
              <li className="text-[var(--foreground)] font-medium">Compression Calculator</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Video Compression Calculator
          </h1>
          <p className="text-[var(--muted-foreground)] text-lg max-w-2xl">
            Estimate how much smaller your video will be after converting to a different codec. Compare H.264, HEVC, VP9, AV1, and ProRes side by side.
          </p>
        </section>

        <section>
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-sm">
            <CompressionCalculator />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">How Video Compression Works</h2>
          <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
            Video codecs use different algorithms to compress video data. Newer codecs like <strong>HEVC</strong> and <strong>AV1</strong> are more efficient than older ones like H.264, meaning they can achieve the same visual quality at a lower bitrate — resulting in smaller files.
          </p>
          <p className="text-[var(--muted-foreground)] leading-relaxed">
            The estimates above are based on typical compression ratios. Actual results vary depending on video content (fast motion needs more data), encoding settings (CRF/CQ value), and encoder implementation. Use our{" "}
            <a href="/" className="text-[var(--primary)] underline underline-offset-2">Bitrate Calculator</a>{" "}
            for more precise estimates based on resolution and frame rate.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map(({ q, a }) => (
              <details key={q} className="border border-[var(--border)] rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium">{q}</summary>
                <p className="px-4 pb-3 text-[var(--muted-foreground)]">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <RelatedTools current="/tools/compression-calculator/" />
      </div>
    </>
  );
}
