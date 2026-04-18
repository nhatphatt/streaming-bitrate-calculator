import type { Metadata } from "next";
import Link from "next/link";
import { GLOSSARY_TERMS } from "@/data/glossary-terms";

export const metadata: Metadata = {
  title: "Streaming & Video Glossary — Key Terms Explained",
  description:
    "Learn the meaning of bitrate, codec, FPS, CBR, VBR, keyframe, and 20+ other streaming and video terms. Simple definitions for beginners.",
  alternates: { canonical: "/glossary/" },
  openGraph: {
    title: "Streaming & Video Glossary",
    description: "Simple definitions for bitrate, codec, FPS, and 20+ streaming terms.",
    type: "website",
  },
};

export default function GlossaryIndexPage() {
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
              { "@type": "ListItem", position: 2, name: "Glossary", item: "https://streamersize.com/glossary/" },
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
              <li className="text-[var(--foreground)] font-medium">Glossary</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Streaming &amp; Video Glossary
          </h1>
          <p className="text-[var(--muted-foreground)] text-lg max-w-2xl">
            Simple, clear definitions for every streaming and video term you need to know. Click any term to learn more.
          </p>
        </section>

        <section className="grid gap-3 md:grid-cols-2">
          {GLOSSARY_TERMS.map((t) => (
            <Link
              key={t.slug}
              href={`/glossary/${t.slug}/`}
              className="group rounded-xl border border-[var(--border)] p-4 hover:border-[var(--primary)] hover:shadow-sm transition-all"
            >
              <h2 className="font-bold mb-1 group-hover:text-[var(--primary)] transition-colors">
                {t.term}
              </h2>
              <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">
                {t.shortDef}
              </p>
            </Link>
          ))}
        </section>
      </div>
    </>
  );
}
