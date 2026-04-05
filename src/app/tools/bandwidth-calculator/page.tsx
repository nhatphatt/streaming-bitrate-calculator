import type { Metadata } from "next";
import BandwidthCalculator from "@/components/BandwidthCalculator";
import RelatedTools from "@/components/RelatedTools";

export const metadata: Metadata = {
  title:
    "Streaming Bandwidth Calculator — How Much Upload Speed Do You Need?",
  description:
    "Find out if your internet upload speed is fast enough for live streaming. Test 720p, 1080p, 1440p, and 4K streaming requirements instantly.",
  alternates: { canonical: "/tools/bandwidth-calculator/" },
  openGraph: {
    title: "Streaming Bandwidth Calculator — Upload Speed Test",
    description:
      "Find out if your upload speed is enough for streaming at 720p to 4K.",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Streaming Bandwidth Calculator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Streaming Bandwidth Calculator",
    description:
      "Test if your upload speed supports 720p, 1080p, or 4K streaming.",
    images: ["/og-image.png"],
  },
};

export default function BandwidthCalcPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Streaming Bandwidth Calculator",
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
              { "@type": "ListItem", position: 2, name: "Bandwidth Calculator", item: "https://streamersize.com/tools/bandwidth-calculator/" },
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
                name: "What upload speed do I need for Twitch?",
                acceptedAnswer: { "@type": "Answer", text: "For 1080p 60fps streaming on Twitch (6,000 Kbps bitrate), you need at least 10 Mbps upload speed. For 720p 30fps, 5 Mbps is sufficient." },
              },
              {
                "@type": "Question",
                name: "Can I stream 4K with 25 Mbps upload?",
                acceptedAnswer: { "@type": "Answer", text: "25 Mbps is borderline for 4K streaming. At 75% utilization, you'd have about 18,750 Kbps available — enough for 4K 30fps with HEVC but not H.264. We recommend 50+ Mbps for reliable 4K streaming." },
              },
              {
                "@type": "Question",
                name: "Does download speed affect streaming?",
                acceptedAnswer: { "@type": "Answer", text: "Download speed doesn't directly affect your stream quality. Only upload speed matters for sending video data to the streaming platform." },
              },
            ],
          }),
        }}
      />

      <div className="flex flex-col gap-12">
        <section>
          <nav
            aria-label="Breadcrumb"
            className="text-sm text-[var(--muted-foreground)] mb-4"
          >
            <ol className="flex items-center gap-1.5">
              <li>
                <a
                  href="/"
                  className="hover:text-[var(--primary)] transition-colors"
                >
                  Home
                </a>
              </li>
              <li>/</li>
              <li className="text-[var(--foreground)] font-medium">
                Bandwidth Calculator
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Streaming Bandwidth Calculator
          </h1>
          <p className="text-[var(--muted-foreground)] text-lg max-w-2xl">
            Enter your upload speed to instantly see which streaming qualities
            your connection supports — from 720p to 4K.
          </p>
        </section>

        <section>
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-sm">
            <BandwidthCalculator />
          </div>
        </section>

        <div className="flex flex-col gap-12">
          <section>
            <h2 className="text-2xl font-bold mb-4">
              How Much Upload Speed Do You Need for Streaming?
            </h2>
            <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
              Your upload speed determines the maximum video bitrate you can
              stream. We recommend using no more than 75% of your available
              upload bandwidth for streaming, leaving headroom for audio, chat
              overlays, and other network activity.
            </p>
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              For most Twitch and Kick streamers, <strong>10 Mbps upload</strong>{" "}
              is sufficient for 1080p 60fps. YouTube streamers targeting 4K need
              at least <strong>50 Mbps upload</strong>. For exact file size
              calculations, use our{" "}
              <a
                href="/"
                className="text-[var(--primary)] underline underline-offset-2"
              >
                Bitrate &amp; Storage Calculator
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {[
                {
                  q: "What upload speed do I need for Twitch?",
                  a: "For 1080p 60fps streaming on Twitch (6,000 Kbps bitrate), you need at least 10 Mbps upload speed. For 720p 30fps, 5 Mbps is sufficient.",
                },
                {
                  q: "Can I stream 4K with 25 Mbps upload?",
                  a: "25 Mbps is borderline for 4K streaming. At 75% utilization, you'd have about 18,750 Kbps available — enough for 4K 30fps with HEVC but not H.264. We recommend 50+ Mbps for reliable 4K streaming.",
                },
                {
                  q: "Does download speed affect streaming?",
                  a: "Download speed doesn't directly affect your stream quality. Only upload speed matters for sending video data to the streaming platform. However, you need some download bandwidth for chat, alerts, and browser sources.",
                },
              ].map(({ q, a }) => (
                <details
                  key={q}
                  className="border border-[var(--border)] rounded-lg"
                >
                  <summary className="cursor-pointer px-4 py-3 font-medium">
                    {q}
                  </summary>
                  <p className="px-4 pb-3 text-[var(--muted-foreground)]">
                    {a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          <RelatedTools current="/tools/bandwidth-calculator/" />
        </div>
      </div>
    </>
  );
}
