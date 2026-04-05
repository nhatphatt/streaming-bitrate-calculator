import type { Metadata } from "next";
import Link from "next/link";
import { getAllBlogPosts, getBlogPostBySlug, getAllBlogSlugs } from "@/lib/blog-content";

const BLOG_CLUSTERS: Record<string, string[]> = {
  youtube: [
    "youtube-streaming-bitrate-guide",
    "best-video-format-for-youtube",
    "how-much-storage-for-youtube-channel",
    "twitch-vs-youtube-bitrate-comparison",
  ],
  twitch: [
    "twitch-streaming-bitrate-guide",
    "best-obs-bitrate-settings",
    "streaming-bandwidth-requirements",
    "twitch-vs-youtube-bitrate-comparison",
  ],
  obs: [
    "best-obs-bitrate-settings",
    "obs-bitrate-for-1080p-60fps",
    "obs-recording-settings-guide",
    "cbr-vs-vbr-for-streaming",
  ],
  bitrate: [
    "best-streaming-bitrate-by-resolution",
    "youtube-streaming-bitrate-guide",
    "twitch-streaming-bitrate-guide",
    "upload-speed-for-streaming-guide",
  ],
  codec: [
    "h264-vs-h265-vs-av1",
    "best-codec-for-live-streaming",
    "cbr-vs-vbr-for-streaming",
    "mp4-vs-mkv-vs-mov",
  ],
};

function getClusterRelatedPosts(currentSlug: string, allPosts: ReturnType<typeof getAllBlogPosts>) {
  const matchingCluster = Object.values(BLOG_CLUSTERS).find((slugs) => slugs.includes(currentSlug));
  if (matchingCluster) {
    const related = matchingCluster
      .filter((slug) => slug !== currentSlug)
      .map((slug) => allPosts.find((post) => post.slug === slug))
      .filter((post): post is ReturnType<typeof getAllBlogPosts>[number] => Boolean(post));

    if (related.length >= 3) return related.slice(0, 3);

    const fallback = allPosts.filter((post) => post.slug !== currentSlug && !matchingCluster.includes(post.slug));
    return [...related, ...fallback].slice(0, 3);
  }

  return allPosts.filter((p) => p.slug !== currentSlug).slice(0, 3);
}

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Not Found" };

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}/` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: ["/og-image.png"],
    },
  };
}

/**
 * Convert basic Markdown to HTML for rendering blog content.
 * Handles: headings, bold, links, lists, tables, paragraphs.
 * This avoids needing a heavy MDX runtime while keeping content in .mdx files.
 */
function markdownToHtml(md: string): string {
  // First, convert table rows to <tr> tags
  let html = md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^!\[([^\]]*)\]\(([^)]+)\)/gm, '<figure class="my-8"><img src="$2" alt="$1" loading="lazy" class="w-full rounded-xl border border-[var(--border)]" /><figcaption class="text-center text-sm text-[var(--muted-foreground)] mt-2">$1</figcaption></figure>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]*?<\/li>)(\n<li>)/g, "$1$2")
    .replace(/(<li>[^]*?<\/li>)/g, (match) => `<ul>${match}</ul>`)
    .replace(/^\|(.+)\|$/gm, (row, inner) => {
      const cells = inner.split("|");
      const isSeparator = cells.every((c: string) => /^[-:\s]+$/.test(c));
      if (isSeparator) return "<!--sep-->";
      // We don't know if th or td, so use td for all, styling handles it
      return `<tr>${cells.map((c: string) => `<td>${c.trim()}</td>`).join("")}</tr>`;
    });

  // Group contiguous <tr>s into a responsive table. Use <!--sep--> to apply theader styles via CSS if needed, 
  // but for simplicity we'll just remove the separator.
  html = html.replace(/<!--sep-->\n?/g, "");
  html = html.replace(/(<tr>[\s\S]*?<\/tr>\n*)+/g, (match) => `<div class="overflow-x-auto my-6 border border-[var(--border)] rounded-lg"><table class="w-full text-sm text-left whitespace-nowrap">${match}</table></div>`);

  // Finally, wrap paragraphs
  html = html.replace(/^(?!<[a-z]|##|###|-)(.+)$/gm, "<p>$1</p>");
  html = html.replace(/\n{3,}/g, "\n\n");

  return html;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return <p>Post not found.</p>;
  }

  // Related posts (exclude current)
  const allPosts = getAllBlogPosts();
  const related = getClusterRelatedPosts(slug, allPosts);
  const contentHtml = markdownToHtml(post.content);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            image: "https://streamersize.com/og-image.png",
            author: {
              "@type": "Organization",
              name: "StreamerSize",
              url: "https://streamersize.com",
            },
            publisher: {
              "@type": "Organization",
              name: "StreamerSize",
              url: "https://streamersize.com",
              logo: {
                "@type": "ImageObject",
                url: "https://streamersize.com/favicon.png",
              },
            },
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
              { "@type": "ListItem", position: 2, name: "Blog", item: "https://streamersize.com/blog/" },
              { "@type": "ListItem", position: 3, name: post.title, item: `https://streamersize.com/blog/${slug}/` },
            ],
          }),
        }}
      />

      <div className="flex flex-col gap-12">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="text-sm text-[var(--muted-foreground)]"
        >
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li>
              <Link
                href="/"
                className="hover:text-[var(--primary)] transition-colors"
              >
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href="/blog/"
                className="hover:text-[var(--primary)] transition-colors"
              >
                Blog
              </Link>
            </li>
            <li>/</li>
            <li className="text-[var(--foreground)] font-medium truncate max-w-[300px]">
              {post.title}
            </li>
          </ol>
        </nav>

        {/* Article header */}
        <header>
          <div className="flex items-center gap-3 text-sm text-[var(--muted-foreground)] mb-4">
            <time dateTime={post.publishedAt}>
              Published: {post.publishedAt}
            </time>
            <span>&middot;</span>
            <span>{post.readTime}</span>
            {post.updatedAt !== post.publishedAt && (
              <>
                <span>&middot;</span>
                <time dateTime={post.updatedAt}>
                  Updated: {post.updatedAt}
                </time>
              </>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
            {post.title}
          </h1>
        </header>

        {/* Article content */}
        <article
          className="max-w-3xl [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-[var(--muted-foreground)] [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:text-[var(--muted-foreground)] [&_li]:mb-1.5 [&_a]:text-[var(--primary)] [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80 [&_table]:w-full [&_table]:text-sm [&_table]:mb-4 [&_th]:text-left [&_th]:pb-2 [&_th]:px-4 [&_th]:border-b [&_th]:border-[var(--border)] [&_th]:font-semibold [&_td]:py-3 [&_td]:px-4 [&_td]:border-b [&_td]:border-[var(--border)/50] [&_td]:text-[var(--muted-foreground)] [&_tr:first-child_td]:font-semibold [&_tr:first-child_td]:text-[var(--foreground)] [&_tr:first-child_td]:border-b-2 [&_tr:first-child_td]:border-[var(--border)] [&_strong]:text-[var(--foreground)]"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Related posts */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Related Guides</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}/`}
                className="block rounded-xl border border-[var(--border)] p-5 hover:border-[var(--primary)] transition-colors"
              >
                <div className="text-xs text-[var(--muted-foreground)] mb-2">
                  {r.readTime}
                </div>
                <h3 className="font-semibold text-sm leading-snug">
                  {r.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
