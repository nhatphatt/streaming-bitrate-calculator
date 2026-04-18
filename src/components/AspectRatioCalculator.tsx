"use client";

import { useState, useMemo } from "react";

const RATIOS = [
  { label: "16:9", w: 16, h: 9, use: "YouTube, Twitch, TV" },
  { label: "4:3", w: 4, h: 3, use: "Classic TV, Presentations" },
  { label: "21:9", w: 21, h: 9, use: "Ultrawide, Cinema" },
  { label: "1:1", w: 1, h: 1, use: "Instagram, Facebook" },
  { label: "9:16", w: 9, h: 16, use: "TikTok, Reels, Shorts" },
  { label: "3:2", w: 3, h: 2, use: "DSLR Photos" },
  { label: "4:5", w: 4, h: 5, use: "Instagram Portrait" },
];

const PRESETS = [
  { label: "YouTube / Twitch", w: 1920, h: 1080, ratio: "16:9" },
  { label: "YouTube 4K", w: 3840, h: 2160, ratio: "16:9" },
  { label: "TikTok / Reels", w: 1080, h: 1920, ratio: "9:16" },
  { label: "Instagram Square", w: 1080, h: 1080, ratio: "1:1" },
  { label: "Instagram Portrait", w: 1080, h: 1350, ratio: "4:5" },
  { label: "Twitter/X Video", w: 1920, h: 1080, ratio: "16:9" },
  { label: "Facebook Feed", w: 1280, h: 720, ratio: "16:9" },
  { label: "Ultrawide", w: 2560, h: 1080, ratio: "21:9" },
];

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export default function AspectRatioCalculator() {
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [lockedRatio, setLockedRatio] = useState<{ w: number; h: number } | null>(null);

  const result = useMemo(() => {
    if (!width || !height) return null;
    const g = gcd(width, height);
    return { ratioW: width / g, ratioH: height / g, totalPixels: width * height };
  }, [width, height]);

  const matchedRatio = RATIOS.find((r) => {
    if (!result) return false;
    return Math.abs(r.w / r.h - width / height) < 0.01;
  });

  function applyRatio(r: { w: number; h: number }) {
    setLockedRatio(r);
    setHeight(Math.round(width * r.h / r.w));
  }

  function applyPreset(p: { w: number; h: number }) {
    setWidth(p.w);
    setHeight(p.h);
    setLockedRatio(null);
  }

  function handleWidthChange(v: number) {
    setWidth(v);
    if (lockedRatio) setHeight(Math.round(v * lockedRatio.h / lockedRatio.w));
  }

  function handleHeightChange(v: number) {
    setHeight(v);
    if (lockedRatio) setWidth(Math.round(v * lockedRatio.w / lockedRatio.h));
  }

  // Preview box max 280px wide
  const previewScale = Math.min(280 / width, 180 / height, 1);
  const previewW = Math.max(width * previewScale, 40);
  const previewH = Math.max(height * previewScale, 40);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      {/* Input */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
          <h2 className="text-lg font-bold">Dimensions</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <fieldset>
            <label className="block text-sm font-medium mb-2">Width (px)</label>
            <input
              type="number"
              min={1}
              max={15360}
              value={width}
              onChange={(e) => handleWidthChange(Number(e.target.value))}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            />
          </fieldset>
          <fieldset>
            <label className="block text-sm font-medium mb-2">Height (px)</label>
            <input
              type="number"
              min={1}
              max={8640}
              value={height}
              onChange={(e) => handleHeightChange(Number(e.target.value))}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            />
          </fieldset>
        </div>

        {lockedRatio && (
          <div className="flex items-center gap-2 text-sm text-[var(--primary)]">
            <span>🔒 Ratio locked: {lockedRatio.w}:{lockedRatio.h}</span>
            <button onClick={() => setLockedRatio(null)} className="underline text-xs">Unlock</button>
          </div>
        )}

        {/* Ratio buttons */}
        <div>
          <label className="block text-sm font-medium mb-2">Lock Aspect Ratio</label>
          <div className="flex flex-wrap gap-2">
            {RATIOS.map((r) => (
              <button
                key={r.label}
                onClick={() => applyRatio(r)}
                className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                  lockedRatio?.w === r.w && lockedRatio?.h === r.h
                    ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                    : "border-[var(--border)] hover:border-[var(--primary)]"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Presets */}
        <div>
          <label className="block text-sm font-medium mb-2">Platform Presets</label>
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => applyPreset(p)}
                className="text-left px-3 py-2 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
              >
                <div className="text-sm font-medium">{p.label}</div>
                <div className="text-xs text-[var(--muted-foreground)]">{p.w}×{p.h} ({p.ratio})</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Output */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <h2 className="text-lg font-bold">Result</h2>
        </div>

        {/* Preview */}
        <div className="flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--accent)] p-6 min-h-[220px]">
          <div
            className="border-2 border-[var(--primary)] rounded-md flex items-center justify-center bg-[var(--primary)]/5"
            style={{ width: previewW, height: previewH }}
          >
            <span className="text-xs font-mono text-[var(--primary)]">
              {width}×{height}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="rounded-xl border-2 border-[var(--primary-20)] bg-[var(--accent)] p-5 text-center">
          <div className="text-sm text-[var(--muted-foreground)] mb-1">Aspect Ratio</div>
          <div className="text-4xl font-extrabold tracking-tight text-[var(--primary)] tabular-nums">
            {result ? `${result.ratioW}:${result.ratioH}` : "—"}
          </div>
          {matchedRatio && (
            <div className="text-xs text-[var(--muted-foreground)] mt-2">
              {matchedRatio.use}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-[var(--border)] p-3 text-center">
            <div className="text-xs text-[var(--muted-foreground)]">Total Pixels</div>
            <div className="font-bold tabular-nums">{result ? result.totalPixels.toLocaleString() : "—"}</div>
          </div>
          <div className="rounded-lg border border-[var(--border)] p-3 text-center">
            <div className="text-xs text-[var(--muted-foreground)]">Megapixels</div>
            <div className="font-bold tabular-nums">{result ? (result.totalPixels / 1_000_000).toFixed(2) + " MP" : "—"}</div>
          </div>
        </div>

        {/* Common resolutions for this ratio */}
        {matchedRatio && (
          <div>
            <h3 className="text-sm font-medium mb-2">Common resolutions for {matchedRatio.label}</h3>
            <div className="space-y-1">
              {[
                { w: matchedRatio.w * 80, h: matchedRatio.h * 80 },
                { w: matchedRatio.w * 120, h: matchedRatio.h * 120 },
                { w: matchedRatio.w * 160, h: matchedRatio.h * 160 },
                { w: matchedRatio.w * 240, h: matchedRatio.h * 240 },
              ]
                .filter((r) => r.w <= 7680 && r.h <= 4320)
                .map((r) => (
                  <button
                    key={`${r.w}x${r.h}`}
                    onClick={() => applyPreset(r)}
                    className="block w-full text-left px-3 py-1.5 rounded border border-[var(--border)] hover:border-[var(--primary)] text-sm transition-colors"
                  >
                    {r.w}×{r.h}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
