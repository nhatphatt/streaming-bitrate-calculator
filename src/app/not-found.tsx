import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="text-6xl font-extrabold text-[var(--primary)] mb-4">
        404
      </h1>
      <p className="text-xl text-[var(--muted-foreground)] mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-4">
        <a
          href="/"
          className="rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] px-5 py-2.5 font-medium text-sm hover:opacity-90 transition-opacity"
        >
          Back to Calculator
        </a>
        <a
          href="/size/"
          className="rounded-lg border border-[var(--border)] px-5 py-2.5 font-medium text-sm hover:border-[var(--primary)] transition-colors"
        >
          Browse All Resolutions
        </a>
      </div>
    </div>
  );
}
