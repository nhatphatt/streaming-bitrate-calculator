import Link from "next/link";

interface Tool {
  href: string;
  title: string;
  description: string;
  icon: string;
}

const ALL_TOOLS: Tool[] = [
  {
    href: "/",
    title: "Bitrate & File Size Calculator",
    description: "Calculate video file size for any resolution, codec, and duration",
    icon: "📐",
  },
  {
    href: "/tools/bandwidth-calculator/",
    title: "Bandwidth Calculator",
    description: "Check if your internet speed can handle your stream settings",
    icon: "📡",
  },
  {
    href: "/tools/upload-time-calculator/",
    title: "Upload Time Calculator",
    description: "Estimate how long your video file will take to upload",
    icon: "⏱️",
  },
  {
    href: "/tools/recording-time-calculator/",
    title: "Recording Time Calculator",
    description: "Find out how much recording fits on your storage drive",
    icon: "💾",
  },
  {
    href: "/compare/",
    title: "Codec Comparison",
    description: "Compare file sizes across H.264, HEVC, AV1, and ProRes",
    icon: "⚖️",
  },
  {
    href: "/tools/aspect-ratio-calculator/",
    title: "Aspect Ratio Calculator",
    description: "Calculate aspect ratio for YouTube, TikTok, Instagram, and more",
    icon: "📐",
  },
  {
    href: "/tools/compression-calculator/",
    title: "Compression Calculator",
    description: "Estimate file size after converting between video codecs",
    icon: "🗜️",
  },
  {
    href: "/tools/fps-calculator/",
    title: "FPS Calculator",
    description: "Calculate frames, duration, and slow-motion playback",
    icon: "🎞️",
  },
  {
    href: "/tools/disk-space-planner/",
    title: "Disk Space Planner",
    description: "Plan storage needs based on your streaming schedule",
    icon: "💿",
  },
];

interface RelatedToolsProps {
  /** Current page path to exclude from the list */
  current: string;
}

export default function RelatedTools({ current }: RelatedToolsProps) {
  const tools = ALL_TOOLS.filter((t) => t.href !== current);

  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span className="text-[var(--primary)]">→</span> Related Tools
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group flex items-start gap-3 rounded-xl border border-[var(--border)] p-4 hover:border-[var(--primary)] hover:bg-[var(--accent)] transition-colors"
          >
            <span className="text-xl mt-0.5" aria-hidden="true">
              {tool.icon}
            </span>
            <div>
              <div className="font-semibold text-sm group-hover:text-[var(--primary)] transition-colors">
                {tool.title}
              </div>
              <div className="text-xs text-[var(--muted-foreground)] mt-0.5">
                {tool.description}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
