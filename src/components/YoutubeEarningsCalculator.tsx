"use client";

import { useState, useMemo } from "react";

/**
 * YouTube Earnings Calculator
 *
 * Estimates revenue based on:
 * - Views per period
 * - CPM (cost per 1,000 monetized impressions) — varies wildly by niche/geo
 * - Monetized view rate (typically 40-60% — Shorts are lower)
 * - YouTube takes 45% of ad revenue, creator gets 55%
 *
 * References (industry-public, 2024-2026):
 * - US average CPM: $5–$15 across niches
 * - Finance/Tech CPMs: $20–$50+
 * - Gaming CPMs: $2–$7
 * - Shorts RPM: $0.05–$0.10 per 1,000 views
 * - Creator share: 55% (long-form), 45% (Shorts)
 */

const NICHES: { id: string; label: string; cpm: number; rpm: number; note: string }[] = [
  { id: "finance", label: "Finance / Investing", cpm: 30, rpm: 22, note: "Highest CPMs. Crypto, stocks, real estate." },
  { id: "tech", label: "Tech / SaaS reviews", cpm: 18, rpm: 14, note: "B2B advertisers, high intent." },
  { id: "business", label: "Business / Marketing", cpm: 16, rpm: 12, note: "Course and SaaS sponsors." },
  { id: "diy", label: "DIY / How-to", cpm: 12, rpm: 9, note: "Home improvement, tutorials." },
  { id: "lifestyle", label: "Lifestyle / Vlog", cpm: 8, rpm: 6, note: "Average advertiser interest." },
  { id: "education", label: "Education", cpm: 9, rpm: 7, note: "Strong watch time, mid CPMs." },
  { id: "beauty", label: "Beauty / Fashion", cpm: 7, rpm: 5, note: "Strong sponsorship overlay." },
  { id: "gaming", label: "Gaming", cpm: 4, rpm: 3, note: "Low CPM but huge volume." },
  { id: "entertainment", label: "Entertainment / Comedy", cpm: 5, rpm: 4, note: "Mass appeal, mid CPMs." },
  { id: "music", label: "Music", cpm: 3, rpm: 2, note: "Royalty splits reduce ad RPM." },
  { id: "kids", label: "Kids / Family", cpm: 2, rpm: 1.5, note: "COPPA limits ad personalization." },
  { id: "custom", label: "Custom (set CPM manually)", cpm: 0, rpm: 0, note: "" },
];

const GEO_MULTIPLIERS = [
  { id: "us", label: "Mostly US/CA/UK/AU (Tier 1)", mult: 1.0 },
  { id: "mixed", label: "Mixed Western + global", mult: 0.7 },
  { id: "global", label: "Mostly global (India, LATAM, SEA)", mult: 0.35 },
];

const FORMATS = [
  { id: "longform", label: "Long-form videos", creatorShare: 0.55 },
  { id: "shorts", label: "YouTube Shorts", creatorShare: 0.45 },
];

function fmt(n: number): string {
  if (n >= 1000) return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (n >= 100) return n.toFixed(0);
  return n.toFixed(2);
}

function fmtUSD(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 10_000) return `$${(n / 1000).toFixed(1)}K`;
  if (n >= 1000) return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  return `$${n.toFixed(2)}`;
}

