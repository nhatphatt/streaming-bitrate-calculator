/**
 * Pre-build script: generates public/sitemap.xml
 * Run: npx tsx scripts/generate-sitemap.ts
 */

import { getAllSlugs } from "../src/lib/seo-matrix";
import { getAllBlogPosts } from "../src/lib/blog-content";
import { PRIORITY_SIZE_SLUGS, PRIORITY_MATRIX_SLUGS, SIZE_HUBS } from "../src/lib/strategic-pages";
import { getAllPlatformSlugs } from "../src/lib/platform-content";
import { getAllGlossarySlugs } from "../src/data/glossary-terms";
import { getAllUploadSlugs } from "../src/lib/upload-seo";
import { writeFileSync } from "fs";
import { resolve } from "path";

const SITE_URL = "https://streamersize.com";
// Use the build date so the sitemap signals freshness on every deploy,
// instead of a hardcoded date that goes stale.
const DEFAULT_LASTMOD = new Date().toISOString().slice(0, 10);

type SitemapUrl = {
  loc: string;
  priority: string;
  lastmod?: string;
};

const staticUrls: SitemapUrl[] = [
  { loc: "/", priority: "1.0" },
  { loc: "/size/", priority: "0.9" },
  { loc: "/compare/", priority: "0.9" },
  { loc: "/obs/", priority: "0.9" },
  { loc: "/tools/bandwidth-calculator/", priority: "0.9" },
  { loc: "/tools/upload-time-calculator/", priority: "0.9" },
  { loc: "/tools/recording-time-calculator/", priority: "0.9" },
  { loc: "/tools/aspect-ratio-calculator/", priority: "0.9" },
  { loc: "/tools/compression-calculator/", priority: "0.9" },
  { loc: "/tools/fps-calculator/", priority: "0.9" },
  { loc: "/tools/disk-space-planner/", priority: "0.9" },
  { loc: "/tools/youtube-earnings-calculator/", priority: "0.9" },
  { loc: "/tools/twitch-revenue-calculator/", priority: "0.9" },
  { loc: "/platforms/", priority: "0.9" },
  { loc: "/glossary/", priority: "0.8" },
  { loc: "/setup-wizard/", priority: "0.9" },
  { loc: "/blog/", priority: "0.8" },
  { loc: "/tools/", priority: "0.9" },
  { loc: "/about/", priority: "0.5" },
  { loc: "/privacy-policy/", priority: "0.3" },
];

const prioritySizeUrls: SitemapUrl[] = [...PRIORITY_SIZE_SLUGS, ...PRIORITY_MATRIX_SLUGS, ...Object.keys(SIZE_HUBS)].map((slug) => ({
  loc: `/size/${slug}/`,
  priority: "0.8",
}));

const blogUrls: SitemapUrl[] = getAllBlogPosts().map((post) => ({
  loc: `/blog/${post.slug}/`,
  priority: "0.7",
  lastmod: post.updatedAt || post.publishedAt || DEFAULT_LASTMOD,
}));

const platformUrls: SitemapUrl[] = getAllPlatformSlugs().map((slug) => ({
  loc: `/platforms/${slug}/`,
  priority: "0.8",
}));

const glossaryUrls: SitemapUrl[] = getAllGlossarySlugs().map((slug) => ({
  loc: `/glossary/${slug}/`,
  priority: "0.6",
}));

const uploadUrls: SitemapUrl[] = [
  { loc: "/upload/", priority: "0.8" },
  ...getAllUploadSlugs().map((slug) => ({
    loc: `/upload/${slug}/`,
    priority: "0.6",
  })),
];

const allUrls = [...staticUrls, ...platformUrls, ...glossaryUrls, ...prioritySizeUrls, ...uploadUrls, ...blogUrls];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <lastmod>${u.lastmod ?? DEFAULT_LASTMOD}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

const outPath = resolve(__dirname, "../public/sitemap.xml");
writeFileSync(outPath, xml, "utf-8");
console.log(`Sitemap generated: ${allUrls.length} URLs → ${outPath}`);
