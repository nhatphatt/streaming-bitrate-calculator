export interface GlossaryTerm {
  slug: string;
  term: string;
  shortDef: string;
  description: string;
  relatedTerms: string[];
  relatedTools: { href: string; label: string }[];
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    slug: "bitrate",
    term: "Bitrate",
    shortDef: "The amount of data processed per second in a video or audio stream, measured in Kbps or Mbps.",
    description: "Bitrate determines how much data is used to represent each second of video. Higher bitrate generally means better quality, but also larger file sizes and more bandwidth required. For streaming, bitrate is the single most important setting — it directly controls your video quality and determines whether viewers can watch without buffering. Common streaming bitrates range from 2,500 Kbps (720p 30fps) to 51,000 Kbps (4K 60fps on YouTube).",
    relatedTerms: ["codec", "cbr", "vbr", "resolution", "fps"],
    relatedTools: [{ href: "/", label: "Bitrate Calculator" }, { href: "/tools/bandwidth-calculator/", label: "Bandwidth Calculator" }],
  },
  {
    slug: "codec",
    term: "Codec",
    shortDef: "Software or hardware that compresses and decompresses video data. Common codecs include H.264, HEVC, VP9, and AV1.",
    description: "A codec (coder-decoder) is an algorithm that compresses raw video into a smaller format for storage or transmission, and decompresses it for playback. Different codecs offer different tradeoffs between compression efficiency, encoding speed, and compatibility. H.264 is the most widely supported codec for streaming, while newer codecs like HEVC and AV1 offer 40-50% better compression at the cost of higher encoding complexity.",
    relatedTerms: ["bitrate", "encoding", "transcoding", "container-format"],
    relatedTools: [{ href: "/compare/", label: "Codec Comparison" }, { href: "/tools/compression-calculator/", label: "Compression Calculator" }],
  },
  {
    slug: "fps",
    term: "FPS (Frames Per Second)",
    shortDef: "The number of individual images displayed per second in a video. Common values are 24, 30, 60, and 120 fps.",
    description: "Frames per second (FPS) determines how smooth motion appears in video. Higher FPS produces smoother motion but requires more bitrate and processing power. 30fps is standard for most video content, 60fps is preferred for gaming and sports, and 24fps is the cinema standard. For streaming, 60fps is ideal for fast-paced games while 30fps works well for slower content like Just Chatting or strategy games.",
    relatedTerms: ["bitrate", "resolution", "encoding"],
    relatedTools: [{ href: "/tools/fps-calculator/", label: "FPS Calculator" }, { href: "/", label: "Bitrate Calculator" }],
  },
  {
    slug: "resolution",
    term: "Resolution",
    shortDef: "The number of pixels in each dimension of a video frame. Common resolutions include 720p (1280×720), 1080p (1920×1080), and 4K (3840×2160).",
    description: "Resolution defines the detail level of your video — more pixels means sharper images. However, higher resolution requires proportionally more bitrate to maintain quality. Streaming at 1080p with insufficient bitrate can look worse than 720p with adequate bitrate. For most streamers, 1080p is the sweet spot. 4K streaming is only practical on YouTube with 25,000+ Kbps upload bandwidth.",
    relatedTerms: ["bitrate", "fps", "aspect-ratio"],
    relatedTools: [{ href: "/size/", label: "Resolution Calculator" }, { href: "/tools/aspect-ratio-calculator/", label: "Aspect Ratio Calculator" }],
  },
  {
    slug: "cbr",
    term: "CBR (Constant Bitrate)",
    shortDef: "An encoding mode where the bitrate stays the same throughout the entire video, regardless of scene complexity.",
    description: "Constant Bitrate (CBR) maintains a fixed data rate throughout your stream. This is the recommended mode for live streaming because it provides predictable bandwidth usage — your ISP and the streaming platform always know exactly how much data to expect. The downside is that simple scenes (static screens) use more data than necessary, while complex scenes (fast action) may not get enough data. Despite this, CBR is preferred for streaming because it prevents buffering caused by bitrate spikes.",
    relatedTerms: ["vbr", "bitrate", "encoding"],
    relatedTools: [{ href: "/", label: "Bitrate Calculator" }],
  },
  {
    slug: "vbr",
    term: "VBR (Variable Bitrate)",
    shortDef: "An encoding mode where bitrate fluctuates based on scene complexity — more data for complex scenes, less for simple ones.",
    description: "Variable Bitrate (VBR) dynamically adjusts the data rate based on what's happening in the video. Complex scenes (explosions, fast motion) get more bitrate, while simple scenes (static menus) use less. This produces better overall quality for recordings and uploads, but is NOT recommended for live streaming because the bitrate spikes can cause buffering for viewers with limited bandwidth. Use VBR for local recordings and YouTube uploads, CBR for live streaming.",
    relatedTerms: ["cbr", "bitrate", "encoding"],
    relatedTools: [{ href: "/", label: "Bitrate Calculator" }],
  },
  {
    slug: "keyframe",
    term: "Keyframe (I-Frame)",
    shortDef: "A complete video frame that doesn't reference other frames. Streaming platforms require keyframes every 2 seconds.",
    description: "A keyframe (also called an I-frame or Intra-frame) is a complete image stored in the video stream. Between keyframes, only the differences between frames are stored (P-frames and B-frames), which saves space. Streaming platforms require keyframes at regular intervals (typically every 2 seconds) so viewers can join the stream at any point and immediately see a complete image. In OBS, set your Keyframe Interval to 2 seconds for Twitch, YouTube, and Kick.",
    relatedTerms: ["b-frames", "encoding", "bitrate"],
    relatedTools: [{ href: "/", label: "Bitrate Calculator" }],
  },
  {
    slug: "transcoding",
    term: "Transcoding",
    shortDef: "Converting a video from one codec, resolution, or bitrate to another. Streaming platforms transcode your stream to offer multiple quality options.",
    description: "Transcoding is the process of decoding a video and re-encoding it in a different format. When you stream to Twitch or YouTube, the platform transcodes your stream into multiple quality levels (1080p, 720p, 480p, etc.) so viewers can choose based on their internet speed. YouTube transcodes all streams automatically. Twitch only guarantees transcoding for Partners — non-partners may not get quality options, which is why staying at or below 6,000 Kbps is important.",
    relatedTerms: ["encoding", "codec", "bitrate"],
    relatedTools: [{ href: "/platforms/twitch/", label: "Twitch Settings" }, { href: "/platforms/youtube/", label: "YouTube Settings" }],
  },
  {
    slug: "encoding",
    term: "Encoding",
    shortDef: "The process of compressing raw video data into a smaller format using a codec like H.264, HEVC, or AV1.",
    description: "Video encoding compresses raw video frames into a compact format suitable for streaming or storage. The encoder analyzes each frame, removes redundant information, and outputs a compressed bitstream. Encoding can be done in software (x264, running on CPU) or hardware (NVENC on NVIDIA GPUs, AMF on AMD GPUs). Hardware encoding is faster with less CPU impact, while software encoding typically produces slightly better quality at the same bitrate.",
    relatedTerms: ["codec", "transcoding", "bitrate"],
    relatedTools: [{ href: "/compare/", label: "Codec Comparison" }, { href: "/tools/compression-calculator/", label: "Compression Calculator" }],
  },
  {
    slug: "latency",
    term: "Latency (Stream Delay)",
    shortDef: "The time delay between something happening on your screen and viewers seeing it. Typically 2-15 seconds for live streams.",
    description: "Stream latency is the delay between your live action and what viewers see. Lower latency enables better interaction with chat but may reduce stream stability. Normal latency on Twitch is 3-5 seconds, low latency is 1-3 seconds. YouTube offers ultra-low latency (~2 seconds) but with slightly reduced quality. Factors affecting latency include your encoder settings, the platform's ingest servers, CDN routing, and the viewer's player buffer.",
    relatedTerms: ["buffering", "bitrate", "keyframe"],
    relatedTools: [{ href: "/platforms/", label: "Platform Settings" }],
  },
  {
    slug: "buffering",
    term: "Buffering",
    shortDef: "When a viewer's player pauses to download more data because the stream bitrate exceeds their download speed.",
    description: "Buffering occurs when a viewer's internet connection can't download stream data fast enough to play it in real-time. This is usually caused by the streamer's bitrate being too high for some viewers' connections. On Twitch, streaming above 6,000 Kbps without transcoding means viewers with slow connections will buffer. The solution is to keep bitrate within platform recommendations or ensure transcoding is available so viewers can select a lower quality option.",
    relatedTerms: ["bitrate", "latency", "transcoding"],
    relatedTools: [{ href: "/tools/bandwidth-calculator/", label: "Bandwidth Calculator" }, { href: "/platforms/twitch/", label: "Twitch Settings" }],
  },
  {
    slug: "obs",
    term: "OBS (Open Broadcaster Software)",
    shortDef: "Free, open-source software for live streaming and recording. The most popular streaming application worldwide.",
    description: "OBS Studio is the industry-standard software for live streaming and screen recording. It supports all major streaming platforms (Twitch, YouTube, Kick, Facebook), multiple encoders (NVENC, x264, AV1), and has an extensive plugin ecosystem. OBS uses a scene/source system where you compose your stream layout from multiple sources (game capture, webcam, overlays, alerts). It's free, open-source, and available on Windows, Mac, and Linux.",
    relatedTerms: ["encoding", "bitrate", "fps"],
    relatedTools: [{ href: "/", label: "Bitrate Calculator" }, { href: "/platforms/", label: "Platform Settings" }],
  },
  {
    slug: "rtmp",
    term: "RTMP (Real-Time Messaging Protocol)",
    shortDef: "The standard protocol used to send live video from your encoder to streaming platforms like Twitch, YouTube, and Kick.",
    description: "RTMP is the protocol that carries your live stream from OBS to the streaming platform's ingest servers. When you enter a 'Stream URL' and 'Stream Key' in OBS, you're configuring an RTMP connection. While RTMP is aging technology (developed by Adobe for Flash), it remains the standard for stream ingest because of its low latency and universal support. Some platforms also support SRT and WHIP as alternatives.",
    relatedTerms: ["srt", "encoding", "latency"],
    relatedTools: [{ href: "/platforms/", label: "Platform Settings" }],
  },
  {
    slug: "srt",
    term: "SRT (Secure Reliable Transport)",
    shortDef: "A modern streaming protocol that handles packet loss and network instability better than RTMP. Used for remote production.",
    description: "SRT is a newer streaming protocol designed to maintain stream quality over unreliable networks. Unlike RTMP, SRT can recover from packet loss and handle network jitter, making it ideal for streaming over the public internet, remote production, and contribution feeds. Some platforms and encoders support SRT as an alternative to RTMP. It's particularly useful for IRL streaming where network conditions are unpredictable.",
    relatedTerms: ["rtmp", "latency", "encoding"],
    relatedTools: [{ href: "/platforms/", label: "Platform Settings" }],
  },
  {
    slug: "hls",
    term: "HLS (HTTP Live Streaming)",
    shortDef: "A streaming protocol developed by Apple that delivers video in small chunks over HTTP. Used for playback delivery to viewers.",
    description: "HLS is the protocol used to deliver live streams to viewers' browsers and apps. Unlike RTMP (which is used for ingest), HLS breaks the stream into small segments (typically 2-6 seconds) and delivers them over standard HTTP. This makes it compatible with CDNs and firewalls. Most streaming platforms use HLS for viewer delivery, which is why there's always some latency between the streamer and viewers.",
    relatedTerms: ["rtmp", "latency", "buffering"],
    relatedTools: [{ href: "/platforms/", label: "Platform Settings" }],
  },
  {
    slug: "ingest-server",
    term: "Ingest Server",
    shortDef: "The streaming platform's server that receives your live stream data. Choosing the closest server reduces latency and dropped frames.",
    description: "An ingest server is the entry point where your stream enters the platform's infrastructure. Twitch, YouTube, and Kick have ingest servers worldwide. Connecting to the closest server minimizes network latency and reduces the chance of dropped frames. In OBS, you can select your ingest server in Stream settings. Most platforms offer 'Auto' selection that picks the best server, but manually selecting the closest one can sometimes improve stability.",
    relatedTerms: ["rtmp", "latency", "buffering"],
    relatedTools: [{ href: "/tools/bandwidth-calculator/", label: "Bandwidth Calculator" }],
  },
  {
    slug: "b-frames",
    term: "B-Frames (Bidirectional Frames)",
    shortDef: "Video frames that reference both previous and future frames for better compression. Setting 2 B-frames is standard for streaming.",
    description: "B-frames (Bidirectional predicted frames) are a compression technique where a frame is encoded using references to both the frame before and after it. This provides better compression than P-frames (which only reference the previous frame) but adds a small amount of encoding latency. For streaming, 2 B-frames is the standard setting — it provides good compression without noticeable latency. Setting B-frames to 0 slightly reduces latency but increases file size.",
    relatedTerms: ["keyframe", "encoding", "codec"],
    relatedTools: [{ href: "/", label: "Bitrate Calculator" }, { href: "/compare/", label: "Codec Comparison" }],
  },
  {
    slug: "chroma-subsampling",
    term: "Chroma Subsampling",
    shortDef: "A technique that reduces color data in video to save bandwidth. 4:2:0 is standard for streaming, 4:4:4 preserves full color.",
    description: "Chroma subsampling reduces the resolution of color information in video while keeping full luminance (brightness) detail. The human eye is more sensitive to brightness than color, so this compression is mostly invisible. 4:2:0 (used in all streaming) reduces color resolution by 75%. 4:2:2 (used in ProRes 422) reduces it by 50%. 4:4:4 preserves full color and is used for graphics, text overlays, and professional production where color accuracy is critical.",
    relatedTerms: ["color-depth", "codec", "encoding"],
    relatedTools: [{ href: "/compare/", label: "Codec Comparison" }],
  },
  {
    slug: "color-depth",
    term: "Color Depth (Bit Depth)",
    shortDef: "The number of bits used to represent color per pixel. 8-bit is standard, 10-bit enables HDR and smoother gradients.",
    description: "Color depth (or bit depth) determines how many distinct colors can be represented in each pixel. 8-bit video supports 16.7 million colors and is the standard for streaming. 10-bit video supports over 1 billion colors, enabling HDR content and eliminating color banding in gradients. Most streaming platforms accept 8-bit only, though YouTube supports 10-bit HDR. Encoding in 10-bit requires more processing power and bitrate.",
    relatedTerms: ["chroma-subsampling", "codec", "encoding"],
    relatedTools: [{ href: "/compare/", label: "Codec Comparison" }],
  },
  {
    slug: "container-format",
    term: "Container Format",
    shortDef: "A file format that holds video, audio, and metadata together. Common containers include MP4, MKV, MOV, and FLV.",
    description: "A container format (or wrapper) is the file format that packages video streams, audio streams, subtitles, and metadata into a single file. The container doesn't affect video quality — that's determined by the codec. Common containers: MP4 (most compatible), MKV (supports all codecs, less compatible), MOV (Apple ecosystem), FLV (legacy streaming format). For recording in OBS, MKV is recommended because it's recoverable if OBS crashes. You can remux MKV to MP4 afterward without re-encoding.",
    relatedTerms: ["codec", "encoding"],
    relatedTools: [{ href: "/tools/compression-calculator/", label: "Compression Calculator" }],
  },
];

export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return GLOSSARY_TERMS.find((t) => t.slug === slug);
}

export function getAllGlossarySlugs(): string[] {
  return GLOSSARY_TERMS.map((t) => t.slug);
}
