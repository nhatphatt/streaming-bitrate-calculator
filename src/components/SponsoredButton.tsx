import { ADSTERRA_SMARTLINK } from "@/lib/adsterra";

// Adsterra Smartlink rendered as a sponsored button. rel="sponsored nofollow"
// keeps it correctly attributed for SEO even without a visible "Ad" badge.
interface SponsoredButtonProps {
  className?: string;
}

export default function SponsoredButton({ className = "" }: SponsoredButtonProps) {
  return (
    <div className={`my-4 flex w-full justify-center ${className}`}>
      <a
        href={ADSTERRA_SMARTLINK}
        target="_blank"
        rel="nofollow sponsored noopener"
        className="group inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:border-[var(--brand)] hover:text-[var(--foreground)]"
      >
        <span>Recommended tools &amp; offers for streamers</span>
        <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
          &rarr;
        </span>
      </a>
    </div>
  );
}
