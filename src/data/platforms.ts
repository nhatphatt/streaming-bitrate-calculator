export interface PlatformPreset {
  id: string;
  name: string;
  maxBitrateKbps: number;
  recommendedBitrateKbps: Record<string, number>;
  notes: string;
}

export const PLATFORMS: PlatformPreset[] = [
  {
    id: "none",
    name: "No Platform (Custom)",
    maxBitrateKbps: Infinity,
    recommendedBitrateKbps: {},
    notes: "",
  },
  {
    id: "twitch",
    name: "Twitch",
    maxBitrateKbps: 6000,
    recommendedBitrateKbps: {
      "720p-30": 2500,
      "720p-60": 4000,
      "1080p-30": 4500,
      "1080p-60": 6000,
    },
    notes: "Non-partners are limited to 6,000 Kbps. Partners can go higher but transcoding is not guaranteed above 6,000 Kbps.",
  },
  {
    id: "youtube",
    name: "YouTube Live",
    maxBitrateKbps: 51000,
    recommendedBitrateKbps: {
      "720p-30": 2500,
      "720p-60": 4000,
      "1080p-30": 4500,
      "1080p-60": 9000,
      "1440p-30": 10000,
      "1440p-60": 15000,
      "4k-30": 25000,
      "4k-60": 40000,
    },
    notes: "YouTube transcodes all streams. Higher source bitrate = better quality at all viewer quality levels.",
  },
  {
    id: "kick",
    name: "Kick",
    maxBitrateKbps: 8000,
    recommendedBitrateKbps: {
      "720p-30": 3000,
      "720p-60": 4500,
      "1080p-30": 5000,
      "1080p-60": 7000,
    },
    notes: "Most streamers are limited to 8,000 Kbps. Similar requirements to Twitch.",
  },
  {
    id: "facebook",
    name: "Facebook Gaming",
    maxBitrateKbps: 8000,
    recommendedBitrateKbps: {
      "720p-30": 3000,
      "720p-60": 4500,
      "1080p-30": 5000,
      "1080p-60": 7000,
    },
    notes: "Facebook recommends max 8,000 Kbps for 1080p. 720p at 4,000 Kbps works well for most streams.",
  },
  {
    id: "discord",
    name: "Discord (Nitro)",
    maxBitrateKbps: 8000,
    recommendedBitrateKbps: {
      "720p-30": 2500,
      "720p-60": 4000,
      "1080p-30": 5000,
      "1080p-60": 8000,
    },
    notes: "Free users limited to 720p. Nitro users can stream up to 1080p 60fps at 8,000 Kbps.",
  },
];

export function getPlatformById(id: string): PlatformPreset | undefined {
  return PLATFORMS.find((p) => p.id === id);
}
