"use client";

import { useState } from "react";
import AdsterraBanner from "./AdsterraBanner";

/**
 * Mobile-only sticky 320x50 banner pinned to the bottom of the viewport.
 * Highest-CTR placement for mobile traffic. Dismissable, and hidden on
 * >=sm screens where the in-content 468x60 banners run instead.
 */
export default function AdsterraStickyBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] flex justify-center sm:hidden">
      <div className="relative flex items-center justify-center border-t border-[var(--border)] bg-[var(--background-80)] px-2 py-1 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Close ad"
          className="absolute -top-6 right-1 flex h-6 w-6 items-center justify-center rounded-t-md border border-b-0 border-[var(--border)] bg-[var(--background-80)] text-xs text-[var(--muted-foreground)] backdrop-blur-md"
        >
          &times;
        </button>
        <AdsterraBanner variant="banner320" className="my-0" />
      </div>
    </div>
  );
}
