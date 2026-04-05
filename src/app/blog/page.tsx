import type { Metadata } from "next";
import Link from "next/link";
import { getAllBlogPosts } from "@/lib/blog-content";

const BLOG_POSTS = getAllBlogPosts();

export const metadata: Metadata = {
  title: "Streaming & Video Production Guides",
  description:
    "Expert guides on streaming bitrate settings, video codecs, storage planning, and bandwidth requirements for content creators.",
  alternates: { canonical: "/blog/" },
  openGraph: {
    title: "Streaming & Video Production Guides",
    description:
      "Expert guides on streaming bitrate settings, video codecs, storage planning, and bandwidth requirements.",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "StreamerSize Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Streaming & Video Production Guides",
    description:
      "Expert guides on streaming bitrate, codecs, and storage for creators.",
    images: ["/og-image.png"],
  },
};

export default function BlogIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Streaming & Video Production Guides",
            description:
              "Expert guides on streaming bitrate settings, video codecs, storage planning, and bandwidth requirements.",
            url: "https://streamersize.com/blog/",
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
            ],
          }),
        }}
      />

      <div className="flex flex-col gap-12">
        {/* Breadcrumb UI */}
        <nav aria-label="Breadcrumb" className="text-sm text-[var(--muted-foreground)]">
          <ol className="flex items-center gap-1.5">
            <li><Link href="/" className="hover:text-[var(--primary)] transition-colors">Home</Link></li>
            <li>/</li>
            <li className="text-[var(--foreground)] font-medium">Blog</li>
          </ol>
        </nav>

        <section>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
          Streaming &amp; Video Production Guides
        </h1>
        <p className="text-[var(--muted-foreground)] text-lg max-w-2xl">
          In-depth guides on bitrate settings, video codecs, storage planning,
          and bandwidth requirements for streamers and content creators.
        </p>
      </section>

      <section>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-8">
          {[
            ["/blog/youtube-streaming-bitrate-guide/", "YouTube streaming bitrate"],
            ["/blog/twitch-streaming-bitrate-guide/", "Twitch streaming bitrate"],
            ["/blog/obs-bitrate-for-1080p-60fps/", "OBS bitrate for 1080p 60fps"],
            ["/blog/upload-speed-for-streaming-guide/", "Upload speed for streaming"],
          ].map(([href, label]) => (
            <Link key={href} href={href} className="rounded-xl border border-[var(--border)] p-4 font-semibold hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors">
              {label}
            </Link>
          ))}
        </div>
        <div className="grid gap-6">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}/`}
              className="block rounded-xl border border-[var(--border)] p-6 hover:border-[var(--primary)] hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)] mb-2">
                <time dateTime={post.publishedAt}>{post.publishedAt}</time>
                <span>&middot;</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="text-xl font-bold mb-2 group-hover:text-[var(--primary)]">
                {post.title}
              </h2>
              <p className="text-[var(--muted-foreground)] leading-relaxed">
                {post.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
      </div>
    </>
  );
}
