"use client";

import { useState, useMemo } from "react";

const CODECS = [
  { id: "h264", label: "H.264 (AVC)", factor: 1.0 },
  { id: "hevc", label: "H.265 (HEVC)", factor: 0.6 },
  { id: "vp9", label: "VP9", factor: 0.6 },
  { id: "av1", label: "AV1", factor: 0.5 },
  { id: "prores422", label: "ProRes 422", factor: 3.5 },
  { id: "prores4444", label: "ProRes 4444", factor: 5.0 },
];

function formatSize(mb: number): string {
  if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`;
  return `${mb.toFixed(1)} MB`;
}

export default function CompressionCalculator() {
  const [fileSizeMB, setFileSizeMB] = useState(1000);
  const [sourceCodec, setSourceCodec] = useState("h264");
  const [targetCodec, setTargetCodec] = useState("hevc");

  const results = useMemo(() => {
    const src = CODECS.find((c) => c.id === sourceCodec)!;
    const tgt = CODECS.find((c) => c.id === targetCodec)!;
    const ratio = tgt.factor / src.factor;
    const estimatedMB = fileSizeMB * ratio;
    const savedMB = fileSizeMB - estimatedMB;
    const savedPct = ((savedMB / fileSizeMB) * 100);

    // Show all codecs comparison
    const all = CODECS.map((c) => ({
      ...c,
      estimatedMB: fileSizeMB * (c.factor / src.factor),
      savedPct: ((1 - c.factor / src.factor) * 100),
    }));

    return { estimatedMB, savedMB, savedPct, ratio, all };
  }, [fileSizeMB, sourceCodec, targetCodec]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
          <h2 className="text-lg font-bold">Source Video</h2>
        </div>

        <fieldset>
          <label className="block text-sm font-medium mb-2">File Size (MB)</label>
          <input
            type="number"
            min={1}
            max={999999}
            value={fileSizeMB}
            onChange={(e) => setFileSizeMB(Number(e.target.value))}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          />
          <div className="flex gap-2 mt-2">
            {[500, 1000, 5000, 10000, 50000].map((v) => (
              <button key={v} onClick={() => setFileSizeMB(v)} className="px-2 py-1 text-xs rounded border border-[var(--border)] hover:border-[var(--primary)] transition-colors">
                {formatSize(v)}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <label className="block text-sm font-medium mb-2">Source Codec</label>
          <select
            value={sourceCodec}
            onChange={(e) => setSourceCodec(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          >
            {CODECS.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </fieldset>

        <fieldset>
          <label className="block text-sm font-medium mb-2">Target Codec</label>
          <select
            value={targetCodec}
            onChange={(e) => setTargetCodec(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          >
            {CODECS.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </fieldset>

        {/* Primary result */}
        <div className="rounded-xl border-2 border-[var(--primary-20)] bg-[var(--accent)] p-5 text-center">
          <div className="text-sm text-[var(--muted-foreground)] mb-1">Estimated Output Size</div>
          <div className="text-4xl font-extrabold tracking-tight text-[var(--primary)] tabular-nums">
            {formatSize(results.estimatedMB)}
          </div>
          <div className="text-xs text-[var(--muted-foreground)] mt-2">
            {results.savedPct > 0
              ? `${results.savedPct.toFixed(0)}% smaller · Save ${formatSize(results.savedMB)}`
              : results.savedPct < 0
                ? `${Math.abs(results.savedPct).toFixed(0)}% larger`
                : "Same size"}
          </div>
        </div>
      </div>

      {/* All codecs comparison */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <h2 className="text-lg font-bold">All Codecs Comparison</h2>
        </div>
        <p className="text-sm text-[var(--muted-foreground)]">
          Converting from {CODECS.find((c) => c.id === sourceCodec)!.label} ({formatSize(fileSizeMB)})
        </p>

        <div className="space-y-2">
          {results.all.map((c) => {
            const isSource = c.id === sourceCodec;
            const isTarget = c.id === targetCodec;
            const barWidth = Math.min((c.estimatedMB / fileSizeMB) * 100, 100);
            return (
              <div
                key={c.id}
                className={`rounded-lg border px-4 py-3 ${
                  isTarget ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-[var(--border)]"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">
                    {c.label} {isSource && "(source)"} {isTarget && "✓"}
                  </span>
                  <span className="text-sm font-bold tabular-nums">{formatSize(c.estimatedMB)}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[var(--muted)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--primary)] transition-all"
                    style={{ width: `${Math.min(barWidth, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-[var(--muted-foreground)] mt-1">
                  {c.savedPct > 0 ? `${c.savedPct.toFixed(0)}% smaller` : c.savedPct < 0 ? `${Math.abs(c.savedPct).toFixed(0)}% larger` : "baseline"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
