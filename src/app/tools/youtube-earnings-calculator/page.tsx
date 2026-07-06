import type { Metadata } from "next";
import Link from "next/link";
import YoutubeEarningsCalculator from "@/components/YoutubeEarningsCalculator";
import RelatedTools from "@/components/RelatedTools";
import AdSlot from "@/components/AdSlot";
import SponsoredButton from "@/components/SponsoredButton";

export const metadata: Metadata = {
  title:
    "YouTube Earnings Calculator (2026) — Estimate Your Channel Revenue",
  description:
    "Calculate how much you could earn on YouTube. Free estimator using real CPM data by niche, audience geography, monetized rate, and Shorts vs long-form formats.",
  alternates: { canonical: "/tools/youtube-earnings-calculator/" },
  openGraph: {
    title: "YouTube Earnings Calculator (2026)",
    description:
      "Estimate your YouTube channel revenue from views, niche CPM, geography, and format. Free, no signup.",
    type: "website",
    url: "/tools/youtube-earnings-calculator/",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "YouTube Earnings Calculator — StreamerSize" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube Earnings Calculator (2026)",
    description:
      "Estimate your YouTube revenue from views, niche, and audience geography.",
    images: ["/og-image.png"],
  },
};

const FAQS = [
  {
    q: "How accurate is this YouTube earnings calculator?",
    a: "The estimate is based on industry-public CPM data for 2024–2026 and YouTube's standard 55% creator share for long-form (45% for Shorts). Real earnings can vary 50% in either direction due to audience retention, ad fill rate, seasonality, and niche-specific advertiser demand. Use it as a planning baseline, not a guarantee.",
  },
  {
    q: "What is a good RPM on YouTube?",
    a: "RPM (revenue per 1,000 views) varies wildly by niche. Tier-1 niches like finance and B2B tech can earn $15–$30 RPM. Lifestyle and gaming average $2–$6 RPM. Shorts typically earn $0.05–$0.10 per 1,000 views. Anything above $5 RPM for general content is considered strong.",
  },
  {
    q: "How much do YouTubers make per 1 million views?",
    a: "For long-form video, $1,000–$10,000 per million views is a realistic range depending on niche and audience. Finance channels can hit $20K+ per million views; gaming channels often see $2K–$4K per million. Shorts pay much less — about $50–$200 per million views.",
  },
  {
    q: "Why is my CPM lower than the calculator estimate?",
    a: "Several factors lower effective CPM: skipped ads, viewers using ad blockers, audience under 18, COPPA-flagged kids content, audiences in low-CPM geographies, ads served during low-demand seasons (Q1), or YouTube applying ad-friendly content limits to certain videos.",
  },
  {
    q: "Do Shorts earn less than long-form videos?",
    a: "Yes. Shorts use a separate revenue pool — ads play between Shorts in the feed and revenue is split among all eligible Shorts. Creators get 45% of the pool's allocation. This works out to roughly $0.05–$0.10 per 1,000 Shorts views vs $2–$30 per 1,000 long-form views.",
  },
  {
    q: "How does YouTube actually pay creators?",
    a: "YouTube pays via Google AdSense once your balance reaches $100. Payments arrive around the 21st of each month for the previous month's earnings. You need a tax form (W-9 in the US, W-8BEN internationally) on file before YouTube will pay out.",
  },
];

