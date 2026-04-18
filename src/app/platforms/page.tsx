import type { Metadata } from "next";
import Link from "next/link";
import { PLATFORM_CONTENT } from "@/lib/platform-content";

export const metadata: Metadata = {
  title: "Streaming Platform Settings — Twitch, YouTube, Kick & More",
  description:
    "Find the best streaming settings for every platform. Recommended bitrate, resolution, and encoder settings for Twitch, YouTube, Kick, Facebook, and Discord.",
  alternates: { canonical: "/platforms/" },
  openGraph: {
    title: "Streaming Platform Settings Guide",
    description: "Best streaming settings for Twitch, YouTube, Kick, Facebook, and Discord.",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function PlatformsIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Streaming Platform Settings",
            description: "Best streaming settings for every platform.",
            url: "https://streamersize.com/platforms/",
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
              { "@type": "ListItem", position: 2, name: "Platforms", item: "https://streamersize.com/platforms/" },
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
              <li className="text-[var(--foreground)] font-medium">Platforms</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Streaming Platform Settings
          </h1>
          <p className="text-[var(--muted-foreground)] text-lg max-w-2xl">
            Every platform has different bitrate limits, resolution caps, and codec support. Choose your platform below to get the optimal settings.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PLATFORM_CONTENT.map((p) => (
            <Link
              key={p.slug}
              href={`/platforms/${p.slug}/`}
              className="group rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 hover:border-[var(--primary)] hover:shadow-md transition-all"
            >
              <h2 className="text-lg font-bold mb-2 group-hover:text-[var(--primary)] transition-colors">
                {p.name}
              </h2>
              <div className="space-y-1 text-sm text-[var(--muted-foreground)]">
                <div>Max bitrate: <strong>{(p.maxBitrateKbps / 1000).toFixed(0)} Mbps</strong></div>
                <div>Max resolution: <strong>{p.maxResolution}</strong></div>
                <div>Protocol: {p.ingestProtocol}</div>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </>
  );
}
