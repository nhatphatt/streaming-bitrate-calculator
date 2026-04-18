/**
 * Pre-build script: generates public/sitemap.xml
 * Run: npx tsx scripts/generate-sitemap.ts
 */

import { getAllSlugs } from "../src/lib/seo-matrix";
import { getAllBlogSlugs } from "../src/lib/blog-content";
import { PRIORITY_SIZE_SLUGS, SIZE_HUBS } from "../src/lib/strategic-pages";
import { getAllPlatformSlugs } from "../src/lib/platform-content";
import { getAllGlossarySlugs } from "../src/data/glossary-terms";
import { writeFileSync } from "fs";
import { resolve } from "path";

const SITE_URL = "https://streamersize.com";
const today = new Date().toISOString().split("T")[0];

const staticUrls = [
  { loc: "/", priority: "1.0" },
  { loc: "/size/", priority: "0.9" },
  { loc: "/compare/", priority: "0.9" },
  { loc: "/tools/bandwidth-calculator/", priority: "0.9" },
  { loc: "/tools/upload-time-calculator/", priority: "0.9" },
  { loc: "/tools/recording-time-calculator/", priority: "0.9" },
  { loc: "/tools/aspect-ratio-calculator/", priority: "0.9" },
  { loc: "/tools/compression-calculator/", priority: "0.9" },
  { loc: "/tools/fps-calculator/", priority: "0.9" },
  { loc: "/tools/disk-space-planner/", priority: "0.9" },
  { loc: "/platforms/", priority: "0.9" },
  { loc: "/glossary/", priority: "0.8" },
  { loc: "/setup-wizard/", priority: "0.9" },
  { loc: "/blog/", priority: "0.8" },
  { loc: "/tools/", priority: "0.9" },
  { loc: "/about/", priority: "0.5" },
  { loc: "/privacy-policy/", priority: "0.3" },
];

const prioritySizeUrls = [...PRIORITY_SIZE_SLUGS, ...Object.keys(SIZE_HUBS)].map((slug) => ({
  loc: `/size/${slug}/`,
  priority: "0.8",
}));

const blogUrls = getAllBlogSlugs().map((slug) => ({
  loc: `/blog/${slug}/`,
  priority: "0.7",
}));

const platformUrls = getAllPlatformSlugs().map((slug) => ({
  loc: `/platforms/${slug}/`,
  priority: "0.8",
}));

const glossaryUrls = getAllGlossarySlugs().map((slug) => ({
  loc: `/glossary/${slug}/`,
  priority: "0.6",
}));

const allUrls = [...staticUrls, ...platformUrls, ...glossaryUrls, ...prioritySizeUrls, ...blogUrls];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <lastmod>${today}</lastmod>
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
