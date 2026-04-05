import React from "react";
import Link from "next/link";

interface ResultCardProps {
  label: string;
  value: string;
  sub: string;
  icon?: React.ReactNode;
  href?: string;
}

/**
 * A single result metric card used in the calculator output panel.
 * Optionally links to a related tool when href is provided.
 */
export default function ResultCard({ label, value, sub, icon, href }: ResultCardProps) {
  const content = (
    <>
      <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] mb-1">
        {icon}
        {label}
        {href && (
          <span className="ml-auto text-[10px] text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity">
            Explore →
          </span>
        )}
      </div>
      <div className="text-lg font-bold tabular-nums">{value}</div>
      <div className="text-xs text-[var(--muted-foreground)]">{sub}</div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group block rounded-lg border border-[var(--card-border)] bg-[var(--card)] p-4 hover:border-[var(--primary)] transition-colors"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card)] p-4 hover:border-[var(--primary-30)] transition-colors">
      {content}
    </div>
  );
}
