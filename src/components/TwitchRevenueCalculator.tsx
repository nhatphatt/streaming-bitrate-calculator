"use client";

import { useState, useMemo } from "react";

/**
 * Twitch Revenue Calculator
 *
 * Estimates a streamer's monthly revenue from:
 * 1. Subs (T1/T2/T3) — creator gets 50% standard, 60% Partner Plus, 70% top-tier
 * 2. Bits — $0.01 per bit cheered (Twitch keeps ~30% of bit purchase, but creator gets full $0.01/bit)
 * 3. Ads — ~$3.50 CPM Twitch standard, creator gets 55%
 * 4. Donations / Tips — direct via streamlabs/streamelements, creator keeps 95%+
 * 5. Sponsorships (manual, creator-set)
 *
 * Industry-public numbers 2024–2026.
 */

const SUB_TIERS = {
  t1: { price: 4.99, label: "Tier 1 ($4.99)" },
  t2: { price: 9.99, label: "Tier 2 ($9.99)" },
  t3: { price: 24.99, label: "Tier 3 ($24.99)" },
};

const SPLIT_PRESETS = [
  { id: "standard", label: "Standard Affiliate / Partner (50/50)", split: 0.5 },
  { id: "plus", label: "Partner Plus (60/40 up to $100K)", split: 0.6 },
  { id: "top", label: "Top streamers / custom (70/30)", split: 0.7 },
];

function fmtUSD(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 10_000) return `$${(n / 1000).toFixed(1)}K`;
  if (n >= 1000) return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  return `$${n.toFixed(2)}`;
}

