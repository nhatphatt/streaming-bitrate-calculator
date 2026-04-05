"use client";

import { useState, useMemo } from "react";
import { RESOLUTIONS, FPS_OPTIONS, CODECS } from "@/data/presets";
import { calculate } from "@/lib/calculate";

export default function RecordingTimeCalculator() {
  const [storageValue, setStorageValue] = useState(1);
  const [storageUnit, setStorageUnit] = useState<"GB" | "TB">("TB");
  const [resolution, setResolution] = useState("1080p");
  const [fps, setFps] = useState(30);
  const [codec, setCodec] = useState("h264");

  const result = useMemo(() => {
    const totalGB = storageUnit === "TB" ? storageValue * 1024 : storageValue;
    const totalBytes = totalGB * 1024 * 1024 * 1024;

    // Calculate bitrate for 1 second to get bytes per second
    const calc1s = calculate({
      resolution,
      fps,
      codec,
      audioBitrateKbps: 128,
      durationSeconds: 1,
    });

    const bytesPerSecond = calc1s.fileSizeBytes;
    if (bytesPerSecond === 0) return null;

    const totalSeconds = totalBytes / bytesPerSecond;

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    let formatted = "";
    if (days > 0) formatted += `${days}d `;
    if (hours > 0) formatted += `${hours}h `;
    formatted += `${minutes}m`;

    // Per hour size
    const calc1h = calculate({
      resolution,
      fps,
      codec,
      audioBitrateKbps: 128,
      durationSeconds: 3600,
    });

    return {
      totalSeconds,
      formatted: formatted.trim(),
      totalHours: (totalSeconds / 3600).toFixed(1),
      perHourGB: (calc1h.fileSizeBytes / (1024 * 1024 * 1024)).toFixed(2),
      perHourFormatted: calc1h.fileSizeFormatted,
      bitrateMbps: calc1h.totalBitrateMbps,
      storageGB: totalGB,
    };
  }, [storageValue, storageUnit, resolution, fps, codec]);

  const codecLabel = CODECS.find((c) => c.id === codec)?.label ?? codec;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      {/* Input */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
          <h2 className="text-lg font-bold">Your Storage</h2>
        </div>

        <fieldset>
          <label className="block text-sm font-medium mb-1.5">Available Storage</label>
          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              step={1}
              value={storageValue}
              onChange={(e) => setStorageValue(Math.max(1, Number(e.target.value)))}
              className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            <select
              value={storageUnit}
              onChange={(e) => setStorageUnit(e.target.value as "GB" | "TB")}
              className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
            >
              <option value="GB">GB</option>
              <option value="TB">TB</option>
            </select>
          </div>
          {/* Quick presets */}
          <div className="grid grid-cols-4 gap-2 mt-3">
            {[
              { label: "256 GB", v: 256, u: "GB" as const },
              { label: "512 GB", v: 512, u: "GB" as const },
              { label: "1 TB", v: 1, u: "TB" as const },
              { label: "2 TB", v: 2, u: "TB" as const },
              { label: "4 TB", v: 4, u: "TB" as const },
              { label: "8 TB", v: 8, u: "TB" as const },
              { label: "16 TB", v: 16, u: "TB" as const },
              { label: "32 TB", v: 32, u: "TB" as const },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => { setStorageValue(p.v); setStorageUnit(p.u); }}
                className={`rounded-lg border px-2 py-1.5 text-xs font-medium cursor-pointer transition-all ${
                  storageValue === p.v && storageUnit === p.u
                    ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <label className="block text-sm font-medium mb-1.5">Resolution</label>
          <select
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
          >
            {RESOLUTIONS.map((r) => (
              <option key={r.slug} value={r.slug}>{r.label}</option>
            ))}
          </select>
        </fieldset>

        <fieldset>
          <label className="block text-sm font-medium mb-1.5">Frame Rate</label>
          <div className="grid grid-cols-4 gap-2">
            {FPS_OPTIONS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFps(f.value)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium cursor-pointer transition-all ${
                  fps === f.value
                    ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <label className="block text-sm font-medium mb-1.5">Video Codec</label>
          <select
            value={codec}
            onChange={(e) => setCodec(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
          >
            {CODECS.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </fieldset>
      </div>

      {/* Output */}
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <h2 className="text-lg font-bold">Results</h2>
        </div>

        {result && (
          <>
            <div className="rounded-xl border-2 border-[var(--primary-20)] bg-[var(--accent)] p-6 text-center">
              <div className="text-sm text-[var(--muted-foreground)] mb-2">
                Maximum Recording Time
              </div>
              <div className="text-4xl font-extrabold tracking-tight text-[var(--primary)] tabular-nums">
                {result.formatted}
              </div>
              <div className="text-sm text-[var(--muted-foreground)] mt-2">
                {result.totalHours} hours total
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card)] p-4">
                <div className="text-xs text-[var(--muted-foreground)] mb-1">Per Hour</div>
                <div className="text-lg font-bold">{result.perHourFormatted}</div>
                <div className="text-xs text-[var(--muted-foreground)]">{result.perHourGB} GB/hour</div>
              </div>
              <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card)] p-4">
                <div className="text-xs text-[var(--muted-foreground)] mb-1">Bitrate</div>
                <div className="text-lg font-bold">{result.bitrateMbps} Mbps</div>
                <div className="text-xs text-[var(--muted-foreground)]">{codecLabel}</div>
              </div>
            </div>

            {/* Codec comparison */}
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5">
              <h3 className="text-sm font-semibold mb-3">Recording Time by Codec</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-[var(--muted-foreground)] border-b border-[var(--border)]">
                    <th className="pb-2 pr-4">Codec</th>
                    <th className="pb-2 pr-4">Per Hour</th>
                    <th className="pb-2">Max Time</th>
                  </tr>
                </thead>
                <tbody>
                  {CODECS.map((c) => {
                    const calc1s = calculate({ resolution, fps, codec: c.id, audioBitrateKbps: 128, durationSeconds: 1 });
                    const calc1h = calculate({ resolution, fps, codec: c.id, audioBitrateKbps: 128, durationSeconds: 3600 });
                    const totalGB = storageUnit === "TB" ? storageValue * 1024 : storageValue;
                    const secs = (totalGB * 1024 * 1024 * 1024) / calc1s.fileSizeBytes;
                    const h = Math.floor(secs / 3600);
                    const m = Math.floor((secs % 3600) / 60);
                    const d = Math.floor(secs / 86400);
                    let t = "";
                    if (d > 0) t += `${d}d `;
                    t += `${h % 24}h ${m}m`;
                    return (
                      <tr key={c.id} className={`border-b border-[var(--border)] last:border-0 ${c.id === codec ? "font-semibold text-[var(--primary)]" : ""}`}>
                        <td className="py-2 pr-4">{c.label}</td>
                        <td className="py-2 pr-4 tabular-nums">{calc1h.fileSizeFormatted}</td>
                        <td className="py-2 tabular-nums">{t.trim()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
