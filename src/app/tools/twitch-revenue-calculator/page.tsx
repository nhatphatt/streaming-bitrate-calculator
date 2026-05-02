import type { Metadata } from "next";
import Link from "next/link";
import TwitchRevenueCalculator from "@/components/TwitchRevenueCalculator";
import RelatedTools from "@/components/RelatedTools";

export const metadata: Metadata = {
  title:
    "Twitch Revenue Calculator (2026) — Subs, Bits, Ads & Donations",
  description:
    "Estimate Twitch streamer income from subscriptions, bits, ads, and donations. Free calculator with Affiliate, Partner, and Partner Plus revenue splits.",
  alternates: { canonical: "/tools/twitch-revenue-calculator/" },
  openGraph: {
    title: "Twitch Revenue Calculator (2026)",
    description:
      "Estimate Twitch monthly take-home from subs, bits, ads, donations, and sponsorships. Free, no signup.",
    type: "website",
    url: "/tools/twitch-revenue-calculator/",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Twitch Revenue Calculator — StreamerSize" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Twitch Revenue Calculator (2026)",
    description: "Estimate Twitch revenue from subs, bits, ads, and donations.",
    images: ["/og-image.png"],
  },
};

const FAQS = [
  {
    q: "How much does a Twitch streamer make per subscriber?",
    a: "Standard Affiliates and Partners receive 50% of each subscription: $2.50 per Tier 1 ($4.99), $5 per Tier 2 ($9.99), and $12.50 per Tier 3 ($24.99). Partner Plus streamers earn 60% on the first $100K of subscription revenue annually. A small set of top streamers negotiate 70/30 splits.",
  },
  {
    q: "How much does Twitch pay per bit?",
    a: "Twitch pays the streamer exactly $0.01 per bit cheered. So 100 bits = $1, 10,000 bits = $100, and 1 million bits = $10,000. Bits are purchased by viewers in bundles, but the conversion rate to streamer payout is always 1 cent per bit.",
  },
  {
    q: "How much does Twitch ad revenue pay?",
    a: "Twitch's typical ad CPM is around $3.50 in the US with creators receiving 55%. Real revenue per 1,000 viewer-hours depends on ad-minutes-per-hour (typically 3 min/hr) and ad fill rate. The Ads Incentive Program (AIP) offers guaranteed CPMs of $1.50-$5.00 to creators who hit ad-minute targets.",
  },
  {
    q: "What is Twitch Partner Plus?",
    a: "Partner Plus is a tier launched in 2023 that offers a 60/40 split (creator/Twitch) on the first $100K of net subscription revenue per year. To qualify you need 350+ recurring T1-equivalent subs (T2 counts as 2, T3 counts as 6) for 3 consecutive months. Partner Plus Tier 2 unlocks 70/30 at 700+ recurring subs.",
  },
  {
    q: "Do Twitch streamers pay taxes?",
    a: "Yes. In the US, Twitch income is self-employment income reported on Schedule C of your tax return. Set aside roughly 25-30% for federal income tax + self-employment tax (15.3%). You will receive a 1099-NEC from Twitch if you earn $600+ in a calendar year. International streamers receive different forms based on their country.",
  },
  {
    q: "Can you make a living on Twitch?",
    a: "Yes, but it requires consistency. A streamer with 100 stable subs at T1 + 50 average viewers running 80 hours/month + modest donations and bits typically grosses $700-$1,200/month. Reaching $3,000+/month usually requires 300+ subs and 150+ average viewers, plus active sponsorship hunting.",
  },
];

export default function TwitchRevenuePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Twitch Revenue Calculator",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description:
              "Estimate Twitch streamer monthly revenue from subscriptions, bits, ads, donations, and sponsorships.",
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
              { "@type": "ListItem", position: 3, name: "Twitch Revenue Calculator", item: "https://streamersize.com/tools/twitch-revenue-calculator/" },
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
              <li className="text-[var(--foreground)] font-medium">Twitch Revenue Calculator</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Twitch Revenue Calculator
          </h1>
          <p className="text-[var(--muted-foreground)] text-lg max-w-2xl">
            Estimate your monthly Twitch take-home from subscriptions, bits, ads,
            donations, and sponsorships. Supports Affiliate, Partner, and Partner
            Plus revenue splits.
          </p>
        </section>

        <section>
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-sm">
            <TwitchRevenueCalculator />
          </div>
        </section>

        <div className="flex flex-col gap-12">
          <section>
            <h2 className="text-2xl font-bold mb-4">
              How Twitch monetization works
            </h2>
            <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
              Twitch streamers earn from <strong>five primary revenue sources</strong>: paid
              channel subscriptions, bits (Twitch&apos;s virtual currency), pre-roll and
              mid-roll ads, viewer donations through third-party tip jars, and brand
              sponsorships. The mix shifts dramatically as a channel grows — early streamers
              rely mostly on tips and bits, while established Partners earn 60–80% of
              their income from subs.
            </p>
            <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
              The standard sub split is <strong>50/50</strong>. Twitch&apos;s 2023 Partner Plus
              program raised this to <strong>60/40</strong> on the first $100K of net sub
              revenue for streamers who hold 350+ recurring T1-equivalent subs for three
              consecutive months. A second Plus tier introduced in 2024 offers a
              <strong> 70/30</strong> split at 700+ recurring subs.
            </p>
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              Bits pay a flat <strong>$0.01 per bit</strong> regardless of bundle size or
              streamer tier. Ad revenue is much harder to predict — it depends on ad fill
              rate, audience geography, time of year, and whether you opt into the Ads
              Incentive Program (AIP), which pays guaranteed CPMs for hitting ad-minute
              targets each month.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Sub revenue at a glance</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)] text-left">
                    <th className="pb-3 pr-4 font-semibold">Tier</th>
                    <th className="pb-3 pr-4 font-semibold">Viewer pays</th>
                    <th className="pb-3 pr-4 font-semibold">Standard 50%</th>
                    <th className="pb-3 pr-4 font-semibold">Plus 60%</th>
                    <th className="pb-3 font-semibold">Top 70%</th>
                  </tr>
                </thead>
                <tbody className="[&_tr]:border-b [&_tr]:border-[var(--border)] [&_tr:last-child]:border-0">
                  <tr><td className="py-3 pr-4 font-medium">Tier 1</td><td className="py-3 pr-4 tabular-nums">$4.99</td><td className="py-3 pr-4 tabular-nums">$2.50</td><td className="py-3 pr-4 tabular-nums">$3.00</td><td className="py-3 tabular-nums">$3.49</td></tr>
                  <tr><td className="py-3 pr-4 font-medium">Tier 2</td><td className="py-3 pr-4 tabular-nums">$9.99</td><td className="py-3 pr-4 tabular-nums">$5.00</td><td className="py-3 pr-4 tabular-nums">$5.99</td><td className="py-3 tabular-nums">$6.99</td></tr>
                  <tr><td className="py-3 pr-4 font-medium">Tier 3</td><td className="py-3 pr-4 tabular-nums">$24.99</td><td className="py-3 pr-4 tabular-nums">$12.50</td><td className="py-3 pr-4 tabular-nums">$14.99</td><td className="py-3 tabular-nums">$17.49</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[var(--muted-foreground)] mt-3">
              Prime subs and Gift subs count toward Plus eligibility but pay slightly
              less due to Twitch&apos;s subsidy structure.
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

          <RelatedTools current="/tools/twitch-revenue-calculator/" />
        </div>
      </div>
    </>
  );
}
