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
import Link from "next/link";

interface HistoryEntry {
  resolution: string;
  fps: number;
  codec: string;
  fileSize: string;
  bitrate: string;
  timestamp: number;
}

const HISTORY_KEY = "calc-history";
const MAX_HISTORY = 5;

function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveHistory(entry: HistoryEntry) {
  const history = loadHistory();
  // Dedupe by settings
  const filtered = history.filter(
    (h) => !(h.resolution === entry.resolution && h.fps === entry.fps && h.codec === entry.codec)
  );
  filtered.unshift(entry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered.slice(0, MAX_HISTORY)));
}

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
  const [history, setHistory] = useState<HistoryEntry[]>([]);

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

  // Load history on mount
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  // Save to history when result changes (debounced by resolution/fps/codec)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const entry: HistoryEntry = {
      resolution,
      fps,
      codec,
      fileSize: result.fileSizeFormatted,
      bitrate: result.totalBitrateMbps + " Mbps",
      timestamp: Date.now(),
    };
    saveHistory(entry);
    setHistory(loadHistory());
  }, [resolution, fps, codec, result.fileSizeFormatted, result.totalBitrateMbps]);

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
    let badge: string;
    let percent: number;
    let tone: "excellent" | "good" | "ok" | "low" | "poor";
    if (value >= 0.15) {
      label = "Excellent"; badge = "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/40"; percent = 100; tone = "excellent";
    } else if (value >= 0.1) {
      label = "Good"; badge = "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/40"; percent = 75; tone = "good";
    } else if (value >= 0.07) {
      label = "Acceptable"; badge = "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/40"; percent = 50; tone = "ok";
    } else if (value >= 0.04) {
      label = "Low"; badge = "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/40"; percent = 25; tone = "low";
    } else {
      label = "Very Low"; badge = "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/40"; percent = 10; tone = "poor";
    }
    return { value: value.toFixed(3), label, badge, percent, tone };
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
      <div id="calculator-results" className="space-y-5 pb-24 lg:pb-0" aria-live="polite" aria-label="Calculator results">
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
          <div
            className="rounded-lg border border-[var(--border)] px-4 py-3"
            title="Bits-per-pixel — a quality density metric. Higher = more visual data per pixel = better detail retention."
          >
            <div className="flex items-center justify-between mb-2 gap-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[var(--muted-foreground)]">Quality:</span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${bpp.badge}`}
                  aria-label={`Quality rating: ${bpp.label}`}
                >
                  <span aria-hidden="true">●</span> {bpp.label}
                </span>
              </div>
              <div className="text-xs text-[var(--muted-foreground)] tabular-nums">
                {bpp.value} bits/pixel
              </div>
            </div>
            <div className="w-full h-1.5 bg-[var(--muted)] rounded-full overflow-hidden" aria-hidden="true">
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
            href="/tools/bandwidth-calculator/"
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
            }
          />
          <ResultCard
            label="Bandwidth/min"
            value={`${(result.totalBitrateKbps * 60 / 8 / 1024).toFixed(1)} MB`}
            sub="data per minute"
            href="/tools/upload-time-calculator/"
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

        {/* Recent calculations (localStorage) */}
        {history.length > 1 && (
          <details className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5 open:pb-3">
            <summary className="text-sm font-semibold cursor-pointer">
              Recent calculations
              <span className="text-xs text-[var(--muted-foreground)] font-normal ml-2">({history.length})</span>
            </summary>
            <ul className="mt-4 grid gap-2">
              {history.map((h) => {
                const isCurrent = h.resolution === resolution && h.fps === fps && h.codec === codec;
                return (
                  <li key={h.timestamp}>
                    <button
                      type="button"
                      onClick={() => {
                        setResolution(h.resolution);
                        setFps(h.fps);
                        setCodec(h.codec);
                      }}
                      disabled={isCurrent}
                      className={`w-full flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                        isCurrent
                          ? "border-[var(--primary)] bg-[var(--accent)] cursor-default"
                          : "border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--accent)] cursor-pointer"
                      }`}
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <span className="font-semibold tabular-nums whitespace-nowrap">
                          {h.resolution} · {h.fps}fps · {h.codec.toUpperCase()}
                        </span>
                      </span>
                      <span className="text-[var(--muted-foreground)] tabular-nums whitespace-nowrap">
                        {h.fileSize}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </details>
        )}

        {/* Next Steps */}
        <div className="rounded-xl border border-dashed border-[var(--primary-30)] bg-[var(--accent)] p-5">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <span className="text-[var(--primary)]">→</span> What&apos;s Next?
          </h3>
          <div className="grid gap-2">
            <Link
              href={`/tools/upload-time-calculator/`}
              className="group flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-[var(--background)] transition-colors"
            >
              <span className="text-base" aria-hidden="true">⏱️</span>
              <div>
                <span className="text-sm font-medium group-hover:text-[var(--primary)] transition-colors">
                  How long to upload {result.fileSizeFormatted}?
                </span>
                <span className="block text-xs text-[var(--muted-foreground)]">
                  Estimate upload time for your file
                </span>
              </div>
            </Link>
            <Link
              href={`/tools/bandwidth-calculator/`}
              className="group flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-[var(--background)] transition-colors"
            >
              <span className="text-base" aria-hidden="true">📡</span>
              <div>
                <span className="text-sm font-medium group-hover:text-[var(--primary)] transition-colors">
                  Can your internet handle {result.totalBitrateMbps} Mbps?
                </span>
                <span className="block text-xs text-[var(--muted-foreground)]">
                  Check bandwidth requirements
                </span>
              </div>
            </Link>
            <Link
              href={`/tools/recording-time-calculator/`}
              className="group flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-[var(--background)] transition-colors"
            >
              <span className="text-base" aria-hidden="true">💾</span>
              <div>
                <span className="text-sm font-medium group-hover:text-[var(--primary)] transition-colors">
                  How much recording fits on your drive?
                </span>
                <span className="block text-xs text-[var(--muted-foreground)]">
                  Plan storage for {resolution} {fps}fps
                </span>
              </div>
            </Link>
            <Link
              href={`/compare/`}
              className="group flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-[var(--background)] transition-colors"
            >
              <span className="text-base" aria-hidden="true">⚖️</span>
              <div>
                <span className="text-sm font-medium group-hover:text-[var(--primary)] transition-colors">
                  Compare all codecs in detail
                </span>
                <span className="block text-xs text-[var(--muted-foreground)]">
                  See full codec comparison chart
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile sticky result bar — appears once user scrolls past inputs */}
      <div
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[var(--border)] bg-[var(--background-80)] backdrop-blur-md px-4 py-2.5 flex items-center justify-between gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]"
        role="status"
        aria-live="polite"
        aria-label="Current calculation result"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wide text-[var(--muted-foreground)] leading-tight">File size</div>
            <div className="text-base font-bold text-[var(--primary)] tabular-nums truncate">{result.fileSizeFormatted}</div>
          </div>
          <div className="border-l border-[var(--border)] pl-3 ml-1 min-w-0">
            <div className="text-[10px] uppercase tracking-wide text-[var(--muted-foreground)] leading-tight">Bitrate</div>
            <div className="text-sm font-semibold tabular-nums truncate">{result.totalBitrateMbps} <span className="text-[10px] text-[var(--muted-foreground)] font-normal">Mbps</span></div>
          </div>
        </div>
        <a
          href="#calculator-results"
          className="rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] px-3 py-1.5 text-xs font-semibold whitespace-nowrap hover:opacity-90 transition-opacity"
        >
          See details ↓
        </a>
      </div>
    </div>
  );
}
