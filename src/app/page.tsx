import type { Metadata } from "next";
import Link from "next/link";
import CalculatorForm from "@/components/CalculatorForm";
import { RESOLUTIONS, FPS_OPTIONS } from "@/data/presets";

export const metadata: Metadata = {
  title: "Streaming Bitrate & Storage Calculator | Free Online Tool",
  description:
    "Instantly calculate video file size, bitrate, and storage needs for 1080p, 4K, 8K streaming. Supports H.264, HEVC, ProRes codecs. 100% free.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Streaming Bitrate & Storage Calculator",
            applicationCategory: "UtilityApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description:
              "Calculate video file size, streaming bitrate, and storage requirements for any resolution, frame rate, and codec.",
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
                name: "How much storage does 1 hour of 4K video take?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "A 1-hour 4K video at 30fps using H.264 takes approximately 22–33 GB depending on bitrate settings. HEVC can reduce this by ~40%.",
                },
              },
              {
                "@type": "Question",
                name: "What bitrate do I need for 1080p streaming?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "For 1080p at 30fps, a bitrate of 4,500–6,000 Kbps (H.264) is recommended. At 60fps, aim for 6,000–9,000 Kbps.",
                },
              },
              {
                "@type": "Question",
                name: "Is HEVC better than H.264 for streaming?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "HEVC (H.265) offers ~40% better compression than H.264 at similar quality, meaning smaller files and lower bandwidth.",
                },
              },
            ],
          }),
        }}
      />

      <div className="flex flex-col gap-12">
        {/* Hero */}
        <section>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Streaming Bitrate &amp; Storage Calculator
          </h1>
          <p className="text-[var(--muted-foreground)] text-lg max-w-2xl">
            Estimate video file size, required bandwidth, and storage for any
            resolution, frame rate, and codec — instantly.
          </p>
        </section>

        {/* Calculator */}
        <section>
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-sm">
            <CalculatorForm />
          </div>
        </section>

        {/* SEO Content + FAQ + Links */}
        <div className="flex flex-col gap-10">
          <section>
            <h2 className="text-2xl font-bold mb-4">Popular streaming bitrate guides</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["/size/720p-streaming-bitrate/", "720p streaming bitrate"],
                ["/size/1080p-streaming-bitrate/", "1080p streaming bitrate"],
                ["/size/1440p-streaming-bitrate/", "1440p streaming bitrate"],
                ["/size/4k-streaming-bitrate/", "4K streaming bitrate"],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="rounded-xl border border-[var(--border)] px-4 py-3 text-sm font-medium hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              How Does the Streaming Bitrate Calculator Work?
            </h2>
            <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
              Our calculator estimates video file sizes by combining resolution,
              frame rate, codec efficiency, audio bitrate, and duration into a
              single, easy-to-read result. Whether you&apos;re a content creator
              planning storage needs or a streamer optimizing your OBS settings,
              this tool gives you accurate estimates in real time.
            </p>
            <h3 className="text-lg font-semibold mb-2">
              Supported Resolutions &amp; Codecs
            </h3>
            <ul className="list-disc pl-6 text-[var(--muted-foreground)] space-y-1">
              <li>
                <strong>Resolutions:</strong> 720p, 1080p, 1440p, 4K (2160p), 8K
                (4320p)
              </li>
              <li>
                <strong>Codecs:</strong> H.264 (AVC), H.265 (HEVC), VP9, AV1,
                ProRes 422, ProRes 4444
              </li>
              <li>
                <strong>Frame Rates:</strong> 24fps, 30fps, 60fps, 120fps
              </li>
            </ul>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {[
                {
                  q: "How much storage does 1 hour of 4K video take?",
                  a: "A 1-hour 4K video at 30fps using H.264 takes approximately 22–33 GB depending on bitrate settings. HEVC can reduce this by ~40%.",
                },
                {
                  q: "What bitrate do I need for 1080p streaming?",
                  a: "For 1080p at 30fps, a bitrate of 4,500–6,000 Kbps (H.264) is recommended. At 60fps, aim for 6,000–9,000 Kbps.",
                },
                {
                  q: "Is HEVC better than H.264 for streaming?",
                  a: "HEVC (H.265) offers ~40% better compression than H.264 at similar quality, meaning smaller files and lower bandwidth. However, encoding is slower and some older devices lack hardware decoding support.",
                },
              ].map(({ q, a }) => (
                <details
                  key={q}
                  className="group border border-[var(--border)] rounded-lg"
                >
                  <summary className="cursor-pointer px-4 py-3 font-medium">
                    {q}
                  </summary>
                  <p className="px-4 pb-3 text-[var(--muted-foreground)]">{a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Internal Links Hub */}
          <section>
            <h2 className="text-2xl font-bold mb-6">
              Calculate by Resolution &amp; Frame Rate
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left border-b border-[var(--border)]">
                    <th className="pb-3 pr-4 font-semibold">Resolution</th>
                    {FPS_OPTIONS.map((f) => (
                      <th
                        key={f.slug}
                        className="pb-3 px-2 font-semibold text-center"
                      >
                        {f.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RESOLUTIONS.map((r) => (
                    <tr
                      key={r.slug}
                      className="border-b border-[var(--border)] last:border-0"
                    >
                      <td className="py-3 pr-4 font-medium">{r.label}</td>
                      {FPS_OPTIONS.map((f) => (
                        <td key={f.slug} className="py-3 px-2 text-center">
                          <Link
                            href={`/size/${r.slug}-${f.slug}/`}
                            className="inline-block rounded-md border border-[var(--border)] px-3 py-1.5 text-xs font-medium hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                          >
                            {r.slug}/{f.slug}
                          </Link>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Platform-specific guides</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["/platforms/twitch/", "Twitch streaming settings"],
                ["/platforms/youtube/", "YouTube streaming settings"],
                ["/platforms/kick/", "Kick streaming settings"],
                ["/blog/youtube-streaming-bitrate-guide/", "YouTube bitrate guide"],
                ["/blog/twitch-streaming-bitrate-guide/", "Twitch bitrate guide"],
                ["/blog/best-obs-bitrate-settings/", "OBS bitrate settings"],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="rounded-xl border border-[var(--border)] px-4 py-3 text-sm font-medium hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-xl border-2 border-[var(--primary-20)] bg-[var(--accent)] p-6 text-center">
            <h2 className="text-xl font-bold mb-2">Not sure what settings to use?</h2>
            <p className="text-[var(--muted-foreground)] mb-4 text-sm">
              Answer 4 quick questions and get personalized streaming settings for your setup.
            </p>
            <Link href="/setup-wizard/" className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity">
              Open Setup Wizard →
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
