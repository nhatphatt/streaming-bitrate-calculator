import AdsterraBanner from "./adsterra/AdsterraBanner";

// Placement slot used across pages. Renders a responsive Adsterra display
// banner (468x60 desktop / 320x50 mobile).
interface AdUnitProps {
  format?: "auto" | "horizontal" | "rectangle";
  className?: string;
}

export default function AdUnit({ className }: AdUnitProps) {
  return <AdsterraBanner variant="responsive" className={className} />;
}
