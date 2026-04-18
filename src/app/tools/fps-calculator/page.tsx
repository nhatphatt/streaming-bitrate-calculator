import type { Metadata } from "next";
import FpsCalculator from "@/components/FpsCalculator";
import RelatedTools from "@/components/RelatedTools";

export const metadata: Metadata = {
  title: "FPS Calculator — Frame Rate, Frame Count & Slow Motion Tool",
  description:
    "Calculate total frames from duration, convert frames to time, and plan slow-motion shots. Supports 24fps to 240fps. Free online tool.",
  alternates: { canonical: "/tools/fps-calculator/" },
  openGraph: {
    title: "FPS Calculator — Frame Rate & Slow Motion Tool",
    description: "Calculate frames, duration, and slow-motion playback for any frame rate.",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FPS Calculator",
    description: "Calculate frames, duration, and slow-motion for any FPS.",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    q: "How many frames are in 1 minute of 30fps video?",
    a: "At 30 frames per second, 1 minute of video contains exactly 1,800 frames (30 × 60 = 1,800).",
  },
  {
    q: "What is the difference between 30fps and 60fps?",
    a: "60fps captures twice as many frames per second as 30fps, resulting in smoother motion. 60fps is preferred for gaming and fast-action content, while 30fps is standard for most video content and uses less storage.",
  },
  {
    q: "How does slow motion work?",
    a: "Slow motion is achieved by recording at a higher frame rate (e.g., 120fps) and playing back at a standard rate (e.g., 30fps). This creates a 4× slow-motion effect because 120÷30 = 4.",
  },
  {
    q: "What FPS should I use for streaming?",
    a: "Most streamers use 30fps or 60fps. 60fps is ideal for fast-paced games (FPS, racing), while 30fps works well for slower content (strategy, just chatting). Higher FPS requires more bitrate and CPU/GPU power.",
  },
];

export default function FpsCalcPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "FPS Calculator",
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
              { "@type": "ListItem", position: 3, name: "FPS Calculator", item: "https://streamersize.com/tools/fps-calculator/" },
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
              <li className="text-[var(--foreground)] font-medium">FPS Calculator</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            FPS Calculator — Frames, Duration &amp; Slow Motion
          </h1>
          <p className="text-[var(--muted-foreground)] text-lg max-w-2xl">
            Calculate total frames from duration, convert frame count to time, or plan slow-motion shots. Supports all common frame rates from 24fps to 240fps.
          </p>
        </section>

        <section>
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-sm">
            <FpsCalculator />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Understanding Frame Rates</h2>
          <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
            Frame rate (FPS) is the number of individual images displayed per second in a video. Higher frame rates produce smoother motion but require more storage, bandwidth, and processing power. The most common frame rates are <strong>24fps</strong> (cinema), <strong>30fps</strong> (standard video), and <strong>60fps</strong> (gaming/sports).
          </p>
          <p className="text-[var(--muted-foreground)] leading-relaxed">
            For streaming, your choice of frame rate directly impacts your required bitrate. Use our{" "}
            <a href="/" className="text-[var(--primary)] underline underline-offset-2">Bitrate Calculator</a>{" "}
            to see exactly how FPS affects file size and bandwidth needs.
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

        <RelatedTools current="/tools/fps-calculator/" />
      </div>
    </>
  );
}
