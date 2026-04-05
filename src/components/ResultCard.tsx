import React from "react";

interface ResultCardProps {
  label: string;
  value: string;
  sub: string;
  icon?: React.ReactNode;
}

/**
 * A single result metric card used in the calculator output panel.
 */
export default function ResultCard({ label, value, sub, icon }: ResultCardProps) {
  return (
    <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card)] p-4 hover:border-[var(--primary-30)] transition-colors">
      <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] mb-1">
        {icon}
        {label}
      </div>
      <div className="text-lg font-bold tabular-nums">{value}</div>
      <div className="text-xs text-[var(--muted-foreground)]">{sub}</div>
    </div>
  );
}
