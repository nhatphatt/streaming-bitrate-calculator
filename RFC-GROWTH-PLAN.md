# RFC: StreamerSize Growth Plan — Tăng Pageview & US Traffic

**Author:** Kiro AI  
**Date:** 2026-04-18  
**Status:** Draft  
**Project:** streamersize.com  

---

## 1. Tổng quan hiện trạng

### 1.1 Cấu trúc hiện tại
- **Framework:** Next.js 16 + React 19 + Tailwind CSS 4
- **Deploy:** Cloudflare Pages (static export)
- **Tools (5):** Bitrate Calculator, Codec Comparison, Bandwidth Calculator, Upload Time Calculator, Recording Time Calculator
- **Blog:** 18 bài viết (streaming/video niche)
- **Programmatic SEO:** ~100 trang `/size/[resolution]-[fps]-[codec]`
- **Platform data:** Twitch, YouTube, Kick, Facebook, Discord (chỉ dùng trong calculator, chưa có landing page riêng)

### 1.2 Vấn đề
- 99 trang "Discovered – currently not indexed" trên Google Search Console
- Chưa có tools high-volume mà US audience search nhiều (aspect ratio, compression)
- Thiếu content nhắm game-specific keywords (volume rất cao tại US)
- Không có platform-specific landing pages
- Thiếu tính năng interactive để tăng engagement & shareability
- Chưa có glossary/educational pages để bắt long-tail keywords

---

## 2. Mục tiêu

| Metric | Hiện tại | Mục tiêu 3 tháng | Mục tiêu 6 tháng |
|--------|----------|-------------------|-------------------|
| Indexed pages | ~6 | 50+ | 150+ |
| Organic traffic (US) | ~0 | 500/tháng | 3,000/tháng |
| Total pageviews | ~0 | 2,000/tháng | 15,000/tháng |
| Tools | 5 | 9 | 12 |
| Blog posts | 18 | 35 | 55 |

---

## 3. Kế hoạch triển khai

### Phase 1: High-Impact Tools (Tuần 1–2)

#### 3.1.1 Aspect Ratio Calculator
- **Route:** `/tools/aspect-ratio-calculator/`
- **Target keywords:** "aspect ratio calculator" (~50K/tháng US), "16:9 calculator", "aspect ratio converter"
- **Tính năng:**
  - Input width → auto-calculate height (hoặc ngược lại) cho các tỷ lệ phổ biến (16:9, 4:3, 21:9, 1:1, 9:16)
  - Bảng preset: YouTube (16:9), Instagram Reels (9:16), TikTok (9:16), Twitter/X (16:9), Facebook (1:1)
  - Visual preview box thay đổi theo tỷ lệ
  - Crop calculator: input source resolution + target ratio → output crop dimensions
- **Files cần tạo:**
  - `src/app/tools/aspect-ratio-calculator/page.tsx` — SSG page + metadata
  - `src/components/AspectRatioCalculator.tsx` — client component
- **SEO:** FAQ schema, BreadcrumbList schema

#### 3.1.2 Video Compression Calculator
- **Route:** `/tools/compression-calculator/`
- **Target keywords:** "video compression calculator", "how to compress video", "reduce video file size"
- **Tính năng:**
  - Input: source file size + source codec → target codec → estimated output size
  - Bảng so sánh: "If you convert from H.264 to HEVC, you save ~40%"
  - Recommendation engine: suggest best codec based on use case (streaming, archive, upload)
- **Files cần tạo:**
  - `src/app/tools/compression-calculator/page.tsx`
  - `src/components/CompressionCalculator.tsx`
- **Logic:** Tái sử dụng `src/lib/calculate.ts` + codec efficiency factors từ `src/data/presets.ts`

