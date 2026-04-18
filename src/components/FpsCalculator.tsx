"use client";

import { useState, useMemo } from "react";

type Mode = "duration-to-frames" | "frames-to-duration" | "slow-motion";

export default function FpsCalculator() {
  const [mode, setMode] = useState<Mode>("duration-to-frames");
  const [fps, setFps] = useState(30);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [totalFrames, setTotalFrames] = useState(1800);
  // Slow motion
  const [recordFps, setRecordFps] = useState(120);
  const [playbackFps, setPlaybackFps] = useState(30);
  const [recordDurationSec, setRecordDurationSec] = useState(10);

  const durationResult = useMemo(() => {
    const totalSec = hours * 3600 + minutes * 60 + seconds;
    const frames = Math.round(totalSec * fps);
    const comparisons = [24, 30, 60, 120].map((f) => ({
      fps: f,
      frames: Math.round(totalSec * f),
    }));
    return { totalSec, frames, comparisons };
  }, [hours, minutes, seconds, fps]);

  const framesResult = useMemo(() => {
    const sec = totalFrames / fps;
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return { sec, h, m, s: s.toFixed(2) };
  }, [totalFrames, fps]);

  const slowMoResult = useMemo(() => {
    const factor = recordFps / playbackFps;
    const playbackDuration = recordDurationSec * factor;
    return { factor, playbackDuration };
  }, [recordFps, playbackFps, recordDurationSec]);

  return (
    <div className="space-y-8">
      {/* Mode tabs */}
      <div className="flex gap-2 flex-wrap">
        {([
          ["duration-to-frames", "Duration → Frames"],
          ["frames-to-duration", "Frames → Duration"],
          ["slow-motion", "Slow Motion"],
        ] as const).map(([m, label]) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              mode === m
                ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                : "border-[var(--border)] hover:border-[var(--primary)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "duration-to-frames" && (
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
              <h2 className="text-lg font-bold">Input</h2>
            </div>
            <fieldset>
              <label className="block text-sm font-medium mb-2">Frame Rate (FPS)</label>
              <select value={fps} onChange={(e) => setFps(Number(e.target.value))} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm">
                {[24, 25, 30, 48, 50, 60, 90, 120, 144, 240].map((f) => (
                  <option key={f} value={f}>{f} fps</option>
                ))}
              </select>
            </fieldset>
            <div className="grid grid-cols-3 gap-3">
              <fieldset>
                <label className="block text-sm font-medium mb-2">Hours</label>
                <input type="number" min={0} max={99} value={hours} onChange={(e) => setHours(Number(e.target.value))} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" />
              </fieldset>
              <fieldset>
                <label className="block text-sm font-medium mb-2">Minutes</label>
                <input type="number" min={0} max={59} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" />
              </fieldset>
              <fieldset>
                <label className="block text-sm font-medium mb-2">Seconds</label>
                <input type="number" min={0} max={59} value={seconds} onChange={(e) => setSeconds(Number(e.target.value))} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" />
              </fieldset>
            </div>
            <div className="rounded-xl border-2 border-[var(--primary-20)] bg-[var(--accent)] p-5 text-center">
              <div className="text-sm text-[var(--muted-foreground)] mb-1">Total Frames</div>
              <div className="text-4xl font-extrabold tracking-tight text-[var(--primary)] tabular-nums">
                {durationResult.frames.toLocaleString()}
              </div>
              <div className="text-xs text-[var(--muted-foreground)] mt-2">
                {durationResult.totalSec.toLocaleString()} seconds at {fps} fps
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <h2 className="text-lg font-bold">Comparison</h2>
            </div>
            <div className="space-y-2">
              {durationResult.comparisons.map((c) => (
                <div key={c.fps} className={`flex justify-between items-center rounded-lg border px-4 py-3 ${c.fps === fps ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-[var(--border)]"}`}>
                  <span className="text-sm font-medium">{c.fps} fps {c.fps === fps && "✓"}</span>
                  <span className="font-bold tabular-nums">{c.frames.toLocaleString()} frames</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {mode === "frames-to-duration" && (
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
              <h2 className="text-lg font-bold">Input</h2>
            </div>
            <fieldset>
              <label className="block text-sm font-medium mb-2">Total Frames</label>
              <input type="number" min={1} value={totalFrames} onChange={(e) => setTotalFrames(Number(e.target.value))} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" />
            </fieldset>
            <fieldset>
              <label className="block text-sm font-medium mb-2">Frame Rate (FPS)</label>
              <select value={fps} onChange={(e) => setFps(Number(e.target.value))} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm">
                {[24, 25, 30, 48, 50, 60, 90, 120, 144, 240].map((f) => (
                  <option key={f} value={f}>{f} fps</option>
                ))}
              </select>
            </fieldset>
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <h2 className="text-lg font-bold">Duration</h2>
            </div>
            <div className="rounded-xl border-2 border-[var(--primary-20)] bg-[var(--accent)] p-5 text-center">
              <div className="text-sm text-[var(--muted-foreground)] mb-1">Total Duration</div>
              <div className="text-4xl font-extrabold tracking-tight text-[var(--primary)] tabular-nums">
                {framesResult.h > 0 && `${framesResult.h}h `}{framesResult.m > 0 && `${framesResult.m}m `}{framesResult.s}s
              </div>
              <div className="text-xs text-[var(--muted-foreground)] mt-2">
                {framesResult.sec.toFixed(3)} total seconds
              </div>
            </div>
          </div>
        </div>
      )}

      {mode === "slow-motion" && (
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
              <h2 className="text-lg font-bold">Recording Settings</h2>
            </div>
            <fieldset>
              <label className="block text-sm font-medium mb-2">Recording FPS</label>
              <select value={recordFps} onChange={(e) => setRecordFps(Number(e.target.value))} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm">
                {[60, 90, 120, 144, 240, 480, 960].map((f) => (
                  <option key={f} value={f}>{f} fps</option>
                ))}
              </select>
            </fieldset>
            <fieldset>
              <label className="block text-sm font-medium mb-2">Playback FPS</label>
              <select value={playbackFps} onChange={(e) => setPlaybackFps(Number(e.target.value))} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm">
                {[24, 25, 30, 60].map((f) => (
                  <option key={f} value={f}>{f} fps</option>
                ))}
              </select>
            </fieldset>
            <fieldset>
              <label className="block text-sm font-medium mb-2">Recording Duration (seconds)</label>
              <input type="number" min={1} max={3600} value={recordDurationSec} onChange={(e) => setRecordDurationSec(Number(e.target.value))} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" />
            </fieldset>
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <h2 className="text-lg font-bold">Slow Motion Result</h2>
            </div>
            <div className="rounded-xl border-2 border-[var(--primary-20)] bg-[var(--accent)] p-5 text-center">
              <div className="text-sm text-[var(--muted-foreground)] mb-1">Slow Motion Factor</div>
              <div className="text-4xl font-extrabold tracking-tight text-[var(--primary)] tabular-nums">
                {slowMoResult.factor.toFixed(1)}× slower
              </div>
              <div className="text-xs text-[var(--muted-foreground)] mt-2">
                {recordDurationSec}s recording → {slowMoResult.playbackDuration.toFixed(1)}s playback
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-[var(--border)] p-3 text-center">
                <div className="text-xs text-[var(--muted-foreground)]">Total Frames</div>
                <div className="font-bold tabular-nums">{(recordDurationSec * recordFps).toLocaleString()}</div>
              </div>
              <div className="rounded-lg border border-[var(--border)] p-3 text-center">
                <div className="text-xs text-[var(--muted-foreground)]">Playback Duration</div>
                <div className="font-bold tabular-nums">{slowMoResult.playbackDuration.toFixed(1)}s</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
