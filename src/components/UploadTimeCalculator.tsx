"use client";

import { useState, useMemo } from "react";

export default function UploadTimeCalculator() {
  const [fileSizeValue, setFileSizeValue] = useState(10);
  const [fileSizeUnit, setFileSizeUnit] = useState<"MB" | "GB" | "TB">("GB");
  const [uploadMbps, setUploadMbps] = useState(20);

  const result = useMemo(() => {
    const multipliers = { MB: 1, GB: 1024, TB: 1024 * 1024 };
    const totalMB = fileSizeValue * multipliers[fileSizeUnit];
    const totalBits = totalMB * 8 * 1024 * 1024;
    const speedBps = uploadMbps * 1000 * 1000;

    if (speedBps === 0) return null;

    const totalSeconds = totalBits / speedBps;

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.round(totalSeconds % 60);

    let formatted = "";
    if (days > 0) formatted += `${days}d `;
    if (hours > 0) formatted += `${hours}h `;
    if (minutes > 0) formatted += `${minutes}m `;
    if (seconds > 0 || formatted === "") formatted += `${seconds}s`;

    // At 80% efficiency
    const realSeconds = totalSeconds / 0.8;
    const rDays = Math.floor(realSeconds / 86400);
    const rHours = Math.floor((realSeconds % 86400) / 3600);
    const rMinutes = Math.floor((realSeconds % 3600) / 60);
    const rSecs = Math.round(realSeconds % 60);

    let realFormatted = "";
    if (rDays > 0) realFormatted += `${rDays}d `;
    if (rHours > 0) realFormatted += `${rHours}h `;
    if (rMinutes > 0) realFormatted += `${rMinutes}m `;
    if (rSecs > 0 || realFormatted === "") realFormatted += `${rSecs}s`;

    return {
      totalMB,
      totalSeconds,
      formatted: formatted.trim(),
      realFormatted: realFormatted.trim(),
      mbPerSecond: (uploadMbps / 8).toFixed(2),
    };
  }, [fileSizeValue, fileSizeUnit, uploadMbps]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      {/* Input */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
          <h2 className="text-lg font-bold">Settings</h2>
        </div>

        <fieldset>
          <label className="block text-sm font-medium mb-1.5">File Size</label>
          <div className="flex gap-2">
            <input
              type="number"
              min={0.1}
              step={0.1}
              value={fileSizeValue}
              onChange={(e) => setFileSizeValue(Math.max(0.1, Number(e.target.value)))}
              className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            <select
              value={fileSizeUnit}
              onChange={(e) => setFileSizeUnit(e.target.value as "MB" | "GB" | "TB")}
              className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
            >
              <option value="MB">MB</option>
              <option value="GB">GB</option>
              <option value="TB">TB</option>
            </select>
          </div>
        </fieldset>

        <fieldset>
          <label className="block text-sm font-medium mb-1.5">
            Upload Speed: <strong>{uploadMbps} Mbps</strong>
          </label>
          <input
            type="range"
            min={1}
            max={500}
            value={uploadMbps}
            onChange={(e) => setUploadMbps(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-1">
            <span>1 Mbps</span>
            <span>500 Mbps</span>
          </div>
        </fieldset>

        {/* Quick presets */}
        <fieldset>
          <label className="block text-sm font-medium mb-1.5">Quick Presets</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "5 Mbps", value: 5 },
              { label: "10 Mbps", value: 10 },
              { label: "25 Mbps", value: 25 },
              { label: "50 Mbps", value: 50 },
              { label: "100 Mbps", value: 100 },
              { label: "500 Mbps", value: 500 },
            ].map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setUploadMbps(p.value)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium cursor-pointer transition-all ${
                  uploadMbps === p.value
                    ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
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
                Estimated Upload Time
              </div>
              <div className="text-4xl font-extrabold tracking-tight text-[var(--primary)] tabular-nums">
                {result.formatted}
              </div>
              <div className="text-xs text-[var(--muted-foreground)] mt-2">
                at {uploadMbps} Mbps ({result.mbPerSecond} MB/s)
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card)] p-4">
                <div className="text-xs text-[var(--muted-foreground)] mb-1">Realistic Estimate</div>
                <div className="text-lg font-bold">{result.realFormatted}</div>
                <div className="text-xs text-[var(--muted-foreground)]">at 80% efficiency</div>
              </div>
              <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card)] p-4">
                <div className="text-xs text-[var(--muted-foreground)] mb-1">File Size</div>
                <div className="text-lg font-bold tabular-nums">
                  {result.totalMB >= 1024
                    ? `${(result.totalMB / 1024).toFixed(1)} GB`
                    : `${result.totalMB.toFixed(1)} MB`}
                </div>
                <div className="text-xs text-[var(--muted-foreground)]">
                  {result.totalMB.toLocaleString()} MB total
                </div>
              </div>
            </div>

            {/* Reference table */}
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5">
              <h3 className="text-sm font-semibold mb-3">
                Upload Time at Different Speeds
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-[var(--muted-foreground)] border-b border-[var(--border)]">
                    <th className="pb-2 pr-4">Speed</th>
                    <th className="pb-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {[5, 10, 25, 50, 100, 200].map((speed) => {
                    const multipliers = { MB: 1, GB: 1024, TB: 1024 * 1024 };
                    const totalMB = fileSizeValue * multipliers[fileSizeUnit];
                    const secs = (totalMB * 8 * 1024 * 1024) / (speed * 1000 * 1000);
                    const h = Math.floor(secs / 3600);
                    const m = Math.floor((secs % 3600) / 60);
                    const s = Math.round(secs % 60);
                    let t = "";
                    if (h > 0) t += `${h}h `;
                    if (m > 0) t += `${m}m `;
                    if (s > 0 || t === "") t += `${s}s`;
                    return (
                      <tr
                        key={speed}
                        className={`border-b border-[var(--border)] last:border-0 ${
                          speed === uploadMbps ? "font-semibold text-[var(--primary)]" : ""
                        }`}
                      >
                        <td className="py-2 pr-4">{speed} Mbps</td>
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
