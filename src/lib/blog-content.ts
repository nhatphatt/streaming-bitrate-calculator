/**
 * Blog content reader for MDX files.
 *
 * Reads MDX files from src/content/blog/ at build time (Node.js only).
 * Used in generateStaticParams and page rendering for static export.
 *
 * IMPORTANT: This file uses Node.js APIs (fs, path) — it MUST only be
 * imported from Server Components or scripts, never from Client Components.
 */

import fs from "fs";
import path from "path";

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  readTime: string;
}

export interface BlogPostFull extends BlogPostMeta {
  /** Raw MDX content (without frontmatter) */
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "blog");

/**
 * Parse YAML-style frontmatter from an MDX string.
 * Supports string values (quoted or unquoted).
 */
function parseFrontmatter(raw: string): {
  meta: Record<string, string>;
  content: string;
} {
  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!fmMatch) {
    return { meta: {}, content: raw };
  }

  const fmBlock = fmMatch[1];
  const content = fmMatch[2];

  const meta: Record<string, string> = {};
  for (const line of fmBlock.split(/\r?\n/)) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line
      .slice(colonIdx + 1)
      .trim()
      .replace(/^["']|["']$/g, ""); // strip surrounding quotes
    meta[key] = value;
  }

  return { meta, content };
}

/**
 * Read all blog post files from content/blog/ directory.
 */
export function getAllBlogPosts(): BlogPostFull[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
      const { meta, content } = parseFrontmatter(raw);
      const slug = meta.slug || file.replace(/\.(mdx|md)$/, "");

      return {
        slug,
        title: meta.title ?? slug,
        description: meta.description ?? "",
        publishedAt: meta.publishedAt ?? "",
        updatedAt: meta.updatedAt ?? "",
        readTime: meta.readTime ?? "",
        content,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

/**
 * Read a single blog post by slug.
 */
export function getBlogPostBySlug(slug: string): BlogPostFull | null {
  const all = getAllBlogPosts();
  return all.find((p) => p.slug === slug) ?? null;
}

/**
 * Get all blog post slugs (for generateStaticParams).
 */
export function getAllBlogSlugs(): string[] {
  return getAllBlogPosts().map((p) => p.slug);
}
