import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About StreamerSize",
  description:
    "StreamerSize provides free, accurate tools for streamers and video creators to calculate bitrate, file size, storage, and bandwidth requirements.",
  alternates: { canonical: "/about/" },
  openGraph: {
    title: "About StreamerSize",
    description: "Free tools for streamers and video creators.",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About StreamerSize",
    description: "Free tools for streamers and video creators.",
    images: ["/og-image.png"],
  },
};

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-12 max-w-3xl">
      <section>
        <nav aria-label="Breadcrumb" className="text-sm text-[var(--muted-foreground)] mb-4">
          <ol className="flex items-center gap-1.5">
            <li><Link href="/" className="hover:text-[var(--primary)] transition-colors">Home</Link></li>
            <li>/</li>
            <li className="text-[var(--foreground)] font-medium">About</li>
          </ol>
        </nav>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
          About StreamerSize
        </h1>
      </section>

      <section className="text-[var(--muted-foreground)] leading-relaxed space-y-4">
        <p>
          <strong className="text-[var(--foreground)]">StreamerSize</strong> is
          a suite of free online tools built for streamers, content creators,
          filmmakers, and anyone who works with video. Our mission is simple:
          help you make informed decisions about your video settings without
          guessing.
        </p>

        <p>
          Whether you&apos;re a Twitch streamer wondering what bitrate to use, a
          YouTuber planning storage for your next shoot, or a filmmaker choosing
          between H.264 and HEVC — our calculators give you accurate, real-time
          answers.
        </p>

        <h2 className="text-xl font-bold text-[var(--foreground)] pt-4">
          Why StreamerSize?
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "100% Free, Forever",
              desc: "No subscriptions, no paywalls, no hidden fees. Every tool is completely free to use.",
            },
            {
              title: "No Account Required",
              desc: "Just open the tool and start calculating. We don't ask for your email or any personal information.",
            },
            {
              title: "Privacy First",
              desc: "All calculations run entirely in your browser. No data is sent to any server. Your settings are never stored or tracked.",
            },
            {
              title: "Accurate & Up-to-Date",
              desc: "Our formulas are based on industry-standard bitrate recommendations and updated regularly to reflect the latest codecs and platforms.",
            },
          ].map(({ title, desc }) => (
            <div
              key={title}
              className="rounded-lg border border-[var(--border)] p-4"
            >
              <h3 className="font-semibold text-[var(--foreground)] text-sm mb-1">
                {title}
              </h3>
              <p className="text-sm">{desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-[var(--foreground)] pt-4">
          Our Tools
        </h2>

        <ul className="space-y-2">
          <li>
            <Link href="/" className="text-[var(--primary)] underline underline-offset-2 font-medium">
              Bitrate &amp; Storage Calculator
            </Link>{" "}
            — Estimate file size for any resolution, frame rate, and codec
          </li>
          <li>
            <Link href="/compare/" className="text-[var(--primary)] underline underline-offset-2 font-medium">
              Codec Comparison
            </Link>{" "}
            — Compare H.264, HEVC, AV1, and ProRes side-by-side
          </li>
          <li>
            <Link href="/tools/bandwidth-calculator/" className="text-[var(--primary)] underline underline-offset-2 font-medium">
              Bandwidth Calculator
            </Link>{" "}
            — Check if your upload speed supports your target quality
          </li>
          <li>
            <Link href="/tools/upload-time-calculator/" className="text-[var(--primary)] underline underline-offset-2 font-medium">
              Upload Time Calculator
            </Link>{" "}
            — Estimate how long your video upload will take
          </li>
          <li>
            <Link href="/tools/recording-time-calculator/" className="text-[var(--primary)] underline underline-offset-2 font-medium">
              Recording Time Calculator
            </Link>{" "}
            — Find out how much recording time your storage can hold
          </li>
        </ul>

        <h2 className="text-xl font-bold text-[var(--foreground)] pt-4">
          Contact
        </h2>

        <p>
          Have a suggestion, found a bug, or want to collaborate? Reach out at{" "}
          <a
            href="mailto:contact@streamersize.com"
            className="text-[var(--primary)] underline underline-offset-2"
          >
            contact@streamersize.com
          </a>
        </p>
      </section>
    </div>
  );
}
