"use client";

import { useState, useMemo, useEffect } from "react";
import {
  RESOLUTIONS,
  FPS_OPTIONS,
  CODECS,
  AUDIO_BITRATE_OPTIONS,
} from "@/data/presets";
import { calculate, toDurationSeconds, type CalcResult } from "@/lib/calculate";
import AnimatedNumber from "@/components/AnimatedNumber";
import CopyButton from "@/components/CopyButton";
import ShareButton from "@/components/ShareButton";
import ResultCard from "@/components/ResultCard";
import CodecComparisonTable from "@/components/CodecComparisonTable";
import { PLATFORMS, getPlatformById } from "@/data/platforms";

interface CalculatorFormProps {
  defaultResolution?: string;
  defaultFps?: number;
}

/**
 * Validate that a resolution slug exists in presets.
 */
function isValidResolution(slug: string): boolean {
  return RESOLUTIONS.some((r) => r.slug === slug);
}

/**
 * Validate that a fps value exists in presets.
 */
function isValidFps(value: number): boolean {
  return FPS_OPTIONS.some((f) => f.value === value);
}

/**
 * Validate that a codec id exists in presets.
 */
function isValidCodec(id: string): boolean {
  return CODECS.some((c) => c.id === id);
}

const QUICK_PRESETS = [
  { label: "Twitch 1080p60", platform: "twitch", resolution: "1080p", fps: 60, codec: "h264", audio: 128 },
  { label: "YouTube 4K", platform: "youtube", resolution: "4k", fps: 30, codec: "h264", audio: 192 },
  { label: "Kick 1080p60", platform: "kick", resolution: "1080p", fps: 60, codec: "h264", audio: 128 },
  { label: "Discord 720p", platform: "discord", resolution: "720p", fps: 30, codec: "h264", audio: 128 },
];

const DURATION_PRESETS = [
  { label: "5 min", h: 0, m: 5, s: 0 },
  { label: "30 min", h: 0, m: 30, s: 0 },
  { label: "1 hr", h: 1, m: 0, s: 0 },
  { label: "3 hr", h: 3, m: 0, s: 0 },
];

/**
 * Clamp a string value to an integer within [min, max].
 */
