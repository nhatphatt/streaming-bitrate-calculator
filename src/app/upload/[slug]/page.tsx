import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import SponsoredButton from "@/components/SponsoredButton";
import {
  getAllUploadSlugs,
  getUploadCombo,
  calcUploadSeconds,
  formatDuration,
  formatRealDuration,
  getUploadInsight,
  FILE_SIZES,
  SPEEDS,
  getAllUploadCombos,
} from "@/lib/upload-seo";

// SSG
export function generateStaticParams() {
  return getAllUploadSlugs().map((slug) => ({ slug }));
}

// Metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const combo = getUploadCombo(slug);
  if (!combo) return { title: "Not Found" };

  const secs = calcUploadSeconds(combo.sizeMB, combo.speedMbps);
  const dur = formatDuration(secs);

  const title = `How Long to Upload ${combo.sizeLabel} at ${combo.speedLabel}? — ${dur}`;
  const description = `It takes approximately ${dur} to upload a ${combo.sizeLabel} file with a ${combo.speedLabel} upload speed (${formatRealDuration(secs)} in real-world conditions). Free calculator with speed comparison table.`;

  return {
    title,
    description,
    alternates: { canonical: `/upload/${slug}/` },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/upload/${slug}/`,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
  };
}

// Page
export default async function UploadTimePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const combo = getUploadCombo(slug);

  if (!combo) {
    return <p>Invalid file size / speed combination.</p>;
  }

  const secs = calcUploadSeconds(combo.sizeMB, combo.speedMbps);
  const dur = formatDuration(secs);
  const realDur = formatRealDuration(secs);
  const insight = getUploadInsight(combo);

  // Comparison: same file at all speeds
  const speedComparison = SPEEDS.map((speed) => {
    const s = calcUploadSeconds(combo.sizeMB, speed.mbps);
    return {
      speed: speed.label,
      slug: `${slug.split("-on-")[0]}-on-${speed.slug}`,
      theoretical: formatDuration(s),
      realistic: formatRealDuration(s),
      isCurrent: speed.mbps === combo.speedMbps,
    };
  });

  // Comparison: same speed, different file sizes
  const sizeComparison = FILE_SIZES.filter((f) => {
    const s = calcUploadSeconds(f.mb, combo.speedMbps);
    return s >= 2 && s <= 7 * 86400;
  }).map((f) => {
    const s = calcUploadSeconds(f.mb, combo.speedMbps);
    return {
      size: f.label,
      slug: `${f.slug}-on-${slug.split("-on-")[1]}`,
      theoretical: formatDuration(s),
      realistic: formatRealDuration(s),
      isCurrent: f.mb === combo.sizeMB,
    };
  });

  // Related combos for internal linking
  const allCombos = getAllUploadCombos();
  const sameSizeCombos = allCombos
    .filter((c) => c.sizeMB === combo.sizeMB && c.speedMbps !== combo.speedMbps)
    .slice(0, 4);
  const sameSpeedCombos = allCombos
    .filter((c) => c.speedMbps === combo.speedMbps && c.sizeMB !== combo.sizeMB)
    .slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: `How long does it take to upload ${combo.sizeLabel} at ${combo.speedLabel}?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `At ${combo.speedLabel} upload speed, a ${combo.sizeLabel} file takes approximately ${dur} under ideal conditions and ${realDur} in real-world conditions (80% efficiency).`,
                },
              },
              {
                "@type": "Question",
                name: `What upload speed do I need to upload ${combo.sizeLabel} in under 1 hour?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `To upload ${combo.sizeLabel} in under 1 hour, you need at least ${((combo.sizeMB * 8) / 3600 / 0.8).toFixed(1)} Mbps of real-world upload speed.`,
                },
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://streamersize.com/" },
              { "@type": "ListItem", position: 2, name: "Upload Time Calculator", item: "https://streamersize.com/tools/upload-time-calculator/" },
              { "@type": "ListItem", position: 3, name: `${combo.sizeLabel} at ${combo.speedLabel}`, item: `https://streamersize.com/upload/${slug}/` },
            ],
          }),
        }}
      />

      <div className="flex flex-col gap-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-[var(--muted-foreground)]">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li><Link href="/" className="hover:text-[var(--primary)] transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/tools/upload-time-calculator/" className="hover:text-[var(--primary)] transition-colors">Upload Time Calculator</Link></li>
            <li>/</li>
            <li className="text-[var(--foreground)] font-medium">{combo.sizeLabel} at {combo.speedLabel}</li>
          </ol>
        </nav>

        {/* Hero */}
        <section>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            How Long to Upload {combo.sizeLabel} at {combo.speedLabel}?
          </h1>
          <p className="text-[var(--muted-foreground)] text-lg max-w-2xl">
            With a <strong>{combo.speedLabel}</strong> upload connection, a{" "}
            <strong>{combo.sizeLabel}</strong> file takes approximately{" "}
            <strong className="text-[var(--primary)]">{dur}</strong> under ideal
            conditions.
          </p>
        </section>

        {/* Result */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border-2 border-[var(--primary-20)] bg-[var(--accent)] p-6 text-center">
            <div className="text-sm text-[var(--muted-foreground)] mb-2">Theoretical (100%)</div>
            <div className="text-4xl font-extrabold text-[var(--primary)] tabular-nums">{dur}</div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 text-center">
            <div className="text-sm text-[var(--muted-foreground)] mb-2">Real-world (~80% efficiency)</div>
            <div className="text-4xl font-extrabold tabular-nums">{realDur}</div>
          </div>
        </section>

        {/* Context — unique per file size + speed tier */}
        <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="text-xl font-bold mb-3">
            What {combo.sizeLabel} at {combo.speedLabel} actually means
          </h2>
          <p className="text-[var(--muted-foreground)] leading-relaxed mb-3">
            A <strong>{combo.sizeLabel}</strong> file is roughly the size of {insight.sizeExamples}
            {" "}— the kind of transfer you&apos;d do when {insight.useCase}. At{" "}
            <strong>{combo.speedLabel}</strong> ({insight.speedTierName}), {insight.speedBlurb}
          </p>
          <p className="text-[var(--muted-foreground)] leading-relaxed">
            {insight.durationTip} To move a file this size in under an hour, you&apos;d need at
            least <strong>{insight.mbpsForOneHour.toFixed(1)} Mbps</strong> of real-world upload
            speed.
          </p>
        </section>

        <SponsoredButton />

        <AdSlot />

        {/* Explanation */}
        <section>
          <h2 className="text-2xl font-bold mb-4">
            Why does a {combo.sizeLabel} upload take {dur} at {combo.speedLabel}?
          </h2>
          <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
            Upload speed is measured in <strong>megabits per second (Mbps)</strong>, while
            file size is measured in <strong>megabytes (MB) or gigabytes (GB)</strong>.
            Since 1 byte = 8 bits, you divide your file&apos;s size in megabytes by your
            speed in megabits, then multiply by 8 to get the transfer time in seconds.
          </p>
          <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
            For {combo.sizeLabel} ({combo.sizeMB.toLocaleString()} MB) at {combo.speedLabel}:{" "}
            <code className="text-sm bg-[var(--muted)] px-2 py-0.5 rounded">
              {combo.sizeMB.toLocaleString()} MB × 8 ÷ {combo.speedMbps} Mbps = {Math.round(secs).toLocaleString()} seconds ≈ {dur}
            </code>
          </p>
          <p className="text-[var(--muted-foreground)] leading-relaxed">
            In practice, network overhead, protocol headers, and ISP throttling reduce
            effective throughput to about <strong>80%</strong> of your advertised speed —
            making the realistic upload time closer to <strong>{realDur}</strong>. If you&apos;re
            on Wi-Fi instead of Ethernet, expect even longer due to signal interference.
          </p>
        </section>

        {/* Speed comparison table */}
        <section>
          <h2 className="text-2xl font-bold mb-4">
            {combo.sizeLabel} upload time at different speeds
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className="pb-3 pr-4 font-semibold">Upload speed</th>
                  <th className="pb-3 pr-4 font-semibold">Theoretical</th>
                  <th className="pb-3 font-semibold">Realistic (~80%)</th>
                </tr>
              </thead>
              <tbody className="[&_tr]:border-b [&_tr]:border-[var(--border)] [&_tr:last-child]:border-0">
                {speedComparison.map((r) => (
                  <tr
                    key={r.slug}
                    className={r.isCurrent ? "font-semibold bg-[var(--accent)]" : ""}
                  >
                    <td className="py-3 pr-4">
                      {r.isCurrent ? (
                        <span>{r.speed} <span className="text-xs text-[var(--primary)]">(this page)</span></span>
                      ) : (
                        <Link
                          href={`/upload/${r.slug}/`}
                          className="text-[var(--primary)] hover:underline"
                        >
                          {r.speed}
                        </Link>
                      )}
                    </td>
                    <td className="py-3 pr-4 tabular-nums">{r.theoretical}</td>
                    <td className="py-3 tabular-nums">{r.realistic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* File size comparison table */}
        <section>
          <h2 className="text-2xl font-bold mb-4">
            Different file sizes at {combo.speedLabel}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className="pb-3 pr-4 font-semibold">File size</th>
                  <th className="pb-3 pr-4 font-semibold">Theoretical</th>
                  <th className="pb-3 font-semibold">Realistic (~80%)</th>
                </tr>
              </thead>
              <tbody className="[&_tr]:border-b [&_tr]:border-[var(--border)] [&_tr:last-child]:border-0">
                {sizeComparison.map((r) => (
                  <tr
                    key={r.slug}
                    className={r.isCurrent ? "font-semibold bg-[var(--accent)]" : ""}
                  >
                    <td className="py-3 pr-4">
                      {r.isCurrent ? (
                        <span>{r.size} <span className="text-xs text-[var(--primary)]">(this page)</span></span>
                      ) : (
                        <Link
                          href={`/upload/${r.slug}/`}
                          className="text-[var(--primary)] hover:underline"
                        >
                          {r.size}
                        </Link>
                      )}
                    </td>
                    <td className="py-3 pr-4 tabular-nums">{r.theoretical}</td>
                    <td className="py-3 tabular-nums">{r.realistic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Internal links */}
        {sameSizeCombos.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4">Upload {combo.sizeLabel} at other speeds</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {sameSizeCombos.map((c) => (
                <Link
                  key={c.slug}
                  href={`/upload/${c.slug}/`}
                  className="rounded-lg border border-[var(--border)] px-4 py-3 text-sm font-medium hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors text-center"
                >
                  {c.speedLabel}
                </Link>
              ))}
            </div>
          </section>
        )}

        {sameSpeedCombos.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4">Other file sizes at {combo.speedLabel}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {sameSpeedCombos.map((c) => (
                <Link
                  key={c.slug}
                  href={`/upload/${c.slug}/`}
                  className="rounded-lg border border-[var(--border)] px-4 py-3 text-sm font-medium hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors text-center"
                >
                  {c.sizeLabel}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="rounded-xl border-2 border-[var(--primary-20)] bg-[var(--accent)] p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Need custom calculations?</h2>
          <p className="text-[var(--muted-foreground)] mb-4 text-sm">
            Use our interactive Upload Time Calculator for any file size, speed, and efficiency rate.
          </p>
          <Link
            href="/tools/upload-time-calculator/"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Open Upload Time Calculator →
          </Link>
        </section>
      </div>
    </>
  );
}
