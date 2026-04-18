# Streaming Bitrate & Storage Calculator

A free online tool to calculate video file size, bitrate, and storage needs for streaming workflows. Supports resolutions from 720p to 8K, multiple codecs (H.264, HEVC, ProRes), and various frame rates.

🔗 **Live:** https://streamersize.com/
## Features

- **Bitrate Calculator** – Estimate optimal bitrate for any resolution, frame rate, and codec
- **File Size Calculator** – Calculate video file size based on bitrate and duration
- **Storage Calculator** – Plan storage requirements for video projects
- **Codec Comparison** – Compare file sizes across H.264, HEVC, AV1, ProRes, and more
- **Blog & Guides** – In-depth articles on streaming and video encoding

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript
- **Testing:** Vitest + Testing Library
- **Deployment:** Cloudflare Pages (via Wrangler)

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Project Structure

```
src/
├── app/          # Next.js App Router pages
├── components/   # React components
├── content/      # Blog/article content
├── data/         # Presets & static data
└── lib/          # Utility functions
```

## License

MIT