#### 3.1.3 FPS Calculator / Frame Counter
- **Route:** `/tools/fps-calculator/`
- **Target keywords:** "fps calculator", "how many frames in X seconds", "frame rate converter"
- **Tính năng:**
  - Input duration + FPS → total frames
  - Input total frames + FPS → duration
  - Bảng so sánh: 24fps vs 30fps vs 60fps vs 120fps cho cùng duration
  - Slow-motion calculator: "Recording at 120fps, playback at 30fps = 4× slow motion"
- **Files cần tạo:**
  - `src/app/tools/fps-calculator/page.tsx`
  - `src/components/FpsCalculator.tsx`

#### 3.1.4 Disk Space Planner
- **Route:** `/tools/disk-space-planner/`
- **Target keywords:** "how much storage do I need for streaming", "streaming storage calculator"
- **Tính năng:**
  - Input: hours streaming/week, resolution, codec, weeks to keep recordings
  - Output: total storage needed, recommended HDD/SSD size
  - Visual bar chart: storage usage over time
- **Files cần tạo:**
  - `src/app/tools/disk-space-planner/page.tsx`
  - `src/components/DiskSpacePlanner.tsx`
- **Logic:** Tái sử dụng `calculate()` từ `src/lib/calculate.ts`

**Cập nhật files hiện có:**
- `src/app/tools/page.tsx` — thêm 4 tools mới vào grid
- `src/components/ToolsDropdown.tsx` — thêm links
- `src/components/MobileMenu.tsx` — thêm links
- `scripts/generate-sitemap.ts` — thêm URLs mới

---

### Phase 2: Platform Landing Pages (Tuần 3)

#### 3.2.1 Platform Pages
- **Routes:**
  - `/platforms/` — index page
  - `/platforms/twitch/` — Twitch streaming settings
  - `/platforms/youtube/` — YouTube streaming settings
  - `/platforms/kick/` — Kick streaming settings
  - `/platforms/facebook/` — Facebook Gaming settings
  - `/platforms/discord/` — Discord streaming settings
- **Target keywords:** "twitch streaming settings 2026", "best youtube stream settings", "kick streaming bitrate"
- **Tính năng mỗi trang:**
  - Bảng recommended settings (resolution × bitrate) — data từ `src/data/platforms.ts`
  - Calculator pre-configured cho platform đó (reuse `CalculatorForm` với `defaultPlatform` prop)
  - Platform-specific tips & limits
  - Links đến blog posts liên quan
- **Files cần tạo:**
  - `src/app/platforms/page.tsx` — index
  - `src/app/platforms/[platform]/page.tsx` — dynamic route
  - `src/lib/platform-content.ts` — nội dung SEO cho từng platform
- **Cập nhật:**
  - `src/data/platforms.ts` — thêm thêm data (max resolution, supported codecs, etc.)
  - `src/components/CalculatorForm.tsx` — thêm `defaultPlatform` prop
  - Layout navigation — thêm "Platforms" link

---

### Phase 3: Game-Specific Blog Content (Tuần 4–5)

#### 3.3.1 Game Streaming Guides (10 bài)
Mỗi bài target "[game] streaming settings" — volume rất cao tại US.

| # | Slug | Target Keyword | Est. Volume |
|---|------|---------------|-------------|
| 1 | `best-obs-settings-fortnite` | "fortnite streaming settings" | ~8K/mo |
| 2 | `best-obs-settings-valorant` | "valorant streaming settings" | ~6K/mo |
| 3 | `best-obs-settings-warzone` | "warzone streaming settings" | ~5K/mo |
| 4 | `best-obs-settings-minecraft` | "minecraft streaming settings" | ~5K/mo |
| 5 | `best-obs-settings-gta-v` | "gta v streaming settings" | ~4K/mo |
| 6 | `best-obs-settings-apex-legends` | "apex legends streaming settings" | ~4K/mo |
| 7 | `best-obs-settings-league-of-legends` | "lol streaming settings" | ~3K/mo |
| 8 | `best-obs-settings-cs2` | "cs2 streaming settings" | ~3K/mo |
| 9 | `best-obs-settings-overwatch-2` | "overwatch 2 streaming settings" | ~2K/mo |
| 10 | `best-obs-settings-elden-ring` | "elden ring streaming settings" | ~2K/mo |

