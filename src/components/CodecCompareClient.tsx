"use client";

import { useState, useMemo } from "react";
import {
  RESOLUTIONS,
  FPS_OPTIONS,
  CODECS,
  AUDIO_BITRATE_OPTIONS,
} from "@/data/presets";
import { calculate, toDurationSeconds } from "@/lib/calculate";

export default function CodecCompareClient() {
  const [resolution, setResolution] = useState(RESOLUTIONS[3].slug); // 4K
  const [fps, setFps] = useState(FPS_OPTIONS[1].value); // 30fps
  const [audioBitrate] = useState(AUDIO_BITRATE_OPTIONS[1].value);
  const [durationMin, setDurationMin] = useState(60); // 1 hour

  const durationSeconds = useMemo(
    () => toDurationSeconds(0, durationMin, 0),
    [durationMin]
  );

  const results = useMemo(
    () =>
      CODECS.map((codec) => {
        const result = calculate({
          resolution,
          fps,
          codec: codec.id,
          audioBitrateKbps: audioBitrate,
          durationSeconds: durationSeconds || 1,
        });
        return { codec, result };
      }),
    [resolution, fps, audioBitrate, durationSeconds]
  );

  const h264Size = results.find((r) => r.codec.id === "h264")?.result.fileSizeBytes ?? 1;
  const maxSize = Math.max(...results.map((r) => r.result.fileSizeBytes));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
        <h2 className="text-lg font-bold">Interactive Comparison</h2>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Resolution</label>
          <select
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
          >
            {RESOLUTIONS.map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Frame Rate</label>
          <select
            value={fps}
            onChange={(e) => setFps(Number(e.target.value))}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
          >
            {FPS_OPTIONS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Duration: {durationMin >= 60 ? `${Math.floor(durationMin / 60)}h${durationMin % 60 > 0 ? ` ${durationMin % 60}m` : ""}` : `${durationMin}m`}
          </label>
          <input
            type="range"
            min={1}
            max={480}
            value={durationMin}
            onChange={(e) => setDurationMin(Number(e.target.value))}
            className="w-full mt-2"
          />
        </div>
      </div>

      {/* Visual bar chart */}
      <div className="space-y-3">
        {results.map(({ codec, result }) => {
          const pct = Math.round((result.fileSizeBytes / h264Size) * 100);
          const barWidth = Math.max(
            5,
            (result.fileSizeBytes / maxSize) * 100
          );
          const isSmaller = pct < 100;
          const isLarger = pct > 100;

          return (
            <div key={codec.id} className="group">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-medium">{codec.label}</span>
                <span className="tabular-nums text-[var(--muted-foreground)]">
                  {result.fileSizeFormatted}
                  <span
                    className={`ml-2 text-xs ${
                      isSmaller
                        ? "text-green-600"
                        : isLarger
                        ? "text-orange-500"
                        : "text-[var(--muted-foreground)]"
                    }`}
                  >
                    {pct === 100 ? "baseline" : `${pct}%`}
                  </span>
                </span>
              </div>
              <div className="h-8 rounded-lg bg-[var(--muted)] overflow-hidden">
                <div
                  className={`h-full rounded-lg transition-all duration-500 ease-out flex items-center justify-end pr-2 text-xs font-medium ${
                    isSmaller
                      ? "bg-green-500/80 text-white"
                      : isLarger
                      ? "bg-orange-400/80 text-white"
                      : "bg-[var(--primary-80)] text-[var(--primary-foreground)]"
                  }`}
                  style={{ width: `${barWidth}%` }}
                >
                  {result.totalBitrateMbps} Mbps
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="rounded-lg bg-[var(--muted)] p-4 text-sm text-[var(--muted-foreground)]">
        <strong className="text-[var(--foreground)]">Summary:</strong> For this
        configuration, <strong className="text-green-600">AV1</strong> saves{" "}
        {100 - Math.round((results.find((r) => r.codec.id === "av1")?.result.fileSizeBytes ?? 0) / h264Size * 100)}%
        vs H.264, while{" "}
        <strong className="text-orange-500">ProRes 4444</strong> requires{" "}
        {Math.round((results.find((r) => r.codec.id === "prores4444")?.result.fileSizeBytes ?? 0) / h264Size * 100)}%
        of the H.264 baseline.
      </div>
    </div>
  );
}