export default function YoutubeEarningsCalculator() {
  const [viewsPerMonth, setViewsPerMonth] = useState(100_000);
  const [nicheId, setNicheId] = useState("gaming");
  const [geoId, setGeoId] = useState("mixed");
  const [formatId, setFormatId] = useState("longform");
  const [customCpm, setCustomCpm] = useState(8);
  const [monetizedRate, setMonetizedRate] = useState(50); // %

  const niche = NICHES.find((n) => n.id === nicheId)!;
  const geo = GEO_MULTIPLIERS.find((g) => g.id === geoId)!;
  const format = FORMATS.find((f) => f.id === formatId)!;
  const isShorts = format.id === "shorts";
  const isCustom = niche.id === "custom";

  const result = useMemo(() => {
    // Effective CPM after geo + niche
    const baseCpm = isCustom ? customCpm : niche.cpm;
    const baseRpm = isCustom ? customCpm * 0.55 * 0.5 : niche.rpm;
    const effectiveCpm = baseCpm * geo.mult;
    const effectiveRpm = baseRpm * geo.mult;

    // For Shorts, RPM is dramatically lower regardless of niche
    const shortsRpm = 0.06 * geo.mult; // ~$0.05–$0.10 per 1k industry avg

    // Monthly earnings
    let monthlyLow: number;
    let monthlyMid: number;
    let monthlyHigh: number;

    if (isShorts) {
      const shortsRpmRange = [shortsRpm * 0.6, shortsRpm, shortsRpm * 1.6];
      monthlyLow = (viewsPerMonth / 1000) * shortsRpmRange[0];
      monthlyMid = (viewsPerMonth / 1000) * shortsRpmRange[1];
      monthlyHigh = (viewsPerMonth / 1000) * shortsRpmRange[2];
    } else {
      // Long-form: monetized views * CPM * creator share / 1000
      const monetizedViews = viewsPerMonth * (monetizedRate / 100);
      const adRevenue = (monetizedViews / 1000) * effectiveCpm;
      monthlyMid = adRevenue * format.creatorShare;
      monthlyLow = monthlyMid * 0.6;
      monthlyHigh = monthlyMid * 1.6;
    }

    // Effective RPM (creator earnings per 1k views, accounts for monetized rate + share)
    const yourRpm = (monthlyMid / viewsPerMonth) * 1000;

    return {
      monthlyLow,
      monthlyMid,
      monthlyHigh,
      yearlyLow: monthlyLow * 12,
      yearlyMid: monthlyMid * 12,
      yearlyHigh: monthlyHigh * 12,
      perVideoMid: monthlyMid / 4, // assume ~4 videos/mo
      perDayMid: monthlyMid / 30,
      effectiveCpm,
      effectiveRpm,
      yourRpm,
      isShorts,
    };
  }, [viewsPerMonth, niche, geo, format, customCpm, monetizedRate, isCustom, isShorts]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      {/* ===== INPUTS ===== */}
      <div className="space-y-5" aria-label="Channel inputs">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
          <h2 className="text-lg font-bold">Your channel</h2>
        </div>

        {/* Views per month */}
        <fieldset>
          <label htmlFor="yt-views" className="block text-sm font-medium mb-2">
            Views per month: <strong className="text-[var(--primary)] tabular-nums">{viewsPerMonth.toLocaleString("en-US")}</strong>
          </label>
          <input
            id="yt-views"
            type="range"
            min={1000}
            max={10_000_000}
            step={1000}
            value={viewsPerMonth}
            onChange={(e) => setViewsPerMonth(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-1">
            <span>1K</span>
            <span>10M</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {[10_000, 100_000, 500_000, 1_000_000, 5_000_000].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setViewsPerMonth(v)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  viewsPerMonth === v
                    ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                }`}
              >
                {v >= 1_000_000 ? `${v / 1_000_000}M` : `${v / 1000}K`}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Niche */}
        <div>
          <label htmlFor="yt-niche" className="block text-sm font-medium mb-1.5">
            Content niche
          </label>
          <select
            id="yt-niche"
            value={nicheId}
            onChange={(e) => setNicheId(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
          >
            {NICHES.map((n) => (
              <option key={n.id} value={n.id}>
                {n.label}
                {n.cpm > 0 ? ` — ~$${n.cpm} CPM` : ""}
              </option>
            ))}
          </select>
          {niche.note && !isCustom && (
            <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">{niche.note}</p>
          )}
        </div>

        {/* Custom CPM */}
        {isCustom && (
          <div>
            <label htmlFor="yt-cpm" className="block text-sm font-medium mb-1.5">
              Custom CPM (USD per 1,000 ad impressions)
            </label>
            <input
              id="yt-cpm"
              type="number"
              min={0.5}
              max={100}
              step={0.5}
              value={customCpm}
              onChange={(e) => setCustomCpm(Math.max(0.5, Math.min(100, Number(e.target.value) || 0)))}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
        )}

        {/* Audience geo */}
        <div>
          <label htmlFor="yt-geo" className="block text-sm font-medium mb-1.5">
            Audience geography
          </label>
          <select
            id="yt-geo"
            value={geoId}
            onChange={(e) => setGeoId(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
          >
            {GEO_MULTIPLIERS.map((g) => (
              <option key={g.id} value={g.id}>{g.label}</option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">
            CPM is multiplied by <strong>{geo.mult.toFixed(2)}×</strong> for this audience mix.
          </p>
        </div>

        {/* Format */}
        <fieldset>
          <legend className="block text-sm font-medium mb-1.5">Content format</legend>
          <div className="grid grid-cols-2 gap-2" role="radiogroup">
            {FORMATS.map((f) => (
              <button
                key={f.id}
                type="button"
                role="radio"
                aria-checked={formatId === f.id}
                onClick={() => setFormatId(f.id)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium cursor-pointer transition-all ${
                  formatId === f.id
                    ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                    : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Monetized rate (long-form only) */}
        {!isShorts && (
          <fieldset>
            <label htmlFor="yt-monetized" className="block text-sm font-medium mb-2">
              Monetized view rate: <strong>{monetizedRate}%</strong>
            </label>
            <input
              id="yt-monetized"
              type="range"
              min={20}
              max={80}
              value={monetizedRate}
              onChange={(e) => setMonetizedRate(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-1">
              <span>20%</span>
              <span>40-60% typical</span>
              <span>80%</span>
            </div>
          </fieldset>
        )}
      </div>

      {/* ===== OUTPUTS ===== */}
      <div className="space-y-5" aria-live="polite" aria-label="Earnings results">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <h2 className="text-lg font-bold">Estimated earnings</h2>
          {isShorts && (
            <span className="ml-auto text-xs bg-[var(--muted)] text-[var(--muted-foreground)] px-2 py-0.5 rounded-full">
              Shorts mode
            </span>
          )}
        </div>

        {/* Primary: monthly */}
        <div className="rounded-xl border-2 border-[var(--primary-20)] bg-[var(--accent)] p-6 text-center">
          <div className="text-sm text-[var(--muted-foreground)] mb-2">Estimated monthly earnings</div>
          <div className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--primary)] tabular-nums">
            {fmtUSD(result.monthlyMid)}
          </div>
          <div className="text-xs text-[var(--muted-foreground)] mt-2 tabular-nums">
            Range: <strong className="text-[var(--foreground)]">{fmtUSD(result.monthlyLow)}</strong> — <strong className="text-[var(--foreground)]">{fmtUSD(result.monthlyHigh)}</strong>
          </div>
        </div>

        {/* Secondary: yearly + per video + per day */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 text-center">
            <div className="text-[10px] uppercase tracking-wide text-[var(--muted-foreground)]">Yearly</div>
            <div className="text-base font-bold tabular-nums mt-1">{fmtUSD(result.yearlyMid)}</div>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 text-center">
            <div className="text-[10px] uppercase tracking-wide text-[var(--muted-foreground)]">Per day</div>
            <div className="text-base font-bold tabular-nums mt-1">{fmtUSD(result.perDayMid)}</div>
          </div>
          {!isShorts ? (
            <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 text-center">
              <div className="text-[10px] uppercase tracking-wide text-[var(--muted-foreground)]">Per video (~4/mo)</div>
              <div className="text-base font-bold tabular-nums mt-1">{fmtUSD(result.perVideoMid)}</div>
            </div>
          ) : (
            <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 text-center">
              <div className="text-[10px] uppercase tracking-wide text-[var(--muted-foreground)]">Shorts RPM</div>
              <div className="text-base font-bold tabular-nums mt-1">${result.yourRpm.toFixed(3)}</div>
            </div>
          )}
        </div>

        {/* Effective rates */}
        {!isShorts && (
          <div className="rounded-lg border border-[var(--border)] px-4 py-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs text-[var(--muted-foreground)]">Effective ad CPM</div>
              <div className="font-semibold tabular-nums">${result.effectiveCpm.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--muted-foreground)]">Your RPM (after split)</div>
              <div className="font-semibold tabular-nums">${result.yourRpm.toFixed(2)}</div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-xs text-[var(--muted-foreground)] leading-relaxed">
          <strong className="text-[var(--foreground)]">Estimate only.</strong> Actual earnings depend on watch time, audience retention, ad fill rate, seasonality (Q4 CPMs spike, Q1 drops), and YouTube&apos;s ongoing policy changes. Use this as a planning baseline, not a guarantee.
        </div>

        {/* CTA: revenue boosters */}
        <div className="rounded-xl border border-dashed border-[var(--primary-30)] bg-[var(--accent)] p-5">
          <h3 className="text-sm font-semibold mb-2">Boost your earnings</h3>
          <ul className="text-xs text-[var(--muted-foreground)] space-y-1.5 list-disc pl-5">
            <li>Upload at <strong className="text-[var(--foreground)]">recommended bitrate</strong> — bad encoding = retention loss = lower RPM</li>
            <li>Mix <strong className="text-[var(--foreground)]">long-form + Shorts</strong> — Shorts feed viewers to monetized long-form</li>
            <li>Add <strong className="text-[var(--foreground)]">mid-roll ads</strong> on videos &gt; 8 min for higher RPM</li>
            <li>Layer <strong className="text-[var(--foreground)]">sponsorships + memberships + Super Thanks</strong> on top of ad revenue</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
