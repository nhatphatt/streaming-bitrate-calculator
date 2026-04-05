"use client";

import { useState, useCallback } from "react";

interface ShareButtonProps {
  url: string;
  text: string;
  className?: string;
}

export default function ShareButton({ url, text, className = "" }: ShareButtonProps) {
  const [shared, setShared] = useState(false);

  const handleShare = useCallback(async () => {
    // Try native share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({ title: "StreamerSize Result", text, url });
        return;
      } catch {
        // user cancelled or not supported
      }
    }

    // Fallback: copy URL
    try {
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      // ignore
    }
  }, [url, text]);

  return (
    <button
      onClick={handleShare}
      title={shared ? "Link copied!" : "Share result"}
      className={`inline-flex items-center gap-1 rounded-md border border-[var(--border)] px-2 py-1 text-xs text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors cursor-pointer ${className}`}
    >
      {shared ? (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Link copied
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          Share
        </>
      )}
    </button>
  );
}