- **Nội dung mỗi bài:** OBS settings (bitrate, encoder, resolution, fps), game-specific tips (fast motion = higher bitrate), recommended PC specs, platform recommendations
- **Files:** Thêm 10 entries vào `src/data/blog-posts.ts` hoặc tạo 10 file `.mdx` trong `src/content/blog/`
- **Internal links:** Link đến calculator, bandwidth tool, platform pages

#### 3.3.2 Hardware & Setup Guides (7 bài)

| # | Slug | Target Keyword |
|---|------|---------------|
| 1 | `nvenc-vs-x264-streaming` | "nvenc vs x264" (~12K/mo) |
| 2 | `best-internet-speed-for-streaming` | "internet speed for streaming" (~30K/mo) |
| 3 | `obs-vs-streamlabs-2026` | "obs vs streamlabs" (~15K/mo) |
| 4 | `best-capture-card-for-streaming` | "best capture card" (~10K/mo) |
| 5 | `how-to-multistream` | "how to multistream" (~8K/mo) |
| 6 | `best-streaming-software-2026` | "best streaming software" (~12K/mo) |
| 7 | `best-microphone-for-streaming` | "best mic for streaming" (~8K/mo) |

---

### Phase 4: Glossary & Educational Pages (Tuần 6)

#### 3.4.1 Glossary Hub
- **Route:** `/glossary/` — index page listing tất cả terms
- **Route:** `/glossary/[term]/` — mỗi term 1 trang
- **Terms (20+):**

| Term | Target Keyword |
|------|---------------|
| bitrate | "what is bitrate" |
| codec | "what is a codec" |
| fps | "what is fps" |
| resolution | "what is video resolution" |
| cbr | "what is cbr" |
| vbr | "what is vbr" |
| keyframe | "what is a keyframe" |
| transcoding | "what is transcoding" |
| encoding | "what is video encoding" |
| latency | "what is stream latency" |
| buffering | "why does my stream buffer" |
| obs | "what is obs" |
| rtmp | "what is rtmp" |
| srt | "what is srt streaming" |
| hls | "what is hls" |
| ingest-server | "what is an ingest server" |
| b-frames | "what are b-frames" |
| chroma-subsampling | "what is chroma subsampling" |
| color-depth | "what is 10-bit color" |
| container-format | "what is a video container" |

- **Mỗi trang glossary gồm:**
  - Định nghĩa ngắn gọn (featured snippet friendly)
  - Giải thích chi tiết 200-400 words
  - "Related terms" links
  - "Use our [tool] to calculate..." CTA
  - FAQ schema
- **Files cần tạo:**
  - `src/app/glossary/page.tsx`
  - `src/app/glossary/[term]/page.tsx`
  - `src/data/glossary-terms.ts` — data cho tất cả terms

---

### Phase 5: Interactive Features & Engagement (Tuần 7–8)

#### 3.5.1 "Test My Setup" Wizard
- **Route:** `/setup-wizard/`
- **Target keywords:** "streaming setup guide", "what settings should I use for streaming"
- **Flow:**
  1. Chọn platform (Twitch/YouTube/Kick)
  2. Nhập upload speed (hoặc "Test my speed" link)
  3. Chọn game type (fast-paced FPS / slow-paced / just chatting / creative)
  4. Chọn GPU (NVIDIA/AMD/CPU encoding)
  5. → Output: recommended resolution, fps, bitrate, encoder, OBS settings
- **Files:**
  - `src/app/setup-wizard/page.tsx`
  - `src/components/SetupWizard.tsx`
  - `src/lib/setup-recommendations.ts` — logic recommend

