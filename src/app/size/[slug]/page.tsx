import type { Metadata } from "next";
import Link from "next/link";
import { RESOLUTIONS, FPS_OPTIONS } from "@/data/presets";
import CalculatorForm from "@/components/CalculatorForm";

import { breadcrumbSchema, faqPageSchema } from "@/lib/seo";
import {
  getAllSlugs,
  parseMatrixSlug,
  CODEC_TO_PRESET,
  CODEC_LABELS,
  type Codec,
} from "@/lib/seo-matrix";
import { generateContent } from "@/lib/content-generator";
import { generateFaqForCombo } from "@/lib/seo";
import { SIZE_HUBS, isSizeHubSlug, getSizeHubMetadata, isPrioritySizeSlug } from "@/lib/strategic-pages";

// --------------- SSG ---------------
export function generateStaticParams() {
  return [...getAllSlugs(), ...Object.keys(SIZE_HUBS)].map((slug) => ({ slug }));
}

// --------------- Helpers ---------------
function resolveSlug(slug: string) {
  // Try 3-part first: "4k-60fps-hevc"
  const matrix = parseMatrixSlug(slug);
  if (!matrix) return null;

  const res = RESOLUTIONS.find((r) => r.slug === matrix.resolution);
  const fps = FPS_OPTIONS.find(
    (f) => f.value === matrix.fps
  );
  if (!res || !fps) return null;

  return {
    res,
    fps,
    codec: matrix.codec, // null for legacy 2-part slugs
    isMatrixPage: matrix.codec !== null,
  };
}

