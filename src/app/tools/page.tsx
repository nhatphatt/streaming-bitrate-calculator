import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Streaming & Video Tools",
  description:
    "Free online tools for streamers and video creators: bitrate calculator, codec comparison, bandwidth test, upload time estimator, and recording time calculator.",
  alternates: { canonical: "/tools/" },
  openGraph: {
    title: "Free Streaming & Video Tools",
    description: "Free tools for streamers: bitrate calc, codec comparison, bandwidth test, and more.",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Streaming & Video Tools",
    description: "Free tools for streamers: bitrate calc, codec comparison, bandwidth test, and more.",
    images: ["/og-image.png"],
  },
};

const tools = [
  {
    href: "/",
    title: "Bitrate & Storage Calculator",
    description:
      "Calculate video file size, bitrate, and storage for any resolution (720p–8K), frame rate, and codec.",
    tag: "Most Popular",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></svg>
    ),
  },
  {
    href: "/compare/",
    title: "Codec Comparison",
    description:
      "Compare H.264, HEVC, VP9, AV1, and ProRes side-by-side with visual bar charts.",
    tag: "Visual",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
    ),
  },
  {
    href: "/tools/bandwidth-calculator/",
    title: "Bandwidth Calculator",
    description:
      "Check if your upload speed is fast enough for live streaming at any quality level.",
    tag: "Streamers",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
    ),
  },
  {
    href: "/tools/upload-time-calculator/",
    title: "Upload Time Calculator",
    description:
      "Estimate how long it takes to upload your video based on file size and internet speed.",
    tag: "Creators",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
    ),
  },
  {
    href: "/tools/recording-time-calculator/",
    title: "Recording Time Calculator",
    description:
      "Find out how many hours of video your hard drive, SSD, or SD card can hold.",
    tag: "Storage",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    ),
  },
  {
    href: "/tools/aspect-ratio-calculator/",
    title: "Aspect Ratio Calculator",
    description:
      "Calculate aspect ratio from any width and height. Presets for YouTube, TikTok, Instagram, and more.",
    tag: "New",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
    ),
  },
  {
    href: "/tools/compression-calculator/",
    title: "Compression Calculator",
    description:
      "Estimate how much smaller your video will be after converting to a different codec.",
    tag: "New",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
    ),
  },
  {
    href: "/tools/fps-calculator/",
    title: "FPS Calculator",
    description:
      "Calculate total frames from duration, convert frames to time, and plan slow-motion shots.",
    tag: "New",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
    ),
  },
  {
    href: "/tools/disk-space-planner/",
    title: "Disk Space Planner",
    description:
      "Plan your storage needs based on streaming schedule, resolution, and how long you keep recordings.",
    tag: "New",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
    ),
  },
];

export default function ToolsIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Free Streaming & Video Tools",
            description: "Free online tools for streamers and video creators.",
            url: "https://streamersize.com/tools/",
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
              <li className="text-[var(--foreground)] font-medium">Tools</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Free Streaming &amp; Video Tools
          </h1>
          <p className="text-[var(--muted-foreground)] text-lg max-w-2xl">
            Everything you need to plan your streaming setup, estimate storage,
            and optimize your video workflow — 100% free, no sign-up required.
          </p>
        </section>

        <section>
          <div className="grid gap-4 md:grid-cols-2">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 hover:border-[var(--primary)] hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-11 h-11 rounded-lg bg-[var(--accent)] flex items-center justify-center text-[var(--primary)]">
                    {tool.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-bold">{tool.title}</h2>
                      <span className="text-[10px] font-medium bg-[var(--muted)] text-[var(--muted-foreground)] px-2 py-0.5 rounded-full">
                        {tool.tag}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