#### 3.5.2 Share Results via URL
- **Mục đích:** Cho phép user share kết quả calculator qua URL → tăng backlinks tự nhiên
- **Implementation:** Encode calculator state vào URL query params
  - Ví dụ: `streamersize.com/?res=1080p&fps=60&codec=h264&dur=3600`
  - Khi load page với params → auto-fill calculator + hiển thị results
- **Files cần sửa:**
  - `src/components/CalculatorForm.tsx` — đọc/ghi URL params
  - `src/components/ShareButton.tsx` — generate shareable URL

#### 3.5.3 Embeddable Widget
- **Mục đích:** Cho phép blog/website khác embed calculator → backlinks
- **Route:** `/embed/` — lightweight version của calculator (no header/footer)
- **Cung cấp embed code:**
  ```html
  <iframe src="https://streamersize.com/embed/" width="100%" height="500"></iframe>
  ```
- **Files:**
  - `src/app/embed/page.tsx` — minimal layout calculator
  - `src/app/embed/layout.tsx` — bare layout (no nav/footer)

---

### Phase 6: SEO Kỹ thuật (Tuần 8–9)

#### 3.6.1 Internal Linking Improvements
- Thêm "Related Tools" section vào cuối mỗi blog post (đã có `RelatedTools` component, cần mở rộng)
- Thêm "Related Articles" section vào cuối mỗi tool page
- Thêm contextual links trong blog content → tools & glossary pages
- **Files cần sửa:**
  - `src/components/RelatedTools.tsx` — thêm logic auto-suggest related content
  - `src/app/blog/[slug]/page.tsx` — thêm related articles section
  - Tất cả tool pages — thêm related blog links

#### 3.6.2 Hreflang & Locale
- Thêm `<link rel="alternate" hreflang="en-US">` vào tất cả pages
- Đảm bảo `locale: "en_US"` trong OpenGraph (đã có trong layout.tsx ✅)
- **File:** `src/app/layout.tsx`

#### 3.6.3 Structured Data Mở rộng
- Thêm `WebSite` schema với `SearchAction` (sitelinks search box)
- Thêm `Organization` schema
- Thêm `HowTo` schema cho các blog hướng dẫn
- **File:** `src/app/layout.tsx`, blog pages

#### 3.6.4 Performance
- Đảm bảo tất cả trang mới đều là static (SSG)
- Lazy load components nặng (charts, tables)
- Preconnect Google Fonts, Analytics

---

### Phase 7: Off-site Promotion (Tuần 9–10)

#### 3.7.1 Reddit
- Post tools lên các subreddit:
  - r/Twitch (~2M members)
  - r/streaming (~100K)
  - r/obs (~150K)
  - r/letsplay (~200K)
  - r/NewTubers (~400K)
  - r/videography (~300K)
- Format: "I built a free [tool name] for streamers — no signup, no ads"
- Timing: Post vào 9-11 AM EST (peak US Reddit traffic)

#### 3.7.2 Product Hunt
- Submit StreamerSize as a product
- Prepare: logo, description, screenshots, maker comment

#### 3.7.3 Community Engagement
- Trả lời câu hỏi trên Reddit/Quora liên quan đến bitrate/streaming settings
- Link về tools khi relevant (không spam)
- Tạo YouTube short video demo tools

---

## 4. Cấu trúc thư mục sau khi hoàn thành