export default function YoutubeEarningsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "YouTube Earnings Calculator",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description:
              "Estimate YouTube channel revenue from views, niche CPM, geography, and content format.",
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
              { "@type": "ListItem", position: 3, name: "YouTube Earnings Calculator", item: "https://streamersize.com/tools/youtube-earnings-calculator/" },
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
            mainEntity: FAQS.map((f) => ({
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
            <ol className="flex items-center gap-1.5 flex-wrap">
              <li><Link href="/" className="hover:text-[var(--primary)] transition-colors">Home</Link></li>
              <li>/</li>
              <li><Link href="/tools/" className="hover:text-[var(--primary)] transition-colors">Tools</Link></li>
              <li>/</li>
              <li className="text-[var(--foreground)] font-medium">YouTube Earnings Calculator</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            YouTube Earnings Calculator
          </h1>
          <p className="text-[var(--muted-foreground)] text-lg max-w-2xl">
            Estimate how much your YouTube channel could earn from ads — based on
            views, niche CPM, audience geography, and whether you publish long-form
            or Shorts.
          </p>
        </section>

        <section>
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-sm">
            <YoutubeEarningsCalculator />
          </div>
        </section>

        <SponsoredButton />

        <AdSlot />

        <div className="flex flex-col gap-12">
          <section>
            <h2 className="text-2xl font-bold mb-4">
              How does YouTube monetization actually work?
            </h2>
            <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
              YouTube&apos;s Partner Program (YPP) pays creators a share of ad revenue
              served against their videos. The advertiser pays a <strong>CPM (cost per
              mille)</strong> — the price per 1,000 ad impressions. YouTube keeps 45% and the
              creator keeps 55% for long-form videos, and a smaller cut for Shorts via
              the Shorts Fund / ad revenue pool.
            </p>
            <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
              Not every view is monetized. Ad blockers, skipped ads, kids&apos; content
              (COPPA), and ad-unfriendly topics reduce the <strong>monetized view rate</strong>.
              The realistic monetized view rate sits between <strong>40–60%</strong> for most
              English-language channels.
            </p>
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              CPM also depends heavily on your audience&apos;s country. Tier-1 markets
              (US, Canada, UK, Australia, Germany) command 2–3× higher CPMs than
              global tier-2/3 markets like India, Brazil, or Southeast Asia.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Average CPM by niche (2026 estimates)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)] text-left">
                    <th className="pb-3 pr-4 font-semibold">Niche</th>
                    <th className="pb-3 pr-4 font-semibold">Typical CPM (USD)</th>
                    <th className="pb-3 font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody className="[&_tr]:border-b [&_tr]:border-[var(--border)] [&_tr:last-child]:border-0">
                  <tr><td className="py-3 pr-4 font-medium">Finance / Investing</td><td className="py-3 pr-4 tabular-nums">$20–$50</td><td className="py-3 text-[var(--muted-foreground)]">Highest CPMs of any niche</td></tr>
                  <tr><td className="py-3 pr-4 font-medium">Tech / SaaS reviews</td><td className="py-3 pr-4 tabular-nums">$12–$25</td><td className="py-3 text-[var(--muted-foreground)]">B2B advertisers, high purchase intent</td></tr>
                  <tr><td className="py-3 pr-4 font-medium">Business / Marketing</td><td className="py-3 pr-4 tabular-nums">$10–$22</td><td className="py-3 text-[var(--muted-foreground)]">Course and tool sponsors</td></tr>
                  <tr><td className="py-3 pr-4 font-medium">DIY / How-to</td><td className="py-3 pr-4 tabular-nums">$8–$15</td><td className="py-3 text-[var(--muted-foreground)]">Home improvement, productivity</td></tr>
                  <tr><td className="py-3 pr-4 font-medium">Education</td><td className="py-3 pr-4 tabular-nums">$6–$12</td><td className="py-3 text-[var(--muted-foreground)]">Strong watch time, mid CPMs</td></tr>
                  <tr><td className="py-3 pr-4 font-medium">Lifestyle / Vlog</td><td className="py-3 pr-4 tabular-nums">$5–$10</td><td className="py-3 text-[var(--muted-foreground)]">Average advertiser interest</td></tr>
                  <tr><td className="py-3 pr-4 font-medium">Beauty / Fashion</td><td className="py-3 pr-4 tabular-nums">$5–$10</td><td className="py-3 text-[var(--muted-foreground)]">Strong sponsorship overlay</td></tr>
                  <tr><td className="py-3 pr-4 font-medium">Entertainment</td><td className="py-3 pr-4 tabular-nums">$3–$7</td><td className="py-3 text-[var(--muted-foreground)]">Mass appeal, mid CPMs</td></tr>
                  <tr><td className="py-3 pr-4 font-medium">Gaming</td><td className="py-3 pr-4 tabular-nums">$2–$6</td><td className="py-3 text-[var(--muted-foreground)]">Low CPM, but huge volume</td></tr>
                  <tr><td className="py-3 pr-4 font-medium">Music</td><td className="py-3 pr-4 tabular-nums">$2–$5</td><td className="py-3 text-[var(--muted-foreground)]">Royalty splits reduce ad RPM</td></tr>
                  <tr><td className="py-3 pr-4 font-medium">Kids / Family</td><td className="py-3 pr-4 tabular-nums">$1–$3</td><td className="py-3 text-[var(--muted-foreground)]">COPPA limits ad personalization</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[var(--muted-foreground)] mt-3">
              Sources: aggregated from public Social Blade ranges, AdSense reports
              shared by creators, and TubeBuddy / VidIQ industry surveys 2024–2026.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Frequently asked questions</h2>
            <div className="space-y-3">
              {FAQS.map(({ q, a }) => (
                <details key={q} className="border border-[var(--border)] rounded-lg">
                  <summary className="cursor-pointer px-4 py-3 font-medium">{q}</summary>
                  <p className="px-4 pb-3 text-[var(--muted-foreground)] leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </section>

          <RelatedTools current="/tools/youtube-earnings-calculator/" />
        </div>
      </div>
    </>
  );
}
