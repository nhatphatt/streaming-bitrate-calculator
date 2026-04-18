import type { Metadata } from "next";
import AspectRatioCalculator from "@/components/AspectRatioCalculator";
import RelatedTools from "@/components/RelatedTools";

export const metadata: Metadata = {
  title: "Aspect Ratio Calculator — Free Online Tool for Video & Images",
  description:
    "Calculate aspect ratio, resize dimensions, and find the perfect resolution for YouTube, TikTok, Instagram, and more. 100% free, no signup.",
  alternates: { canonical: "/tools/aspect-ratio-calculator/" },
  openGraph: {
    title: "Aspect Ratio Calculator — Free Online Tool",
    description: "Calculate aspect ratio and resize dimensions for any platform.",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aspect Ratio Calculator",
    description: "Calculate aspect ratio for YouTube, TikTok, Instagram, and more.",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    q: "What aspect ratio is 1920x1080?",
    a: "1920×1080 is a 16:9 aspect ratio, also known as Full HD or 1080p. This is the standard for YouTube, Twitch, and most TV content.",
  },
  {
    q: "What is the best aspect ratio for YouTube?",
    a: "YouTube uses 16:9 as its standard aspect ratio. The recommended resolution is 1920×1080 (1080p) or 3840×2160 (4K). YouTube Shorts use 9:16 (1080×1920).",
  },
  {
    q: "What aspect ratio does TikTok use?",
    a: "TikTok uses 9:16 (vertical video). The recommended resolution is 1080×1920 pixels. This is the same ratio used by Instagram Reels and YouTube Shorts.",
  },
  {
    q: "How do I calculate aspect ratio?",
    a: "Divide both the width and height by their greatest common divisor (GCD). For example, 1920÷120 = 16 and 1080÷120 = 9, giving you 16:9.",
  },
];

export default function AspectRatioCalcPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Aspect Ratio Calculator",
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
              { "@type": "ListItem", position: 3, name: "Aspect Ratio Calculator", item: "https://streamersize.com/tools/aspect-ratio-calculator/" },
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
              <li className="text-[var(--foreground)] font-medium">Aspect Ratio Calculator</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Aspect Ratio Calculator
          </h1>
          <p className="text-[var(--muted-foreground)] text-lg max-w-2xl">
            Calculate aspect ratio from any width and height. Find the perfect resolution for YouTube, TikTok, Instagram, Twitch, and more.
          </p>
        </section>

        <section>
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-sm">
            <AspectRatioCalculator />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Understanding Aspect Ratios</h2>
          <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
            An aspect ratio describes the proportional relationship between a video or image&apos;s width and height. The most common aspect ratio for video is <strong>16:9</strong>, used by YouTube, Twitch, and most modern displays. Vertical content on TikTok and Instagram Reels uses <strong>9:16</strong>.
          </p>
          <p className="text-[var(--muted-foreground)] leading-relaxed">
            Choosing the correct aspect ratio ensures your content displays without black bars or cropping. Use our calculator above to find the right dimensions, or pick a platform preset to get started instantly.
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

        <RelatedTools current="/tools/aspect-ratio-calculator/" />
      </div>
    </>
  );
}