```
src/
├── app/
│   ├── page.tsx                          # Homepage (existing)
│   ├── about/                            # (existing)
│   ├── blog/
│   │   ├── page.tsx                      # Blog index (existing)
│   │   └── [slug]/page.tsx               # Blog posts (existing, +17 new posts)
│   ├── compare/page.tsx                  # Codec comparison (existing)
│   ├── size/
│   │   ├── page.tsx                      # Size index (existing)
│   │   └── [slug]/page.tsx               # Programmatic pages (existing)
│   ├── tools/
│   │   ├── page.tsx                      # Tools index (update)
│   │   ├── bandwidth-calculator/         # (existing)
│   │   ├── upload-time-calculator/       # (existing)
│   │   ├── recording-time-calculator/    # (existing)
│   │   ├── aspect-ratio-calculator/      # NEW
│   │   ├── compression-calculator/       # NEW
│   │   ├── fps-calculator/               # NEW
│   │   └── disk-space-planner/           # NEW
│   ├── platforms/                         # NEW
│   │   ├── page.tsx                      # Platform index
│   │   └── [platform]/page.tsx           # Platform detail
│   ├── glossary/                          # NEW
│   │   ├── page.tsx                      # Glossary index
│   │   └── [term]/page.tsx               # Term detail
│   ├── setup-wizard/page.tsx              # NEW
│   ├── embed/                             # NEW
│   │   ├── layout.tsx                    # Bare layout
│   │   └── page.tsx                      # Embeddable calculator
│   └── privacy-policy/                   # (existing)
├── components/
│   ├── (existing components...)
│   ├── AspectRatioCalculator.tsx          # NEW
│   ├── CompressionCalculator.tsx          # NEW
│   ├── FpsCalculator.tsx                  # NEW
│   ├── DiskSpacePlanner.tsx               # NEW
│   └── SetupWizard.tsx                    # NEW
├── data/
│   ├── blog-posts.ts                     # (update: +17 posts)
│   ├── platforms.ts                      # (update: thêm data)
│   ├── presets.ts                        # (existing)
│   └── glossary-terms.ts                 # NEW
├── content/
│   └── blog/                             # (existing .mdx + 17 new)
└── lib/
    ├── calculate.ts                      # (existing, reuse)
    ├── seo.ts                            # (update)
    ├── seo-matrix.ts                     # (existing)
    ├── content-generator.ts              # (existing)
    ├── strategic-pages.ts                # (existing)
    ├── platform-content.ts               # NEW
    └── setup-recommendations.ts          # NEW
```

---

## 5. Tổng kết số lượng trang mới

| Loại | Số trang | Ghi chú |
|------|----------|---------|
| Tools mới | 4 | Aspect ratio, compression, FPS, disk planner |
| Platform pages | 6 | Index + 5 platforms |
| Blog posts mới | 17 | 10 game guides + 7 hardware/setup |
| Glossary pages | 21 | Index + 20 terms |
| Setup Wizard | 1 | Interactive wizard |
| Embed page | 1 | Embeddable widget |
| **Tổng trang mới** | **50** | |
| **Tổng trang site** | **~155** | Existing ~105 + 50 new |

---

## 6. Timeline

| Tuần | Phase | Deliverables |
|------|-------|-------------|
| 1–2 | Phase 1 | 4 tools mới + cập nhật navigation |
| 3 | Phase 2 | 6 platform pages |
| 4–5 | Phase 3 | 17 blog posts mới |
| 6 | Phase 4 | 21 glossary pages |
| 7–8 | Phase 5 | Setup wizard + share URL + embed widget |
| 8–9 | Phase 6 | SEO kỹ thuật (internal links, schema, hreflang) |
| 9–10 | Phase 7 | Off-site promotion (Reddit, Product Hunt) |

---

## 7. Ưu tiên nếu thời gian hạn chế

Nếu không đủ thời gian làm hết, ưu tiên theo impact:

1. **Aspect Ratio Calculator** — volume cao nhất, dễ làm nhất
2. **Platform landing pages** — high-intent keywords, tái sử dụng data có sẵn
3. **10 game-specific blog posts** — volume lớn tại US, content dạng này rank nhanh
4. **Glossary pages** — bắt long-tail, tăng topical authority
5. **Setup Wizard** — tăng engagement, shareability
6. Phần còn lại

---

## 8. Metrics & Tracking

- Google Search Console: theo dõi indexed pages, impressions, clicks
- Google Analytics: pageviews, users by country, bounce rate
- Theo dõi keyword rankings cho top 20 target keywords
- Review & adjust monthly

---

*End of RFC*
