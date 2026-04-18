import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlatformContent, getAllPlatformSlugs } from "@/lib/platform-content";
import RelatedTools from "@/components/RelatedTools";

export function generateStaticParams() {
  return getAllPlatformSlugs().map((platform) => ({ platform }));
}

export async function generateMetadata({ params }: { params: Promise<{ platform: string }> }): Promise<Metadata> {
  const { platform } = await params;
  const p = getPlatformContent(platform);
  if (!p) return { title: "Not Found" };
  return {
    title: `${p.h1} — Bitrate, Resolution & OBS Settings`,
    description: p.description,
    alternates: { canonical: `/platforms/${p.slug}/` },
    openGraph: {
      title: p.h1,
      description: p.description,
      type: "website",
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: p.h1,
      description: p.description,
      images: ["/og-image.png"],
    },
  };
}

export default async function PlatformPage({ params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params;
  const p = getPlatformContent(platform);
  if (!p) notFound();

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
              { "@type": "ListItem", position: 2, name: "Platforms", item: "https://streamersize.com/platforms/" },
              { "@type": "ListItem", position: 3, name: p.name, item: `https://streamersize.com/platforms/${p.slug}/` },
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
            mainEntity: p.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      <div className="flex flex-col gap-12">
        {/* Header */}
        <section>
          <nav aria-label="Breadcrumb" className="text-sm text-[var(--muted-foreground)] mb-4">
            <ol className="flex items-center gap-1.5">
              <li><Link href="/" className="hover:text-[var(--primary)] transition-colors">Home</Link></li>
              <li>/</li>
              <li><Link href="/platforms/" className="hover:text-[var(--primary)] transition-colors">Platforms</Link></li>
              <li>/</li>
              <li className="text-[var(--foreground)] font-medium">{p.name}</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">{p.h1}</h1>
          <p className="text-[var(--muted-foreground)] text-lg max-w-2xl">{p.intro}</p>
        </section>

        {/* Quick specs */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Max Bitrate", value: `${(p.maxBitrateKbps / 1000).toFixed(0)} Mbps` },
            { label: "Max Resolution", value: p.maxResolution },
            { label: "Codecs", value: p.supportedCodecs[0] },
            { label: "Protocol", value: p.ingestProtocol },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-center">
              <div className="text-xs text-[var(--muted-foreground)] mb-1">{s.label}</div>
              <div className="font-bold text-sm">{s.value}</div>
            </div>
          ))}
        </section>

        {/* Settings table */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Recommended Settings</h2>
          <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--muted)]">
                  <th className="text-left px-4 py-3 font-semibold">Resolution</th>
                  <th className="text-left px-4 py-3 font-semibold">FPS</th>
                  <th className="text-left px-4 py-3 font-semibold">Bitrate</th>
                  <th className="text-left px-4 py-3 font-semibold">Upload Speed</th>
                </tr>
              </thead>
              <tbody>
                {p.settings.map((s, i) => (
                  <tr key={i} className="border-t border-[var(--border)]">
                    <td className="px-4 py-3 font-medium">{s.resolution}</td>
                    <td className="px-4 py-3">{s.fps} fps</td>
                    <td className="px-4 py-3">{s.bitrateKbps.toLocaleString()} Kbps</td>
                    <td className="px-4 py-3">{s.uploadMbps} Mbps</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tips */}
        <section>
          <h2 className="text-2xl font-bold mb-4">{p.name} Streaming Tips</h2>
          <ul className="space-y-3">
            {p.tips.map((tip, i) => (
              <li key={i} className="flex gap-3 text-[var(--muted-foreground)] leading-relaxed">
                <span className="text-[var(--primary)] shrink-0 mt-0.5">✓</span>
                {tip}
              </li>
            ))}
          </ul>
        </section>

        {/* Supported codecs */}
        {p.supportedCodecs.length > 1 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Supported Codecs</h2>
            <div className="flex flex-wrap gap-2">
              {p.supportedCodecs.map((c) => (
                <span key={c} className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] text-sm font-medium">
                  {c}
                </span>
              ))}
            </div>
            <p className="text-sm text-[var(--muted-foreground)] mt-3">
              Compare these codecs in detail with our{" "}
              <Link href="/compare/" className="text-[var(--primary)] underline underline-offset-2">Codec Comparison Tool</Link>.
            </p>
          </section>
        )}

        {/* CTA */}
        <section className="rounded-xl border-2 border-[var(--primary-20)] bg-[var(--accent)] p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Calculate Your {p.name} Stream Settings</h2>
          <p className="text-[var(--muted-foreground)] mb-4">
            Use our free calculator to find the exact bitrate and file size for your {p.name} stream.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/" className="px-5 py-2.5 rounded-lg bg-[var(--primary)] text-white font-medium hover:opacity-90 transition-opacity">
              Bitrate Calculator
            </Link>
            <Link href="/tools/bandwidth-calculator/" className="px-5 py-2.5 rounded-lg border border-[var(--border)] font-medium hover:border-[var(--primary)] transition-colors">
              Check Upload Speed
            </Link>
          </div>
        </section>

        {/* Related blog posts */}
        {p.relatedBlogSlugs.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Related Guides</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {p.relatedBlogSlugs.map((slug) => (
                <Link
                  key={slug}
                  href={`/blog/${slug}/`}
                  className="rounded-xl border border-[var(--border)] p-4 hover:border-[var(--primary)] transition-colors"
                >
                  <span className="text-sm font-medium hover:text-[var(--primary)]">
                    {slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {p.faqs.map(({ q, a }) => (
              <details key={q} className="border border-[var(--border)] rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium">{q}</summary>
                <p className="px-4 pb-3 text-[var(--muted-foreground)]">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <RelatedTools current={`/platforms/${p.slug}/`} />
      </div>
    </>
  );
}
