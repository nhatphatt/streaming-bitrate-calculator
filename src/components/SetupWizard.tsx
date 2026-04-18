"use client";

import { useState } from "react";
import Link from "next/link";

type Step = "platform" | "speed" | "content" | "encoder" | "result";

const PLATFORMS = [
  { id: "twitch", label: "Twitch", maxKbps: 6000 },
  { id: "youtube", label: "YouTube", maxKbps: 51000 },
  { id: "kick", label: "Kick", maxKbps: 8000 },
  { id: "facebook", label: "Facebook", maxKbps: 8000 },
];

const CONTENT_TYPES = [
  { id: "fps", label: "Fast-paced FPS", desc: "Fortnite, Valorant, Warzone, Apex", bitrateMultiplier: 1.0 },
  { id: "moba", label: "MOBA / Strategy", desc: "LoL, Dota 2, Civ, RTS", bitrateMultiplier: 0.8 },
  { id: "casual", label: "Casual / Sandbox", desc: "Minecraft, Stardew, Animal Crossing", bitrateMultiplier: 0.75 },
  { id: "chatting", label: "Just Chatting / IRL", desc: "Webcam, talk shows, cooking", bitrateMultiplier: 0.6 },
  { id: "creative", label: "Creative / Art", desc: "Drawing, music, coding", bitrateMultiplier: 0.5 },
];

const ENCODERS = [
  { id: "nvenc", label: "NVIDIA GPU (NVENC)", desc: "RTX 2060 or newer", preset: "P5 (Slow)" },
  { id: "amf", label: "AMD GPU (AMF)", desc: "RX 6000 or newer", preset: "Quality" },
  { id: "x264", label: "CPU (x264)", desc: "Ryzen 7/i7 or better", preset: "Fast" },
];

