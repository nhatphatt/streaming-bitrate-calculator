import type { Metadata } from "next";
import Link from "next/link";
import { RESOLUTIONS, FPS_OPTIONS } from "@/data/presets";
import { calculate, toDurationSeconds } from "@/lib/calculate";


export const metadata: Metadata = {
  title: "Video File Size Calculator — All Resolutions & Frame Rates",
  description:
    "Browse file size calculators for every resolution (720p to 8K) and frame rate (24–120fps). Find the exact bitrate and storage you need.",
  alternates: {
    canonical: "/size/",
  },
  openGraph: {
    title: "Video File Size Calculator — All Resolutions & Frame Rates",
    description:
      "Browse file size calculators for every resolution (720p to 8K) and frame rate (24–120fps). Find the exact bitrate and storage you need.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Video File Size Calculator — All Resolutions & Frame Rates",
    description:
      "Browse file size calculators for every resolution (720p to 8K) and frame rate (24–120fps).",
  },
};

export default function SizeIndexPage() {
  return (
    <div className="flex flex-col gap-12">
      <section>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
          Video File Size Calculator — All Resolutions
        </h1>
        <p className="text-[var(--muted-foreground)] text-lg max-w-2xl">
          Choose your resolution and frame rate below to get accurate file size,
          bitrate, and storage estimates.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["/size/720p-streaming-bitrate/", "720p streaming bitrate"],
          ["/size/1080p-streaming-bitrate/", "1080p streaming bitrate"],
          ["/size/1440p-streaming-bitrate/", "1440p streaming bitrate"],
          ["/size/4k-streaming-bitrate/", "4K streaming bitrate"],
        ].map(([href, label]) => (
          <Link key={href} href={href} className="rounded-xl border border-[var(--border)] p-4 font-semibold hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors">
            {label}
          </Link>
        ))}
      </section>

      {/* === AD SLOT === */}

      {/* Link matrix with preview data */}
      <section>
        {RESOLUTIONS.map((res) => (
          <div key={res.slug} className="mb-10">
            <h2 className="text-xl font-bold mb-4">
              {res.label} ({res.width}&times;{res.height})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {FPS_OPTIONS.map((fps) => {
                const result = calculate({
                  resolution: res.slug,
                  fps: fps.value,
                  codec: "h264",
                  audioBitrateKbps: 128,
                  durationSeconds: toDurationSeconds(1, 0, 0),
                });
                return (
                  <Link
                    key={fps.slug}
                    href={`/size/${res.slug}-${fps.slug}/`}
                    className="block rounded-xl border border-[var(--border)] p-4 hover:border-[var(--primary)] hover:shadow-sm transition-all"
                  >
                    <div className="font-semibold mb-1">{fps.label}</div>
                    <div className="text-sm text-[var(--muted-foreground)]">
                      ~{result.fileSizeFormatted}/hr (H.264)
                    </div>
                    <div className="text-sm text-[var(--muted-foreground)]">
                      {result.totalBitrateMbps} Mbps
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* === AD SLOT === */}
    </div>
  );
}
