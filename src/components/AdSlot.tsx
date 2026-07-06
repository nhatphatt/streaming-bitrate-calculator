import AdsterraBanner from "./adsterra/AdsterraBanner";
import AdsterraNative from "./adsterra/AdsterraNative";

// Placement slot used across pages.
// - "native": Adsterra Native Banner (blends with content)
// - "mobile": forces the 320x50 unit
// - everything else: responsive display banner (468x60 desktop / 320x50 mobile)
interface AdSlotProps {
  format?: "banner" | "native" | "leaderboard" | "mobile" | "sidebar";
  className?: string;
}

export default function AdSlot({ format = "banner", className }: AdSlotProps) {
  if (format === "native") return <AdsterraNative className={className} />;
  const variant = format === "mobile" ? "banner320" : "responsive";
  return <AdsterraBanner variant={variant} className={className} />;
}
