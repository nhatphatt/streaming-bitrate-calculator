import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "OBS Settings Guide for Streaming & Recording",
  description:
    "Find the best OBS settings for streaming and recording: bitrate, encoder, CBR vs VBR, resolution, FPS, and platform-specific recommendations.",
  alternates: { canonical: "/obs/" },
  openGraph: {
    title: "OBS Settings Guide for Streaming & Recording",
    description:
      "Best OBS settings for Twitch, YouTube, Kick, local recording, bitrate, encoders, and CBR vs VBR.",
    type: "website",
    url: "/obs/",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "OBS Settings Guide — StreamerSize" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "OBS Settings Guide for Streaming & Recording",
    description: "Best OBS settings for bitrate, encoder, CBR vs VBR, streaming, and recording.",
    images: ["/og-image.png"],
  },
};

const settings = [
  ["Twitch 1080p 60fps", "6,000 Kbps", "CBR", "NVENC H.264 or x264", "10+ Mbps"],
  ["YouTube 1080p 60fps", "9,000–12,000 Kbps", "CBR", "NVENC H.264, HEVC, or AV1", "15–18 Mbps"],
  ["Kick 1080p 60fps", "6,000–8,000 Kbps", "CBR", "NVENC H.264 or x264", "10–12 Mbps"],
  ["Local recording", "Quality-based", "CQP/CRF", "HEVC or AV1", "Disk speed matters"],
];

const guides = [
  ["/blog/best-obs-bitrate-settings/", "Best OBS bitrate settings"],
  ["/blog/obs-bitrate-for-1080p-60fps/", "OBS bitrate for 1080p 60fps"],
  ["/blog/obs-recording-settings-guide/", "Best OBS recording settings"],
  ["/blog/cbr-vs-vbr-bitrate-explained/", "CBR vs VBR for OBS"],
  ["/blog/nvenc-vs-x264-streaming/", "NVENC vs x264"],
  ["/blog/obs-vs-streamlabs-2026/", "OBS vs Streamlabs"],
];

const games = [
  ["/blog/best-obs-settings-fortnite/", "Fortnite OBS settings"],
  ["/blog/best-obs-settings-valorant/", "Valorant OBS settings"],
  ["/blog/best-obs-settings-minecraft/", "Minecraft OBS settings"],
  ["/blog/best-obs-settings-apex-legends/", "Apex Legends OBS settings"],
  ["/blog/best-obs-settings-cs2/", "CS2 OBS settings"],
  ["/blog/best-obs-settings-warzone/", "Warzone OBS settings"],
];

export default function ObsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What are the best OBS settings for streaming?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Use CBR rate control, a 2-second keyframe interval, 160 Kbps AAC audio, and a bitrate matched to your platform. Twitch 1080p 60fps usually uses 6,000 Kbps; YouTube 1080p 60fps can use 9,000–12,000 Kbps.",
                },
              },
              {
                "@type": "Question",
                name: "Should OBS use CBR or VBR?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Use CBR for OBS live streaming. Use CQP or CRF, which are quality-based VBR modes, for local OBS recording.",
                },
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
              <li className="text-[var(--foreground)] font-medium">OBS Settings</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Best OBS Settings for Streaming &amp; Recording</h1>
          <p className="text-[var(--muted-foreground)] text-lg max-w-3xl">
            Use CBR for live streaming, CQP/CRF for local recording, a 2-second keyframe interval,
            and a bitrate that matches your platform and upload speed. This hub links every OBS bitrate,
            encoder, recording, and game-specific guide on StreamerSize.
          </p>
        </section>

        <section className="rounded-xl border border-[var(--border)] p-6">
          <h2 className="text-2xl font-bold mb-4">Quick OBS settings table</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  {['Use case', 'Bitrate', 'Rate control', 'Encoder', 'Headroom'].map((h) => <th key={h} className="pb-3 pr-4 font-semibold">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {settings.map((row) => (
                  <tr key={row[0]} className="border-b border-[var(--border)] last:border-0">
                    {row.map((cell, i) => <td key={cell} className={`py-3 pr-4 ${i === 0 ? "font-medium" : "text-[var(--muted-foreground)]"}`}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Link href="/" className="rounded-xl border border-[var(--border)] p-5 hover:border-[var(--primary)] transition-colors">
            <h2 className="font-bold mb-2">OBS Bitrate Calculator</h2>
            <p className="text-sm text-[var(--muted-foreground)]">Calculate bitrate, file size, and upload speed for your OBS setup.</p>
          </Link>
          <Link href="/tools/bandwidth-calculator/" className="rounded-xl border border-[var(--border)] p-5 hover:border-[var(--primary)] transition-colors">
            <h2 className="font-bold mb-2">Upload Speed Check</h2>
            <p className="text-sm text-[var(--muted-foreground)]">Check whether your internet can handle Twitch, YouTube, or Kick settings.</p>
          </Link>
          <Link href="/setup-wizard/" className="rounded-xl border border-[var(--border)] p-5 hover:border-[var(--primary)] transition-colors">
            <h2 className="font-bold mb-2">OBS Setup Wizard</h2>
            <p className="text-sm text-[var(--muted-foreground)]">Answer a few questions and get recommended OBS settings.</p>
          </Link>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Core OBS guides</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map(([href, label]) => (
              <Link key={href} href={href} className="rounded-xl border border-[var(--border)] px-4 py-3 text-sm font-medium hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors">{label}</Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">OBS settings by game</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {games.map(([href, label]) => (
              <Link key={href} href={href} className="rounded-xl border border-[var(--border)] px-4 py-3 text-sm font-medium hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors">{label}</Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
