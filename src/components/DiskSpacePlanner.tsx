"use client";

import { useState, useMemo } from "react";
import { calculate, toDurationSeconds } from "@/lib/calculate";

const DRIVE_SIZES = [
  { label: "256 GB SSD", gb: 256 },
  { label: "512 GB SSD", gb: 512 },
  { label: "1 TB", gb: 1024 },
  { label: "2 TB", gb: 2048 },
  { label: "4 TB", gb: 4096 },
  { label: "8 TB", gb: 8192 },
];

export default function DiskSpacePlanner() {
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [weeksToKeep, setWeeksToKeep] = useState(4);
  const [resolution, setResolution] = useState("1080p");
  const [fps, setFps] = useState(60);
  const [codec, setCodec] = useState("h264");

  const result = useMemo(() => {
    const oneHour = calculate({
      resolution,
      fps,
      codec,
      audioBitrateKbps: 128,
      durationSeconds: toDurationSeconds(1, 0, 0),
    });

    const gbPerHour = oneHour.fileSizeGB;
    const totalHours = hoursPerWeek * weeksToKeep;
    const totalGB = gbPerHour * totalHours;
    const totalTB = totalGB / 1024;
    const gbPerWeek = gbPerHour * hoursPerWeek;

    // Recommend drive size
    const recommended = DRIVE_SIZES.find((d) => d.gb >= totalGB * 1.2) ?? DRIVE_SIZES[DRIVE_SIZES.length - 1];

    // How long each drive lasts
    const driveBreakdown = DRIVE_SIZES.map((d) => ({
      ...d,
      hoursCapacity: d.gb / gbPerHour,
      weeksCapacity: d.gb / gbPerWeek,
      fits: d.gb >= totalGB,
    }));

    return { gbPerHour, totalGB, totalTB, totalHours, gbPerWeek, recommended, driveBreakdown };
  }, [hoursPerWeek, weeksToKeep, resolution, fps, codec]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
          <h2 className="text-lg font-bold">Your Schedule</h2>
        </div>

        <fieldset>
          <label className="block text-sm font-medium mb-2">
            Hours streaming/recording per week: <strong>{hoursPerWeek}h</strong>
          </label>
          <input type="range" min={1} max={60} value={hoursPerWeek} onChange={(e) => setHoursPerWeek(Number(e.target.value))} className="w-full" />
          <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-1">
            <span>1h</span><span>60h</span>
          </div>
        </fieldset>

        <fieldset>
          <label className="block text-sm font-medium mb-2">
            Weeks to keep recordings: <strong>{weeksToKeep} weeks</strong>
          </label>
          <input type="range" min={1} max={52} value={weeksToKeep} onChange={(e) => setWeeksToKeep(Number(e.target.value))} className="w-full" />
          <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-1">
            <span>1 week</span><span>52 weeks</span>
          </div>
        </fieldset>

        <div className="grid grid-cols-3 gap-3">
          <fieldset>
            <label className="block text-sm font-medium mb-2">Resolution</label>
            <select value={resolution} onChange={(e) => setResolution(e.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm">
              {["720p", "1080p", "1440p", "4k"].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </fieldset>
          <fieldset>
            <label className="block text-sm font-medium mb-2">FPS</label>
            <select value={fps} onChange={(e) => setFps(Number(e.target.value))} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm">
              {[30, 60, 120].map((f) => (
                <option key={f} value={f}>{f} fps</option>
              ))}
            </select>
          </fieldset>
          <fieldset>
            <label className="block text-sm font-medium mb-2">Codec</label>
            <select value={codec} onChange={(e) => setCodec(e.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm">
              <option value="h264">H.264</option>
              <option value="hevc">HEVC</option>
              <option value="av1">AV1</option>
              <option value="prores422">ProRes</option>
            </select>
          </fieldset>
        </div>

        <div className="rounded-xl border-2 border-[var(--primary-20)] bg-[var(--accent)] p-5 text-center">
          <div className="text-sm text-[var(--muted-foreground)] mb-1">Total Storage Needed</div>
          <div className="text-4xl font-extrabold tracking-tight text-[var(--primary)] tabular-nums">
            {result.totalGB >= 1024 ? `${result.totalTB.toFixed(1)} TB` : `${result.totalGB.toFixed(0)} GB`}
          </div>
          <div className="text-xs text-[var(--muted-foreground)] mt-2">
            {result.gbPerHour.toFixed(1)} GB/hour · {result.gbPerWeek.toFixed(0)} GB/week · {result.totalHours}h total
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <h2 className="text-lg font-bold">Drive Compatibility</h2>
        </div>

        <div className="space-y-2">
          {result.driveBreakdown.map((d) => {
            const isRecommended = d.label === result.recommended.label;
            const usagePct = Math.min((result.totalGB / d.gb) * 100, 100);
            return (
              <div
                key={d.label}
                className={`rounded-lg border px-4 py-3 ${
                  isRecommended
                    ? "border-[var(--primary)] bg-[var(--primary)]/5"
                    : d.fits
                      ? "border-green-500/30 bg-green-500/5"
                      : "border-red-500/30 bg-red-500/5 opacity-60"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">
                    {d.label} {isRecommended && "⭐ Recommended"}
                  </span>
                  <span className="text-sm tabular-nums">
                    {d.fits ? `${d.weeksCapacity.toFixed(1)} weeks` : "Not enough"}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[var(--muted)] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${d.fits ? "bg-green-500" : "bg-red-500"}`}
                    style={{ width: `${usagePct}%` }}
                  />
                </div>
                <div className="text-xs text-[var(--muted-foreground)] mt-1">
                  {usagePct.toFixed(0)}% used · {d.hoursCapacity.toFixed(0)}h capacity
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
