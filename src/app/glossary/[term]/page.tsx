import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGlossaryTerm, getAllGlossarySlugs, GLOSSARY_TERMS } from "@/data/glossary-terms";

export function generateStaticParams() {
  return getAllGlossarySlugs().map((term) => ({ term }));
}

export async function generateMetadata({ params }: { params: Promise<{ term: string }> }): Promise<Metadata> {
  const { term } = await params;
  const t = getGlossaryTerm(term);
  if (!t) return { title: "Not Found" };
  return {
    title: `What Is ${t.term}? — Streaming Glossary`,
    description: t.shortDef,
    alternates: { canonical: `/glossary/${t.slug}/` },
    openGraph: { title: `What Is ${t.term}?`, description: t.shortDef, type: "article" },
  };
}

export default async function GlossaryTermPage({ params }: { params: Promise<{ term: string }> }) {
  const { term } = await params;
  const t = getGlossaryTerm(term);
  if (!t) notFound();

  const related = t.relatedTerms
    .map((slug) => GLOSSARY_TERMS.find((g) => g.slug === slug))
    .filter(Boolean);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DefinedTerm",
            name: t.term,
            description: t.shortDef,
            inDefinedTermSet: { "@type": "DefinedTermSet", name: "Streaming Glossary", url: "https://streamersize.com/glossary/" },
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
              { "@type": "ListItem", position: 2, name: "Glossary", item: "https://streamersize.com/glossary/" },
              { "@type": "ListItem", position: 3, name: t.term, item: `https://streamersize.com/glossary/${t.slug}/` },
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
            mainEntity: [{
              "@type": "Question",
              name: `What is ${t.term}?`,
              acceptedAnswer: { "@type": "Answer", text: t.shortDef },
            }],
          }),
        }}
      />

      <div className="flex flex-col gap-10 max-w-3xl">
        <section>
          <nav aria-label="Breadcrumb" className="text-sm text-[var(--muted-foreground)] mb-4">
            <ol className="flex items-center gap-1.5">
              <li><Link href="/" className="hover:text-[var(--primary)] transition-colors">Home</Link></li>
              <li>/</li>
              <li><Link href="/glossary/" className="hover:text-[var(--primary)] transition-colors">Glossary</Link></li>
              <li>/</li>
              <li className="text-[var(--foreground)] font-medium">{t.term}</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            What Is {t.term}?
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] font-medium border-l-4 border-[var(--primary)] pl-4">
            {t.shortDef}
          </p>
        </section>

        <section className="prose-like">
          <p className="text-[var(--muted-foreground)] leading-relaxed text-base">
            {t.description}
          </p>
        </section>

        {/* Related tools CTA */}
        {t.relatedTools.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-3">Try It Yourself</h2>
            <div className="flex flex-wrap gap-3">
              {t.relatedTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="px-4 py-2 rounded-lg border border-[var(--primary)] text-[var(--primary)] font-medium text-sm hover:bg-[var(--primary)] hover:text-white transition-colors"
                >
                  {tool.label} →
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related terms */}
        {related.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-3">Related Terms</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {related.map((r) => r && (
                <Link
                  key={r.slug}
                  href={`/glossary/${r.slug}/`}
                  className="rounded-lg border border-[var(--border)] p-3 hover:border-[var(--primary)] transition-colors"
                >
                  <div className="font-semibold text-sm">{r.term}</div>
                  <div className="text-xs text-[var(--muted-foreground)] line-clamp-1">{r.shortDef}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back to glossary */}
        <Link href="/glossary/" className="text-sm text-[var(--primary)] hover:underline">
          ← Back to Glossary
        </Link>
      </div>
    </>
  );
}
