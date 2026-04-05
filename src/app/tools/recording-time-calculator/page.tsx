import type { Metadata } from "next";
import Link from "next/link";
import RecordingTimeCalculator from "@/components/RecordingTimeCalculator";
import RelatedTools from "@/components/RelatedTools";

export const metadata: Metadata = {
  title: "Recording Time Calculator — How Long Can You Record?",
  description:
    "Calculate how much recording time your storage can hold based on resolution, frame rate, and codec. Supports 720p to 8K, H.264, HEVC, AV1, and ProRes.",
  alternates: { canonical: "/tools/recording-time-calculator/" },
  openGraph: {
    title: "Recording Time Calculator — How Long Can You Record?",
    description: "Find out how many hours of video your hard drive or SSD can store.",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Recording Time Calculator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Recording Time Calculator",
    description: "Find out how many hours of video your storage can hold.",
    images: ["/og-image.png"],
  },
};

export default function RecordingTimePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Recording Time Calculator",
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
              { "@type": "ListItem", position: 2, name: "Recording Time Calculator", item: "https://streamersize.com/tools/recording-time-calculator/" },
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
            mainEntity: [
              {
                "@type": "Question",
                name: "How many hours of 4K video can a 1TB drive hold?",
                acceptedAnswer: { "@type": "Answer", text: "A 1TB drive can hold approximately 66 hours of 4K 30fps video with H.264 codec, or about 110 hours with HEVC. ProRes 422 reduces this to roughly 19 hours." },
              },
              {
                "@type": "Question",
                name: "How long can I record 1080p on a 256GB SD card?",
                acceptedAnswer: { "@type": "Answer", text: "A 256GB SD card can hold approximately 8.5 hours of 1080p 30fps H.264 video, or about 14 hours with HEVC. At 60fps, these numbers are roughly halved." },
              },
              {
                "@type": "Question",
                name: "Which codec gives the longest recording time?",
                acceptedAnswer: { "@type": "Answer", text: "AV1 gives the longest recording time due to its superior compression — roughly 50% more recording time than H.264. HEVC is a close second at about 40% more. ProRes gives the shortest time due to its large file sizes." },
              },
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
              <li className="text-[var(--foreground)] font-medium">Recording Time Calculator</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Recording Time Calculator
          </h1>
          <p className="text-[var(--muted-foreground)] text-lg max-w-2xl">
            How many hours of video can your storage hold? Select your drive
            size, resolution, and codec to find out.
          </p>
        </section>

        <section>
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-sm">
            <RecordingTimeCalculator />
          </div>
        </section>

        <div className="flex flex-col gap-10">
          <section>
            <h2 className="text-2xl font-bold mb-4">
              How Recording Time Is Calculated
            </h2>
            <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
              Recording time is determined by dividing your <strong>available
              storage</strong> by the <strong>data rate</strong> of your video
              settings. The data rate depends on resolution, frame rate, and codec —
              higher resolution and frame rate produce more data per second, while
              efficient codecs like HEVC and AV1 reduce the data rate significantly.
            </p>
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              For example, 4K 30fps H.264 generates roughly 15 GB per hour. A 1TB
              drive therefore holds about 66 hours of footage. Switch to HEVC and
              that jumps to ~110 hours — a 67% increase in recording time from codec
              choice alone. Use our{" "}
              <Link href="/" className="text-[var(--primary)] underline underline-offset-2">
                Bitrate &amp; Storage Calculator
              </Link>{" "}
              for detailed file size calculations, or the{" "}
              <Link href="/compare/" className="text-[var(--primary)] underline underline-offset-2">
                Codec Comparison tool
              </Link>{" "}
              to see how codecs stack up.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {[
                {
                  q: "How many hours of 4K video can a 1TB drive hold?",
                  a: "A 1TB drive can hold approximately 66 hours of 4K 30fps video with H.264 codec, or about 110 hours with HEVC. ProRes 422 reduces this to roughly 19 hours.",
                },
                {
                  q: "How long can I record 1080p on a 256GB SD card?",
                  a: "A 256GB SD card can hold approximately 8.5 hours of 1080p 30fps H.264 video, or about 14 hours with HEVC. At 60fps, these numbers are roughly halved.",
                },
                {
                  q: "Which codec gives the longest recording time?",
                  a: "AV1 gives the longest recording time due to its superior compression — roughly 50% more recording time than H.264. HEVC is a close second at about 40% more. ProRes gives the shortest time due to its large file sizes.",
                },
                {
                  q: "Should I choose a larger drive or a more efficient codec?",
                  a: "Both help. Switching from H.264 to HEVC is like getting 40% more storage for free. But if you need maximum quality or compatibility, a larger drive is the safer option. For most creators, HEVC + a 2TB SSD is the sweet spot.",
                },
              ].map(({ q, a }) => (
                <details key={q} className="border border-[var(--border)] rounded-lg">
                  <summary className="cursor-pointer px-4 py-3 font-medium">{q}</summary>
                  <p className="px-4 pb-3 text-[var(--muted-foreground)]">{a}</p>
                </details>
              ))}
            </div>
          </section>

          <RelatedTools current="/tools/recording-time-calculator/" />
        </div>
      </div>
    </>
  );
}