function clampInt(val: string, min: number, max: number): number {
  const n = parseInt(val, 10);
  if (isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

export default function CalculatorForm({
  defaultResolution,
  defaultFps,
}: CalculatorFormProps) {
  const [resolution, setResolution] = useState(
    defaultResolution ?? RESOLUTIONS[1].slug
  );
  const [fps, setFps] = useState(defaultFps ?? FPS_OPTIONS[1].value);
  const [codec, setCodec] = useState(CODECS[0].id);
  const [platform, setPlatform] = useState("none");
  const [audioBitrate, setAudioBitrate] = useState(
    AUDIO_BITRATE_OPTIONS[1].value
  );
  const [hours, setHours] = useState(1);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // Hydrate from URL params (shared links) with validation
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const res = params.get("res");
    if (res && isValidResolution(res)) setResolution(res);

    const fpsParam = Number(params.get("fps"));
    if (fpsParam && isValidFps(fpsParam)) setFps(fpsParam);

    const codecParam = params.get("codec");
    if (codecParam && isValidCodec(codecParam)) setCodec(codecParam);

    const audioParam = Number(params.get("audio"));
    if (audioParam && AUDIO_BITRATE_OPTIONS.some((a) => a.value === audioParam)) {
      setAudioBitrate(audioParam);
    }

    if (params.has("h")) setHours(clampInt(params.get("h")!, 0, 99));
    if (params.has("m")) setMinutes(clampInt(params.get("m")!, 0, 59));
    if (params.has("s")) setSeconds(clampInt(params.get("s")!, 0, 59));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const durationSeconds = useMemo(
    () => toDurationSeconds(hours, minutes, seconds),
    [hours, minutes, seconds]
  );

  const result: CalcResult = useMemo(
    () =>
      calculate({
        resolution,
        fps,
        codec,
        audioBitrateKbps: audioBitrate,
        durationSeconds: durationSeconds || 1,
      }),
    [resolution, fps, codec, audioBitrate, durationSeconds]
  );

  const selectedRes = RESOLUTIONS.find((r) => r.slug === resolution);

  // Build shareable URL
  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams({
      res: resolution,
      fps: String(fps),
      codec,
      audio: String(audioBitrate),
      h: String(hours),
      m: String(minutes),
      s: String(seconds),
    });
    return `${window.location.origin}${window.location.pathname}?${params}`;
  }, [resolution, fps, codec, audioBitrate, hours, minutes, seconds]);

  const resultSummary = `${result.fileSizeFormatted} | ${result.totalBitrateMbps} Mbps | ${resolution} ${fps}fps ${codec}`;

  // Platform warning
  const activePlatform = getPlatformById(platform);
  const platformWarning = useMemo(() => {
    if (!activePlatform || activePlatform.id === "none") return null;
    if (result.totalBitrateKbps > activePlatform.maxBitrateKbps) {
      return {
        type: "error" as const,
        message: `${activePlatform.name} limits bitrate to ${(activePlatform.maxBitrateKbps / 1000).toFixed(0)} Mbps (${activePlatform.maxBitrateKbps.toLocaleString()} Kbps). Your current settings use ${result.totalBitrateMbps} Mbps. Lower your resolution, frame rate, or switch to a more efficient codec.`,
      };
    }
    const key = `${resolution}-${fps}`;
    const recommended = activePlatform.recommendedBitrateKbps[key];
    if (recommended && result.videoBitrateKbps > recommended * 1.2) {
      return {
        type: "warn" as const,
        message: `${activePlatform.name} recommends ~${(recommended / 1000).toFixed(1)} Mbps for ${resolution} ${fps}fps. Your bitrate (${(result.videoBitrateKbps / 1000).toFixed(1)} Mbps) is higher than typical — viewers may buffer.`,
      };
    }
    return null;
  }, [activePlatform, result, resolution, fps]);

  // Bits-per-pixel quality indicator
  const bpp = useMemo(() => {
    if (!selectedRes) return null;
    const pixels = selectedRes.width * selectedRes.height * fps;
    if (pixels === 0) return null;
    const bitsPerSecond = result.videoBitrateKbps * 1000;
    const value = bitsPerSecond / pixels;
    let label: string;
    let color: string;
    let icon: string;
    let percent: number;
    if (value >= 0.15) {
      label = "Excellent"; color = "text-green-600"; icon = "★★★"; percent = 100;
    } else if (value >= 0.1) {
      label = "Good"; color = "text-green-500"; icon = "★★☆"; percent = 75;
    } else if (value >= 0.07) {
      label = "Acceptable"; color = "text-yellow-500"; icon = "★☆☆"; percent = 50;
    } else if (value >= 0.04) {
      label = "Low"; color = "text-orange-500"; icon = "▽"; percent = 25;
    } else {
      label = "Very Low"; color = "text-red-500"; icon = "▽▽"; percent = 10;
    }
    return { value: value.toFixed(3), label, color, icon, percent };
  }, [selectedRes, fps, result.videoBitrateKbps]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      {/* ===== INPUT PANEL ===== */}
      <div className="space-y-5" role="form" aria-label="Calculator settings">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
          <h2 className="text-lg font-bold">Settings</h2>
        </div>

        {/* Quick Presets */}
        <div>
          <span className="block text-sm font-medium mb-1.5">Quick Presets</span>
          <div className="flex flex-wrap gap-2">
            {QUICK_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setPlatform(preset.platform);
                  setResolution(preset.resolution);
                  setFps(preset.fps);
                  setCodec(preset.codec);
                  setAudioBitrate(preset.audio);
                }}
                className="rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-medium hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Platform */}
        <div>
          <label htmlFor="platform-select" className="block text-sm font-medium mb-1.5">
            Streaming Platform
          </label>
          <select
            id="platform-select"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
          >
            {PLATFORMS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Resolution */}
        <div>
          <label htmlFor="resolution-select" className="block text-sm font-medium mb-1.5">
            Resolution
          </label>
          <select
            id="resolution-select"
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
          >
            {RESOLUTIONS.map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.label} — {r.width}&times;{r.height}
              </option>
            ))}
          </select>
        </div>

        {/* Frame Rate */}
        <fieldset>
          <legend className="block text-sm font-medium mb-1.5">
            Frame Rate
          </legend>
          <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Frame rate selection">
            {FPS_OPTIONS.map((f) => (
              <button
                key={f.value}
                type="button"
                role="radio"
                aria-checked={fps === f.value}
                onClick={() => setFps(f.value)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium cursor-pointer transition-all duration-150 ${
                  fps === f.value
                    ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm scale-[1.02]"
                    : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)] hover:scale-[1.01]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Codec */}
        <fieldset>
          <legend className="block text-sm font-medium mb-1.5">
            Video Codec
          </legend>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="radiogroup" aria-label="Video codec selection">
            {CODECS.map((c) => (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={codec === c.id}
                onClick={() => setCodec(c.id)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium cursor-pointer transition-all duration-150 text-left ${
                  codec === c.id
                    ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                    : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)]"
                }`}
              >
                <span className="block">{c.label}</span>
                <span className={`text-[10px] ${codec === c.id ? "text-[var(--primary-fg-70)]" : "text-[var(--muted-foreground)]"}`}>
                  {c.efficiencyFactor === 1
                    ? "baseline"
                    : c.efficiencyFactor < 1
                    ? `${Math.round((1 - c.efficiencyFactor) * 100)}% smaller`
                    : `${c.efficiencyFactor}x size`}
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        {/* Audio Bitrate */}
        <div>
          <label htmlFor="audio-bitrate-select" className="block text-sm font-medium mb-1.5">
            Audio Bitrate
          </label>
          <select
            id="audio-bitrate-select"
            value={audioBitrate}
            onChange={(e) => setAudioBitrate(Number(e.target.value))}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
          >
            {AUDIO_BITRATE_OPTIONS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <fieldset>
          <legend className="block text-sm font-medium mb-1.5">Duration</legend>
          <div className="flex flex-wrap gap-2 mb-3">
            {DURATION_PRESETS.map((d) => (
              <button
                key={d.label}
                type="button"
                onClick={() => { setHours(d.h); setMinutes(d.m); setSeconds(d.s); }}
                className={`rounded-full border px-3 py-1 text-xs font-medium cursor-pointer transition-colors ${
                  hours === d.h && minutes === d.m && seconds === d.s
                    ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="duration-hours" className="block text-xs text-[var(--muted-foreground)] mb-1">
                Hours
              </label>
              <input
                id="duration-hours"
                type="number"
                min={0}
                max={99}
                value={hours}
                onChange={(e) => setHours(clampInt(e.target.value, 0, 99))}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
            <div>
              <label htmlFor="duration-minutes" className="block text-xs text-[var(--muted-foreground)] mb-1">
                Minutes
              </label>
              <input
                id="duration-minutes"
                type="number"
                min={0}
                max={59}
                value={minutes}
                onChange={(e) => setMinutes(clampInt(e.target.value, 0, 59))}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
            <div>
              <label htmlFor="duration-seconds" className="block text-xs text-[var(--muted-foreground)] mb-1">
                Seconds
              </label>
              <input
                id="duration-seconds"
                type="number"
                min={0}
                max={59}
                value={seconds}
                onChange={(e) => setSeconds(clampInt(e.target.value, 0, 59))}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </div>
          {/* Duration slider */}
          <input
            type="range"
            min={0}
            max={720}
            value={hours * 60 + minutes}
            aria-label="Duration in minutes"
            onChange={(e) => {
              const totalMin = Number(e.target.value);
              setHours(Math.floor(totalMin / 60));
              setMinutes(totalMin % 60);
            }}
            className="w-full mt-3"
          />
          <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-1">
            <span>0 min</span>
            <span className="font-medium text-[var(--foreground)]">
              {hours > 0 && `${hours}h `}
              {minutes > 0 && `${minutes}m `}
              {seconds > 0 && `${seconds}s`}
              {hours === 0 && minutes === 0 && seconds === 0 && "0s"}
            </span>
            <span>12 hrs</span>
          </div>
        </fieldset>
      </div>

      {/* ===== OUTPUT PANEL ===== */}
      <div className="space-y-5" aria-live="polite" aria-label="Calculator results">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <h2 className="text-lg font-bold">Results</h2>
          {selectedRes && (
            <span className="ml-auto text-xs text-[var(--muted-foreground)] bg-[var(--muted)] px-2 py-0.5 rounded-full">
              {selectedRes.width}&times;{selectedRes.height} @ {fps}fps
            </span>
          )}
        </div>

        {/* Primary result: File Size */}
        <div className="rounded-xl border-2 border-[var(--primary-20)] bg-[var(--accent)] p-6 text-center">
          <div className="text-sm text-[var(--muted-foreground)] mb-2">
            Estimated File Size
          </div>
          <div className="text-5xl font-extrabold tracking-tight text-[var(--primary)] tabular-nums">
            <AnimatedNumber value={result.fileSizeFormatted} />
          </div>
          <div className="text-xs text-[var(--muted-foreground)] mt-2">
            {result.fileSizeMB.toLocaleString()} MB &middot;{" "}
            {result.fileSizeGB} GB &middot; {result.fileSizeTB} TB
          </div>
          <div className="flex items-center justify-center gap-2 mt-3">
            <CopyButton text={resultSummary} />
            <ShareButton url={shareUrl} text={resultSummary} />
          </div>
        </div>

        {/* Platform Warning */}
        {platformWarning && (
          <div
            role="alert"
            className={`rounded-lg px-4 py-3 text-sm ${
              platformWarning.type === "error"
                ? "bg-red-500/10 border border-red-500/30 text-red-600"
                : "bg-yellow-500/10 border border-yellow-500/30 text-yellow-700"
            }`}
          >
            <span className="font-semibold">
              {platformWarning.type === "error" ? "Exceeds limit: " : "Warning: "}
            </span>
            {platformWarning.message}
          </div>
        )}

        {/* BPP Quality Indicator */}
        {bpp && (
          <div className="rounded-lg border border-[var(--border)] px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm flex items-center gap-2">
                <span className="text-[var(--muted-foreground)]">Quality:</span>
                <span className={`font-semibold ${bpp.color}`} aria-label={`Quality: ${bpp.label}`}>
                  {bpp.icon} {bpp.label}
                </span>
              </div>
              <div className="text-xs text-[var(--muted-foreground)] tabular-nums">
                {bpp.value} bits/pixel
              </div>
            </div>
            <div className="w-full h-1.5 bg-[var(--muted)] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  bpp.percent >= 75 ? "bg-green-500" : bpp.percent >= 50 ? "bg-yellow-500" : bpp.percent >= 25 ? "bg-orange-500" : "bg-red-500"
                }`}
                style={{ width: `${bpp.percent}%` }}
              />
            </div>
          </div>
        )}

        {/* Detail cards */}
        <div className="grid grid-cols-2 gap-3">
          <ResultCard
            label="Video Bitrate"
            value={`${(result.videoBitrateKbps / 1000).toFixed(1)} Mbps`}
            sub={`${result.videoBitrateKbps.toLocaleString()} Kbps`}
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
            }
          />
          <ResultCard
            label="Total Bitrate"
            value={`${result.totalBitrateMbps} Mbps`}
            sub={`${result.totalBitrateKbps.toLocaleString()} Kbps`}
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
            }
          />
          <ResultCard
            label="Upload Speed"
            value={`${result.recommendedBandwidthMbps} Mbps`}
            sub="1.5x headroom"
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
            }
          />
          <ResultCard
            label="Bandwidth/min"
            value={`${(result.totalBitrateKbps * 60 / 8 / 1024).toFixed(1)} MB`}
            sub="data per minute"
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            }
          />
        </div>

        {/* Codec comparison mini-table */}
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5">
          <h3 className="text-sm font-semibold mb-3">
            Codec Comparison
          </h3>
          <CodecComparisonTable
            resolution={resolution}
            fps={fps}
            audioBitrateKbps={audioBitrate}
            durationSeconds={durationSeconds || 1}
            activeCodec={codec}
          />
        </div>
      </div>
    </div>
  );
}
