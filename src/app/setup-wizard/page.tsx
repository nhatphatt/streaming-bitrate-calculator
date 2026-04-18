import type { Metadata } from "next";
import SetupWizard from "@/components/SetupWizard";
import RelatedTools from "@/components/RelatedTools";

export const metadata: Metadata = {
  title: "Stream Setup Wizard — Find Your Perfect Streaming Settings",
  description:
    "Answer 4 quick questions to get personalized streaming settings for OBS. Recommended bitrate, resolution, encoder, and more based on your setup.",
  alternates: { canonical: "/setup-wizard/" },
  openGraph: {
    title: "Stream Setup Wizard — Personalized OBS Settings",
    description: "Get personalized streaming settings in 30 seconds.",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function SetupWizardPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://streamersize.com/" },
              { "@type": "ListItem", position: 2, name: "Setup Wizard", item: "https://streamersize.com/setup-wizard/" },
            ],
          }),
        }}
      />

      <div className="flex flex-col gap-12">
        <section className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Stream Setup Wizard
          </h1>
          <p className="text-[var(--muted-foreground)] text-lg max-w-xl mx-auto">
            Answer 4 quick questions and get personalized OBS streaming settings for your platform, internet speed, and content type.
          </p>
        </section>

        <section>
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-sm">
            <SetupWizard />
          </div>
        </section>

        <RelatedTools current="/setup-wizard/" />
      </div>
    </>
  );
}