export default function TwitchRevenueCalculator() {
  // Sub counts
  const [tier1Subs, setTier1Subs] = useState(100);
  const [tier2Subs, setTier2Subs] = useState(5);
  const [tier3Subs, setTier3Subs] = useState(2);
  const [splitId, setSplitId] = useState("standard");

  // Bits
  const [bitsPerMonth, setBitsPerMonth] = useState(50_000);

  // Ads
  const [avgViewers, setAvgViewers] = useState(50);
  const [hoursPerMonth, setHoursPerMonth] = useState(80);
  const [adMinPerHour, setAdMinPerHour] = useState(3);

  // Donations
  const [donationsUsd, setDonationsUsd] = useState(200);

  // Sponsorships
  const [sponsorshipsUsd, setSponsorshipsUsd] = useState(0);

  const split = SPLIT_PRESETS.find((s) => s.id === splitId)!;

  const result = useMemo(() => {
    // Subs
    const subGrossT1 = tier1Subs * SUB_TIERS.t1.price;
    const subGrossT2 = tier2Subs * SUB_TIERS.t2.price;
    const subGrossT3 = tier3Subs * SUB_TIERS.t3.price;
    const subGross = subGrossT1 + subGrossT2 + subGrossT3;
    const subRevenue = subGross * split.split;

    // Bits — creator gets exactly $0.01 per bit
    const bitsRevenue = bitsPerMonth * 0.01;

    // Ads — Twitch CPM ~$3.50, creator gets 55%, ad-eligible viewer-hours
    const totalViewerHours = avgViewers * hoursPerMonth;
    // assume ~1 ad break per minute counted, but only adMinPerHour minutes show ads
    const adImpressions = totalViewerHours * adMinPerHour; // 1 impression per ad-minute per viewer
    const adRevenue = (adImpressions / 1000) * 3.5 * 0.55;

    // Donations — assume creator keeps 95% (after PayPal/processor fees)
    const donationRevenue = donationsUsd * 0.95;

    // Sponsorships
    const sponsorshipRevenue = sponsorshipsUsd;

    const total =
      subRevenue +
      bitsRevenue +
      adRevenue +
      donationRevenue +
      sponsorshipRevenue;

    return {
      subRevenue,
      subCount: tier1Subs + tier2Subs + tier3Subs,
      bitsRevenue,
      adRevenue,
      adImpressions: Math.round(adImpressions),
      donationRevenue,
      sponsorshipRevenue,
      total,
      yearlyTotal: total * 12,
      breakdown: [
        { label: "Subscriptions", amount: subRevenue, color: "bg-purple-500" },
        { label: "Bits", amount: bitsRevenue, color: "bg-amber-500" },
        { label: "Ads", amount: adRevenue, color: "bg-blue-500" },
        { label: "Donations / Tips", amount: donationRevenue, color: "bg-green-500" },
        { label: "Sponsorships", amount: sponsorshipRevenue, color: "bg-pink-500" },
      ].filter((b) => b.amount > 0),
    };
  }, [
    tier1Subs,
    tier2Subs,
    tier3Subs,
    split.split,
    bitsPerMonth,
    avgViewers,
    hoursPerMonth,
    adMinPerHour,
    donationsUsd,
    sponsorshipsUsd,
  ]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      {/* ===== INPUTS ===== */}
      <div className="space-y-5" aria-label="Channel inputs">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
          <h2 className="text-lg font-bold">Your channel</h2>
        </div>

        {/* Subs */}
        <fieldset className="rounded-lg border border-[var(--border)] p-4">
          <legend className="px-2 text-sm font-semibold">Subscriptions</legend>
          <div className="grid grid-cols-3 gap-2">
            <label className="text-xs text-[var(--muted-foreground)]">
              Tier 1 ($4.99)
              <input
                type="number"
                min={0}
                value={tier1Subs}
                onChange={(e) => setTier1Subs(Math.max(0, Number(e.target.value) || 0))}
                className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </label>
            <label className="text-xs text-[var(--muted-foreground)]">
              Tier 2 ($9.99)
              <input
                type="number"
                min={0}
                value={tier2Subs}
                onChange={(e) => setTier2Subs(Math.max(0, Number(e.target.value) || 0))}
                className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </label>
            <label className="text-xs text-[var(--muted-foreground)]">
              Tier 3 ($24.99)
              <input
                type="number"
                min={0}
                value={tier3Subs}
                onChange={(e) => setTier3Subs(Math.max(0, Number(e.target.value) || 0))}
                className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </label>
          </div>
          <label className="block mt-3 text-xs text-[var(--muted-foreground)]">
            Revenue split
            <select
              value={splitId}
              onChange={(e) => setSplitId(e.target.value)}
              className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              {SPLIT_PRESETS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </label>
        </fieldset>

        {/* Bits */}
        <fieldset className="rounded-lg border border-[var(--border)] p-4">
          <legend className="px-2 text-sm font-semibold">Bits cheered per month</legend>
          <div className="flex items-center gap-3 mt-1">
            <input
              type="number"
              min={0}
              step={1000}
              value={bitsPerMonth}
              onChange={(e) => setBitsPerMonth(Math.max(0, Number(e.target.value) || 0))}
              className="flex-1 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] tabular-nums"
            />
            <span className="text-xs text-[var(--muted-foreground)] whitespace-nowrap">= ${(bitsPerMonth * 0.01).toFixed(2)}</span>
          </div>
          <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">
            Each bit pays the streamer exactly <strong>$0.01</strong>.
          </p>
        </fieldset>

        {/* Ads */}
        <fieldset className="rounded-lg border border-[var(--border)] p-4">
          <legend className="px-2 text-sm font-semibold">Ads</legend>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-[var(--muted-foreground)]">
              Avg concurrent viewers
              <input
                type="number"
                min={0}
                value={avgViewers}
                onChange={(e) => setAvgViewers(Math.max(0, Number(e.target.value) || 0))}
                className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </label>
            <label className="text-xs text-[var(--muted-foreground)]">
              Streaming hours / month
              <input
                type="number"
                min={0}
                max={744}
                value={hoursPerMonth}
                onChange={(e) => setHoursPerMonth(Math.max(0, Math.min(744, Number(e.target.value) || 0)))}
                className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </label>
          </div>
          <label className="block mt-3 text-xs text-[var(--muted-foreground)]">
            Ad minutes per hour: <strong className="text-[var(--foreground)]">{adMinPerHour}</strong>
            <input
              type="range"
              min={0}
              max={8}
              step={1}
              value={adMinPerHour}
              onChange={(e) => setAdMinPerHour(Number(e.target.value))}
              className="w-full mt-1"
            />
            <span className="text-[10px]">3 min/hr is typical for Affiliates; Partners can run more.</span>
          </label>
        </fieldset>

        {/* Donations + Sponsorships */}
        <fieldset className="rounded-lg border border-[var(--border)] p-4">
          <legend className="px-2 text-sm font-semibold">Other income</legend>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-[var(--muted-foreground)]">
              Donations / tips ($/mo)
              <input
                type="number"
                min={0}
                value={donationsUsd}
                onChange={(e) => setDonationsUsd(Math.max(0, Number(e.target.value) || 0))}
                className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </label>
            <label className="text-xs text-[var(--muted-foreground)]">
              Sponsorships ($/mo)
              <input
                type="number"
                min={0}
                value={sponsorshipsUsd}
                onChange={(e) => setSponsorshipsUsd(Math.max(0, Number(e.target.value) || 0))}
                className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </label>
          </div>
        </fieldset>
      </div>

      {/* ===== OUTPUTS ===== */}
      <div className="space-y-5" aria-live="polite" aria-label="Revenue breakdown">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <h2 className="text-lg font-bold">Estimated revenue</h2>
        </div>

        {/* Total */}
        <div className="rounded-xl border-2 border-[var(--primary-20)] bg-[var(--accent)] p-6 text-center">
          <div className="text-sm text-[var(--muted-foreground)] mb-2">Estimated monthly take-home</div>
          <div className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--primary)] tabular-nums">
            {fmtUSD(result.total)}
          </div>
          <div className="text-xs text-[var(--muted-foreground)] mt-2 tabular-nums">
            Yearly: <strong className="text-[var(--foreground)]">{fmtUSD(result.yearlyTotal)}</strong>
          </div>
        </div>

        {/* Stacked bar */}
        {result.total > 0 && (
          <div>
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-[var(--muted)]" role="img" aria-label="Revenue source breakdown">
              {result.breakdown.map((b) => (
                <div
                  key={b.label}
                  className={b.color}
                  style={{ width: `${(b.amount / result.total) * 100}%` }}
                  title={`${b.label}: ${fmtUSD(b.amount)}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Breakdown rows */}
        <div className="space-y-2">
          {result.breakdown.map((b) => (
            <div
              key={b.label}
              className="flex items-center justify-between rounded-lg border border-[var(--border)] px-4 py-2.5"
            >
              <div className="flex items-center gap-2.5">
                <span className={`inline-block h-2.5 w-2.5 rounded-full ${b.color}`} aria-hidden="true" />
                <span className="text-sm font-medium">{b.label}</span>
              </div>
              <div className="text-sm tabular-nums">
                <strong>{fmtUSD(b.amount)}</strong>
                <span className="text-xs text-[var(--muted-foreground)] ml-2">
                  {((b.amount / result.total) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-xs text-[var(--muted-foreground)] leading-relaxed">
          <strong className="text-[var(--foreground)]">Pre-tax estimate.</strong> Twitch ad
          revenue depends on ad fill rate, viewer ad-blocker usage, audience geography, and
          whether you use the Ads Incentive Program. Actual payouts can deviate ±30% from
          the model. US streamers also need to set aside ~25–30% for self-employment taxes.
        </div>

        {/* CTA */}
        <div className="rounded-xl border border-dashed border-[var(--primary-30)] bg-[var(--accent)] p-5">
          <h3 className="text-sm font-semibold mb-2">Grow your Twitch revenue</h3>
          <ul className="text-xs text-[var(--muted-foreground)] space-y-1.5 list-disc pl-5">
            <li>Hit <strong className="text-[var(--foreground)]">Partner Plus</strong>: 350+ subs at T1 equivalent unlocks the 60/40 split</li>
            <li>Use the <strong className="text-[var(--foreground)]">Ads Incentive Program</strong> — Twitch pays a guaranteed CPM for hitting ad-minute targets</li>
            <li>Multi-stream to <strong className="text-[var(--foreground)]">YouTube Live + Kick</strong> to layer monetization (Twitch exclusivity is opt-in via Plus)</li>
            <li>Add <strong className="text-[var(--foreground)]">memberships, paid emotes, and Bits-only emote tiers</strong> to drive recurring engagement</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
