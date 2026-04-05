import type { Metadata } from "next";
import Link from "next/link";
import UploadTimeCalculator from "@/components/UploadTimeCalculator";

export const metadata: Metadata = {
  title: "Upload Time Calculator — How Long to Upload Your Video?",
  description:
    "Calculate how long it takes to upload a video file based on your file size and internet upload speed. Supports MB, GB, and TB.",
  alternates: { canonical: "/tools/upload-time-calculator/" },
  openGraph: {
    title: "Upload Time Calculator — How Long to Upload Your Video?",
    description: "Calculate video upload time based on file size and upload speed.",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Upload Time Calculator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Upload Time Calculator",
    description: "Calculate video upload time based on file size and upload speed.",
    images: ["/og-image.png"],
  },
};

export default function UploadTimePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Upload Time Calculator",
            applicationCategory: "UtilityApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
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
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How long does it take to upload a 10GB video?",
                acceptedAnswer: { "@type": "Answer", text: "At 20 Mbps upload speed, a 10GB video takes approximately 1 hour 8 minutes. At 100 Mbps, it takes about 13 minutes." },
              },
              {
                "@type": "Question",
                name: "Why is my upload slower than expected?",
                acceptedAnswer: { "@type": "Answer", text: "Real-world upload speeds are typically 70-80% of your advertised speed due to network overhead, other devices sharing bandwidth, and ISP throttling. Our calculator includes a realistic estimate at 80% efficiency." },
              },
              {
                "@type": "Question",
                name: "Does upload speed affect video quality?",
                acceptedAnswer: { "@type": "Answer", text: "Upload speed does not affect the quality of a pre-recorded video file. However, for live streaming, your upload speed determines the maximum bitrate (and thus quality) you can stream at." },
              },
            ],
          }),
        }}
      />

      <div className="flex flex-col gap-12">
        <section>
          <nav aria-label="Breadcrumb" className="text-sm text-[var(--muted-foreground)] mb-4">
            <ol className="flex items-center gap-1.5">
              <li><Link href="/" className="hover:text-[var(--primary)] transition-colors">Home</Link></li>
              <li>/</li>
              <li className="text-[var(--foreground)] font-medium">Upload Time Calculator</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Upload Time Calculator
          </h1>
          <p className="text-[var(--muted-foreground)] text-lg max-w-2xl">
            How long will it take to upload your video? Enter your file size and
            upload speed to find out instantly.
          </p>
        </section>

        <section>
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-sm">
            <UploadTimeCalculator />
          </div>
        </section>

        <div className="flex flex-col gap-10">
          <section>
            <h2 className="text-2xl font-bold mb-4">
              How Upload Time Is Calculated
            </h2>
            <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
              Upload time depends on two factors: your <strong>file size</strong> and
              your <strong>upload speed</strong>. The formula is straightforward:
              divide the total file size (in bits) by your upload speed (in bits
              per second).
            </p>
            <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
              Keep in mind that internet speeds are advertised in <strong>megabits</strong> per
              second (Mbps), while file sizes are measured in <strong>megabytes</strong> (MB).
              Since 1 byte = 8 bits, a 100 Mbps connection transfers only 12.5 MB
              per second — not 100 MB.
            </p>
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              Our calculator also provides a <strong>realistic estimate at 80%
              efficiency</strong>, accounting for TCP overhead, network congestion,
              and other real-world factors. For exact file sizes based on your
              recording settings, use our{" "}
              <Link href="/" className="text-[var(--primary)] underline underline-offset-2">
                Bitrate &amp; Storage Calculator
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {[
                {
                  q: "How long does it take to upload a 10GB video?",
                  a: "At 20 Mbps upload speed, a 10GB video takes approximately 1 hour 8 minutes. At 100 Mbps, it takes about 13 minutes. Use the calculator above for your exact speed.",
                },
                {
                  q: "Why is my upload slower than expected?",
                  a: "Real-world upload speeds are typically 70–80% of your advertised speed due to network overhead, other devices sharing bandwidth, and ISP throttling. Our calculator includes a realistic estimate at 80% efficiency.",
                },
                {
                  q: "Does upload speed affect video quality?",
                  a: "Upload speed does not affect the quality of a pre-recorded video file. However, for live streaming, your upload speed determines the maximum bitrate (and thus quality) you can stream at.",
                },
                {
                  q: "How can I speed up my uploads?",
                  a: "Use a wired Ethernet connection instead of WiFi, close other bandwidth-heavy apps, upload during off-peak hours, or upgrade to a faster internet plan with higher upload speeds (fiber is best).",
                },
              ].map(({ q, a }) => (
                <details key={q} className="border border-[var(--border)] rounded-lg">
                  <summary className="cursor-pointer px-4 py-3 font-medium">{q}</summary>
                  <p className="px-4 pb-3 text-[var(--muted-foreground)]">{a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
