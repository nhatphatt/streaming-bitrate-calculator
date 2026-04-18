import type { Metadata } from "next";
import DiskSpacePlanner from "@/components/DiskSpacePlanner";
import RelatedTools from "@/components/RelatedTools";

export const metadata: Metadata = {
  title: "Disk Space Planner — How Much Storage Do You Need for Streaming?",
  description:
    "Plan your storage needs for streaming and recording. Calculate how much disk space you need based on hours per week, resolution, codec, and retention period.",
  alternates: { canonical: "/tools/disk-space-planner/" },
  openGraph: {
    title: "Disk Space Planner for Streamers",
    description: "Calculate storage needs based on your streaming schedule and settings.",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Disk Space Planner",
    description: "How much storage do you need for streaming?",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    q: "How much storage do I need for streaming?",
    a: "It depends on your resolution, codec, and how many hours you stream. A typical streamer recording 1080p 60fps with H.264 at 10 hours/week needs about 300 GB per month. Using HEVC reduces this to about 180 GB.",
  },
  {
    q: "Should I use an SSD or HDD for recording?",
    a: "An SSD is recommended for recording because it handles sustained write speeds better, especially at high bitrates (4K, ProRes). For long-term storage/archiving, a larger HDD is more cost-effective.",
  },
  {
    q: "How much storage does 1 hour of 1080p recording take?",
    a: "At 1080p 60fps with H.264, approximately 7-8 GB per hour. With HEVC, about 4-5 GB. ProRes 422 uses around 25-30 GB per hour at the same resolution.",
  },
  {
    q: "How can I reduce recording file size?",
    a: "Use a more efficient codec (HEVC or AV1 instead of H.264), lower your resolution or frame rate, or reduce your recording bitrate. Our Compression Calculator can help you estimate savings.",
  },
];

export default function DiskSpacePlannerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Disk Space Planner",
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
              { "@type": "ListItem", position: 3, name: "Disk Space Planner", item: "https://streamersize.com/tools/disk-space-planner/" },
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
              <li className="text-[var(--foreground)] font-medium">Disk Space Planner</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Disk Space Planner for Streamers
          </h1>
          <p className="text-[var(--muted-foreground)] text-lg max-w-2xl">
            Calculate how much storage you need based on your streaming schedule, resolution, and codec. Find the right drive size for your setup.
          </p>
        </section>

        <section>
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-sm">
            <DiskSpacePlanner />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Planning Your Storage</h2>
          <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
            Running out of disk space mid-stream is every streamer&apos;s nightmare. This planner helps you estimate exactly how much storage you need based on your weekly streaming hours and how long you want to keep recordings.
          </p>
          <p className="text-[var(--muted-foreground)] leading-relaxed">
            We recommend keeping at least <strong>20% free space</strong> on your recording drive for optimal performance. The recommended drive size above includes this headroom. For exact per-session calculations, use our{" "}
            <a href="/tools/recording-time-calculator/" className="text-[var(--primary)] underline underline-offset-2">Recording Time Calculator</a>.
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

        <RelatedTools current="/tools/disk-space-planner/" />
      </div>
    </>
  );
}
