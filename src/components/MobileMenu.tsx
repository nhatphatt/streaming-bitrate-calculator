"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

const TOOL_ITEMS = [
  { href: "/", label: "Bitrate Calculator" },
  { href: "/tools/bandwidth-calculator/", label: "Bandwidth Calculator" },
  { href: "/tools/upload-time-calculator/", label: "Upload Time Calculator" },
  { href: "/tools/recording-time-calculator/", label: "Recording Time Calculator" },
  { href: "/tools/aspect-ratio-calculator/", label: "Aspect Ratio Calculator" },
  { href: "/tools/compression-calculator/", label: "Compression Calculator" },
  { href: "/tools/fps-calculator/", label: "FPS Calculator" },
  { href: "/tools/disk-space-planner/", label: "Disk Space Planner" },
];

const BROWSE_ITEMS = [
  { href: "/size/", label: "All Resolutions" },
  { href: "/compare/", label: "Compare Codecs" },
  { href: "/platforms/", label: "Platform Settings" },
  { href: "/tools/", label: "All Tools" },
];

const OTHER_ITEMS = [
  { href: "/blog/", label: "Blog" },
  { href: "/about/", label: "About" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open]);

  // Focus trap
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "Tab" || !menuRef.current) return;
      const focusable = menuRef.current.querySelectorAll<HTMLElement>(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    []
  );

  // Focus first item when opening
  useEffect(() => {
    if (open && menuRef.current) {
      const firstLink = menuRef.current.querySelector<HTMLElement>("a");
      firstLink?.focus();
    }
  }, [open]);

  return (
    <div className="md:hidden flex items-center">
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] focus:outline-none"
        aria-label="Toggle mobile menu"
        aria-expanded={open}
        aria-controls="mobile-nav"
      >
        {open ? (
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 top-[60px] bg-black/20 z-40 md:hidden animate-fade-in"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <div
        ref={menuRef}
        id="mobile-nav"
        role="navigation"
        aria-label="Mobile navigation"
        onKeyDown={handleKeyDown}
        className={`absolute top-[60px] left-0 right-0 bg-[var(--background)] border-b border-[var(--border)] shadow-lg p-4 flex flex-col gap-1 md:hidden z-50 transition-all duration-200 ease-out ${
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        {/* Tools section */}
        <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider px-2 pt-1 pb-1">
          Calculators
        </p>
        {TOOL_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-base font-medium hover:text-[var(--primary)] text-[var(--foreground)] transition-colors px-2 py-2 rounded-lg hover:bg-[var(--muted)]"
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}

        {/* Separator */}
        <div className="border-t border-[var(--border)] my-2" />

        {/* Browse section */}
        <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider px-2 pt-1 pb-1">
          Browse
        </p>
        {BROWSE_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-base font-medium hover:text-[var(--primary)] text-[var(--foreground)] transition-colors px-2 py-2 rounded-lg hover:bg-[var(--muted)]"
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}

        {/* Separator */}
        <div className="border-t border-[var(--border)] my-2" />

        {/* Other */}
        {OTHER_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-base font-medium hover:text-[var(--primary)] text-[var(--foreground)] transition-colors px-2 py-2 rounded-lg hover:bg-[var(--muted)]"
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