export default function SetupWizard() {
  const [step, setStep] = useState<Step>("platform");
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [uploadMbps, setUploadMbps] = useState(20);
  const [content, setContent] = useState(CONTENT_TYPES[0]);
  const [encoder, setEncoder] = useState(ENCODERS[0]);

  function getRecommendation() {
    const maxByPlatform = platform.maxKbps;
    const maxByUpload = uploadMbps * 1000 * 0.75;
    const availableKbps = Math.min(maxByPlatform, maxByUpload);

    let resolution: string;
    let fps: number;
    let bitrateKbps: number;

    if (availableKbps >= 9000) {
      resolution = "1080p"; fps = 60;
      bitrateKbps = Math.min(availableKbps, content.id === "chatting" ? 6000 : 9000);
    } else if (availableKbps >= 6000) {
      resolution = "1080p"; fps = 60;
      bitrateKbps = Math.round(6000 * content.bitrateMultiplier);
      bitrateKbps = Math.max(bitrateKbps, 4500);
    } else if (availableKbps >= 4000) {
      resolution = "720p"; fps = 60;
      bitrateKbps = Math.round(availableKbps * content.bitrateMultiplier);
      bitrateKbps = Math.max(bitrateKbps, 3000);
    } else {
      resolution = "720p"; fps = 30;
      bitrateKbps = Math.round(availableKbps * content.bitrateMultiplier);
      bitrateKbps = Math.max(bitrateKbps, 2000);
    }

    bitrateKbps = Math.min(bitrateKbps, maxByPlatform);

    return { resolution, fps, bitrateKbps, encoder: encoder.label, preset: encoder.preset, availableKbps: Math.round(availableKbps) };
  }

  const rec = getRecommendation();

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex gap-1 mb-8">
        {(["platform", "speed", "content", "encoder", "result"] as Step[]).map((s, i) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full ${i <= ["platform", "speed", "content", "encoder", "result"].indexOf(step) ? "bg-[var(--primary)]" : "bg-[var(--muted)]"}`} />
        ))}
      </div>

      {step === "platform" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Where do you stream?</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                onClick={() => { setPlatform(p); setStep("speed"); }}
                className={`text-left p-4 rounded-xl border-2 transition-all ${platform.id === p.id ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-[var(--border)] hover:border-[var(--primary)]"}`}
              >
                <div className="font-bold">{p.label}</div>
                <div className="text-sm text-[var(--muted-foreground)]">Max {(p.maxKbps / 1000).toFixed(0)} Mbps</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === "speed" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">What&apos;s your upload speed?</h2>
          <p className="text-[var(--muted-foreground)]">Check at <a href="https://www.speedtest.net" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] underline">speedtest.net</a> if unsure.</p>
          <fieldset>
            <label className="block text-sm font-medium mb-2">Upload Speed: <strong>{uploadMbps} Mbps</strong></label>
            <input type="range" min={3} max={100} value={uploadMbps} onChange={(e) => setUploadMbps(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-1"><span>3 Mbps</span><span>100 Mbps</span></div>
          </fieldset>
          <div className="flex gap-3">
            <button onClick={() => setStep("platform")} className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm">Back</button>
            <button onClick={() => setStep("content")} className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-medium">Next</button>
          </div>
        </div>
      )}

      {step === "content" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">What do you stream?</h2>
          <div className="space-y-2">
            {CONTENT_TYPES.map((c) => (
              <button
                key={c.id}
                onClick={() => { setContent(c); setStep("encoder"); }}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${content.id === c.id ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-[var(--border)] hover:border-[var(--primary)]"}`}
              >
                <div className="font-bold">{c.label}</div>
                <div className="text-sm text-[var(--muted-foreground)]">{c.desc}</div>
              </button>
            ))}
          </div>
          <button onClick={() => setStep("speed")} className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm">Back</button>
        </div>
      )}

      {step === "encoder" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">What encoder will you use?</h2>
          <div className="space-y-2">
            {ENCODERS.map((e) => (
              <button
                key={e.id}
                onClick={() => { setEncoder(e); setStep("result"); }}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${encoder.id === e.id ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-[var(--border)] hover:border-[var(--primary)]"}`}
              >
                <div className="font-bold">{e.label}</div>
                <div className="text-sm text-[var(--muted-foreground)]">{e.desc}</div>
              </button>
            ))}
          </div>
          <button onClick={() => setStep("content")} className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm">Back</button>
        </div>
      )}

      {step === "result" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Your Recommended Settings</h2>
          <div className="rounded-xl border-2 border-[var(--primary)] bg-[var(--primary)]/5 p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><div className="text-xs text-[var(--muted-foreground)]">Platform</div><div className="font-bold">{platform.label}</div></div>
              <div><div className="text-xs text-[var(--muted-foreground)]">Resolution</div><div className="font-bold">{rec.resolution}</div></div>
              <div><div className="text-xs text-[var(--muted-foreground)]">Frame Rate</div><div className="font-bold">{rec.fps} fps</div></div>
              <div><div className="text-xs text-[var(--muted-foreground)]">Bitrate</div><div className="font-bold">{rec.bitrateKbps.toLocaleString()} Kbps</div></div>
              <div><div className="text-xs text-[var(--muted-foreground)]">Encoder</div><div className="font-bold">{rec.encoder}</div></div>
              <div><div className="text-xs text-[var(--muted-foreground)]">Preset</div><div className="font-bold">{rec.preset}</div></div>
            </div>
            <div className="border-t border-[var(--border)] pt-3 text-sm text-[var(--muted-foreground)]">
              <strong>OBS Settings:</strong> Rate Control: CBR · Keyframe Interval: 2s · Profile: High · B-frames: 2
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/" className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:opacity-90">
              Calculate File Size →
            </Link>
            <Link href={`/platforms/${platform.id}/`} className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium hover:border-[var(--primary)]">
              {platform.label} Full Guide →
            </Link>
            <button onClick={() => setStep("platform")} className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm">
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