// --------------- Metadata ---------------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (isSizeHubSlug(slug)) {
    return getSizeHubMetadata(slug);
  }
  const parsed = resolveSlug(slug);
  if (!parsed) return { title: "Not Found" };

  const { res, fps, codec } = parsed;
  const codecLabel = codec ? CODEC_LABELS[codec] : null;
  const shouldIndex = !codec && isPrioritySizeSlug(slug);

  const title = codec
    ? `${res.label} ${fps.label} ${codecLabel} — Bitrate & File Size Calculator`
    : `${res.label} at ${fps.label} — Bitrate & File Size Calculator`;

  const description = codec
    ? `Calculate file size, bitrate, and storage for ${res.label} video at ${fps.label} using ${codecLabel}. Free online tool with real-time results.`
    : `Calculate exact file size, bitrate, and storage for ${res.label} video at ${fps.label}. Supports H.264, HEVC, VP9, AV1, and ProRes codecs.`;

  return {
    title,
    description,
    alternates: { canonical: `/size/${slug}/` },
    robots: {
      index: shouldIndex,
      follow: true,
    },
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

// --------------- Page ---------------
export default async function SizePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (isSizeHubSlug(slug)) {
    const hub = SIZE_HUBS[slug];
    return (
      <div className="flex flex-col gap-10">
        <nav aria-label="Breadcrumb" className="text-sm text-[var(--muted-foreground)]">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li><Link href="/" className="hover:text-[var(--primary)] transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/size/" className="hover:text-[var(--primary)] transition-colors">File Size Calculator</Link></li>
            <li>/</li>
            <li className="text-[var(--foreground)] font-medium">{hub.h1}</li>
          </ol>
        </nav>

        <section>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">{hub.h1}</h1>
          <p className="text-[var(--muted-foreground)] text-lg max-w-3xl">{hub.intro}</p>
        </section>

        <section className="rounded-xl border border-[var(--border)] p-6">
          <h2 className="text-2xl font-bold mb-4">Recommended bitrate by platform</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className="pb-3 pr-4 font-semibold">Platform</th>
                  <th className="pb-3 pr-4 font-semibold">FPS</th>
                  <th className="pb-3 pr-4 font-semibold">Bitrate</th>
                  <th className="pb-3 font-semibold">Upload speed</th>
                </tr>
              </thead>
              <tbody>
                {hub.rows.map(([platform, fps, bitrate, upload]) => (
                  <tr key={`${platform}-${fps}`} className="border-b border-[var(--border)] last:border-0">
                    <td className="py-3 pr-4 font-medium">{platform}</td>
                    <td className="py-3 pr-4">{fps}</td>
                    <td className="py-3 pr-4">{bitrate}</td>
                    <td className="py-3">{upload}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-[var(--border)] p-6">
            <h2 className="text-xl font-bold mb-3">How to choose the right bitrate</h2>
            <p className="text-[var(--muted-foreground)] leading-relaxed mb-3">
              Start with your platform&apos;s practical range, then adjust for frame rate, game motion, and encoder quality. If your stream drops frames, lower bitrate before changing everything else.
            </p>
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              As a rule of thumb, keep your stream bitrate below about 75% of your real upload speed so you still have headroom for audio, overlays, and network spikes.
            </p>
          </div>
          <div className="rounded-xl border border-[var(--border)] p-6">
            <h2 className="text-xl font-bold mb-3">Related calculators and guides</h2>
            <div className="grid gap-3">
              {hub.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg border border-[var(--border)] px-4 py-3 text-sm font-medium hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }
  const parsed = resolveSlug(slug);

  if (!parsed) {
    return <p>Invalid resolution/fps combination.</p>;
  }

  const { res, fps, codec, isMatrixPage } = parsed;
  const codecLabel = codec ? CODEC_LABELS[codec] : null;
  const presetCodecId = codec ? CODEC_TO_PRESET[codec] : undefined;

  // --- Content generation ---
  // For 3-part pages: use content-generator (unique spintax content)
  // For 2-part pages: use legacy seo.ts FAQ generator
  const generated = isMatrixPage && codec
    ? generateContent(res.slug as Parameters<typeof generateContent>[0], fps.value as Parameters<typeof generateContent>[1], codec)
    : null;

  const legacyFaqs = !isMatrixPage
    ? generateFaqForCombo(res.slug, res.label, res.width, res.height, fps.value, fps.label)
    : null;

  const faqs = generated?.faqs ?? legacyFaqs ?? [];

  // --- Internal links ---
  // Related: same res+fps, different codecs (matrix pages)
  const codecLinks = isMatrixPage
    ? (["h264", "hevc", "av1", "prores"] as Codec[])
        .filter((c) => c !== codec)
        .map((c) => ({
          slug: `${res.slug}-${fps.value}fps-${c}`,
          label: `${res.label} ${fps.label} ${CODEC_LABELS[c]}`,
        }))
    : [];

  // Related: same resolution, different fps
  const fpsLinks = FPS_OPTIONS.filter((f) => f.value !== fps.value).map((f) => ({
    slug: isMatrixPage && codec
      ? `${res.slug}-${f.value}fps-${codec}`
      : `${res.slug}-${f.slug}`,
    label: `${res.label} at ${f.label}${codecLabel ? ` ${codecLabel}` : ""}`,
  }));

  // Cross-resolution links
  const resLinks = RESOLUTIONS.filter((r) => r.slug !== res.slug).map((r) => ({
    slug: isMatrixPage && codec
      ? `${r.slug}-${fps.value}fps-${codec}`
      : `${r.slug}-${fps.slug}`,
    label: `${r.label} at ${fps.label}`,
  }));

  const pageTitle = codec
    ? `${res.label} at ${fps.label} with ${codecLabel}`
    : `${res.label} at ${fps.label}`;

  const breadcrumbName = codec
    ? `${res.label} ${fps.label} ${codecLabel}`
    : `${res.label} ${fps.label}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: `${pageTitle} Bitrate Calculator`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description: `Calculate file size, bitrate, and storage for ${pageTitle}.`,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema(breadcrumbName, "", slug)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPageSchema(faqs)),
        }}
      />

      <div className="flex flex-col gap-12">
      {/* Breadcrumb UI */}
      <nav aria-label="Breadcrumb" className="text-sm text-[var(--muted-foreground)]">
        <ol className="flex items-center gap-1.5 flex-wrap">
          <li>
            <Link href="/" className="hover:text-[var(--primary)] transition-colors">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/size/" className="hover:text-[var(--primary)] transition-colors">File Size Calculator</Link>
          </li>
          <li>/</li>
          <li className="text-[var(--foreground)] font-medium">{breadcrumbName}</li>
        </ol>
      </nav>

      <section>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
          {pageTitle} — Bitrate &amp; Storage Calculator
        </h1>
        <p className="text-[var(--muted-foreground)] text-lg max-w-2xl">
          Instantly calculate the file size and bandwidth needed for{" "}
          <strong>{res.label}</strong> ({res.width}&times;{res.height}) video at{" "}
          <strong>{fps.label}</strong>
          {codecLabel && (
            <>
              {" "}using <strong>{codecLabel}</strong>
            </>
          )}
          . Adjust settings below.
        </p>
      </section>

      {/* === CALCULATOR === */}
      <section>
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-sm">
          <CalculatorForm
            defaultResolution={res.slug}
            defaultFps={fps.value}
          />
        </div>
      </section>


      {/* === UNIQUE ARTICLE CONTENT === */}
      {generated ? (
        <article className="max-w-none">
          <h2 className="text-2xl font-bold mb-4">
            {res.label} at {fps.label} with {codecLabel}: What You Need to Know
          </h2>
          <div
            className="text-[var(--muted-foreground)] leading-relaxed space-y-4 [&_strong]:text-[var(--foreground)]"
            dangerouslySetInnerHTML={{ __html: generated.articleHtml }}
          />
        </article>
      ) : (
        <section className="max-w-none">
          <h2 className="text-2xl font-bold mb-4">
            How Much Storage Does {res.label} at {fps.label} Need?
          </h2>
          <p className="text-[var(--muted-foreground)] mb-4 leading-relaxed">
            Recording or streaming at {res.label} ({res.width}&times;{res.height})
            and {fps.label} produces high-quality video, but file sizes can be
            substantial. The exact storage depends on the codec you choose — H.264
            produces larger files, while HEVC and AV1 offer significantly better
            compression at comparable quality.
          </p>
          <p className="text-[var(--muted-foreground)] mb-4 leading-relaxed">
            For example, a 10-minute {res.label} clip at {fps.label} with H.264
            can easily exceed several gigabytes. Professional workflows using
            ProRes will require even more space — making external SSDs and NAS
            systems essential for serious content creators.
          </p>
          <p className="text-[var(--muted-foreground)] leading-relaxed">
            Use the calculator above to get exact estimates for your specific
            settings, including audio quality and recording duration.
          </p>
        </section>
      )}

      {/* FAQ Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map(({ q, a }) => (
            <details key={q} className="group border border-[var(--border)] rounded-lg">
              <summary className="cursor-pointer px-4 py-3 font-medium">{q}</summary>
              <p className="px-4 pb-3 text-[var(--muted-foreground)] leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>


      {/* === INTERNAL LINKS === */}
      {codecLinks.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">
            Other Codecs for {res.label} {fps.label}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {codecLinks.map((page) => (
              <Link
                key={page.slug}
                href={`/size/${page.slug}/`}
                className="block rounded-lg border border-[var(--border)] px-4 py-3 text-sm font-medium hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
              >
                {page.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold mb-4">
          Other Frame Rates for {res.label}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {fpsLinks.map((page) => (
            <Link
              key={page.slug}
              href={`/size/${page.slug}/`}
              className="block rounded-lg border border-[var(--border)] px-4 py-3 text-sm font-medium hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
            >
              {page.label}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">
          {fps.label} at Other Resolutions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {resLinks.map((page) => (
            <Link
              key={page.slug}
              href={`/size/${page.slug}/`}
              className="block rounded-lg border border-[var(--border)] px-4 py-3 text-sm font-medium hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
            >
              {page.label}
            </Link>
          ))}
        </div>
      </section>

      </div>
    </>
  );
}
