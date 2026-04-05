"use client";

import { useState, useMemo } from "react";

export default function BandwidthCalculator() {
  const [uploadMbps, setUploadMbps] = useState(20);
  const [viewers, setViewers] = useState(1);

  const results = useMemo(() => {
    const maxBitrateKbps = uploadMbps * 1000 * 0.75;
    const perViewerKbps = maxBitrateKbps / viewers;

    const canStream = (bitrateKbps: number) => perViewerKbps >= bitrateKbps;

    const configs = [
      { label: "720p 30fps", bitrate: 3000 },
      { label: "720p 60fps", bitrate: 4500 },
      { label: "1080p 30fps", bitrate: 5000 },
      { label: "1080p 60fps", bitrate: 6500 },
      { label: "1440p 60fps", bitrate: 12000 },
      { label: "4K 30fps", bitrate: 25000 },
      { label: "4K 60fps", bitrate: 40000 },
    ];

    // Data usage per hour
    const dataPerHourGB = (maxBitrateKbps * 3600) / 8 / 1024 / 1024;

    return {
      maxBitrateKbps: Math.round(maxBitrateKbps),
      maxBitrateMbps: (maxBitrateKbps / 1000).toFixed(1),
      dataPerHourGB: dataPerHourGB.toFixed(1),
      configs: configs.map((c) => ({
        ...c,
        ok: canStream(c.bitrate),
        headroom: Math.round(((perViewerKbps - c.bitrate) / c.bitrate) * 100),
      })),
    };
  }, [uploadMbps, viewers]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      {/* Input */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
          <h2 className="text-lg font-bold">Your Connection</h2>
        </div>

        <fieldset>
          <label className="block text-sm font-medium mb-2">
            Upload Speed: <strong>{uploadMbps} Mbps</strong>
          </label>
          <input
            type="range"
            min={1}
            max={200}
            value={uploadMbps}
            onChange={(e) => setUploadMbps(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-1">
            <span>1 Mbps</span>
            <span>200 Mbps</span>
          </div>
        </fieldset>

        <fieldset>
          <label className="block text-sm font-medium mb-2">
            Simultaneous Streams: <strong>{viewers}</strong>
          </label>
          <input
            type="range"
            min={1}
            max={5}
            value={viewers}
            onChange={(e) => setViewers(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-1">
            <span>1</span>
            <span>5</span>
          </div>
        </fieldset>

        {/* Summary */}
        <div className="rounded-xl border-2 border-[var(--primary-20)] bg-[var(--accent)] p-5 text-center">
          <div className="text-sm text-[var(--muted-foreground)] mb-1">
            Maximum Stream Bitrate
          </div>
          <div className="text-4xl font-extrabold tracking-tight text-[var(--primary)] tabular-nums">
            {results.maxBitrateMbps} Mbps
          </div>
          <div className="text-xs text-[var(--muted-foreground)] mt-2">
            {results.maxBitrateKbps.toLocaleString()} Kbps &middot;{" "}
            ~{results.dataPerHourGB} GB/hour
          </div>
        </div>
      </div>

      {/* Output */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <h2 className="text-lg font-bold">What Can You Stream?</h2>
        </div>

        <div className="space-y-2">
          {results.configs.map((c) => (
            <div
              key={c.label}
              className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
                c.ok
                  ? "border-green-500/30 bg-green-500/5"
                  : "border-red-500/30 bg-red-500/5 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`text-lg ${c.ok ? "text-green-500" : "text-red-500"}`}
                >
                  {c.ok ? "\u2713" : "\u2717"}
                </span>
                <div>
                  <div className="font-medium text-sm">{c.label}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">
                    {(c.bitrate / 1000).toFixed(1)} Mbps required
                  </div>
                </div>
              </div>
              {c.ok && (
                <span className="text-xs text-green-600 font-medium">
                  +{c.headroom}% headroom
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
