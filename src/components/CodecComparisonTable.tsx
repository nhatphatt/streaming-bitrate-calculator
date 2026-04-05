"use client";

import { useMemo } from "react";
import { CODECS } from "@/data/presets";
import { calculate } from "@/lib/calculate";

interface CodecComparisonTableProps {
  resolution: string;
  fps: number;
  audioBitrateKbps: number;
  durationSeconds: number;
  activeCodec: string;
}

/**
 * Mini comparison table showing file size and bitrate across all codecs
 * for the currently selected resolution/fps/duration.
 */
export default function CodecComparisonTable({
  resolution,
  fps,
  audioBitrateKbps,
  durationSeconds,
  activeCodec,
}: CodecComparisonTableProps) {
  const rows = useMemo(
    () =>
      CODECS.map((c) => {
        const r = calculate({
          resolution,
          fps,
          codec: c.id,
          audioBitrateKbps,
          durationSeconds,
        });
        return { ...c, result: r };
      }),
    [resolution, fps, audioBitrateKbps, durationSeconds]
  );

  // Find H.264 baseline for percentage comparison
  const h264Size = rows.find((r) => r.id === "h264")?.result.fileSizeBytes ?? 1;

  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-sm" aria-label="Codec comparison table">
        <thead>
          <tr className="text-left text-xs text-[var(--muted-foreground)] border-b border-[var(--border)]">
            <th className="pb-2 pr-3 pl-1">Codec</th>
            <th className="pb-2 pr-3">Bitrate</th>
            <th className="pb-2 pr-3">File Size</th>
            <th className="pb-2">vs H.264</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const pct = Math.round(
              (row.result.fileSizeBytes / h264Size) * 100
            );
            return (
              <tr
                key={row.id}
                className={`border-b border-[var(--border)] last:border-0 ${
                  row.id === activeCodec
                    ? "font-semibold text-[var(--primary)]"
                    : ""
                }`}
              >
                <td className="py-2 pr-3 pl-1">
                  <span className="flex items-center gap-1.5">
                    {row.label}
                    {row.id === activeCodec && (
                      <span className="text-[10px] bg-[var(--primary)] text-[var(--primary-foreground)] px-1.5 py-0.5 rounded-full leading-none">
                        active
                      </span>
                    )}
                  </span>
                </td>
                <td className="py-2 pr-3 tabular-nums">
                  {row.result.totalBitrateMbps} Mbps
                </td>
                <td className="py-2 pr-3 tabular-nums">
                  {row.result.fileSizeFormatted}
                </td>
                <td className="py-2 tabular-nums">
                  <span
                    className={
                      pct < 100
                        ? "text-green-600"
                        : pct > 100
                        ? "text-orange-500"
                        : ""
                    }
                  >
                    {pct}%
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
