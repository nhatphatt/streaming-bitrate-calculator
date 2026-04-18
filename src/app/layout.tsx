import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});
import ThemeToggle from "@/components/ThemeToggle";
import ToolsDropdown from "@/components/ToolsDropdown";
import MobileMenu from "@/components/MobileMenu";
import Analytics from "@/components/Analytics";
import ErrorBoundary from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: {
    default: "Streaming Bitrate & Storage Calculator | Free Online Tool",
    template: "%s | Streaming Bitrate Calculator",
  },
  description:
    "Calculate video file size, streaming bitrate, and storage requirements for any resolution (1080p, 4K, 8K), frame rate, and codec. Free, fast, and accurate.",
  metadataBase: new URL("https://streamersize.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "StreamerSize — Bitrate & Storage Calculator",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StreamerSize — Streaming Bitrate & Storage Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Streaming Bitrate & Storage Calculator | Free Online Tool",
    description:
      "Calculate video file size, streaming bitrate, and storage requirements for any resolution, frame rate, and codec.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    languages: {
      "en-US": "https://streamersize.com",
      "x-default": "https://streamersize.com",
    },
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        {/* Inline script to prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem("theme")==="dark")document.documentElement.classList.add("dark")}catch(e){}})()`,
          }}
        />
        {/* WebSite schema — helps sitelinks + brand recognition */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "StreamerSize",
              url: "https://streamersize.com",
              description:
                "Free tools for streamers and video creators. Calculate bitrate, file size, and storage instantly.",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://streamersize.com/size/{search_term_string}/",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        {/* Organization schema — E-E-A-T signals */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "StreamerSize",
              url: "https://streamersize.com",
              logo: {
                "@type": "ImageObject",
                url: "https://streamersize.com/favicon.png",
              },
              sameAs: [],
            }),
          }}
        />
      </head>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8696412606318158"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Analytics />
        <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background-80)] backdrop-blur-md">
          <nav className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
            <Link
              href="/"
              className="group flex items-center gap-2 text-lg font-bold text-[var(--foreground)] transition-colors"
            >
              <Image
                src="/favicon.png"
                alt=""
                width={28}
                height={28}
                className="rounded-lg"
                priority
              />
              <span className="tracking-wide group-hover:text-[var(--brand)] transition-colors">
                Streamer<span className="text-[var(--brand)] group-hover:text-[var(--foreground)] transition-colors">Size</span>
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <ToolsDropdown />
              <Link
                href="/platforms/"
                className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors hidden md:inline"
              >
                Platforms
              </Link>
              <Link
                href="/compare/"
                className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors hidden md:inline"
              >
                Compare
              </Link>
              <Link
                href="/blog/"
                className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors hidden md:inline"
              >
                Blog
              </Link>
              <ThemeToggle />
              <MobileMenu />
            </div>
          </nav>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-8" aria-label="Main content">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>

        <footer className="border-t border-[var(--border)] mt-20 bg-[var(--muted)]">
          <div className="mx-auto max-w-5xl px-4 pt-12 pb-8">
            {/* Top section: brand + columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
              {/* Brand */}
              <div className="sm:col-span-2 lg:col-span-1">
                <Link href="/" className="flex items-center gap-2 mb-3">
                  <Image src="/favicon.png" alt="" width={24} height={24} className="rounded-lg" />
                  <span className="font-bold tracking-wide">
                    Streamer<span className="text-[var(--brand)]">Size</span>
                  </span>
                </Link>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed max-w-xs">
                  Free tools for streamers and video creators. Calculate bitrate,
                  file size, and storage — instantly in your browser.
                </p>
              </div>

              {/* Calculators */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Calculators</h4>
                <ul className="text-sm text-[var(--muted-foreground)] space-y-2">
                  <li><Link href="/size/1080p-60fps/" className="hover:text-[var(--primary)] transition-colors">1080p 60fps</Link></li>
                  <li><Link href="/size/1080p-streaming-bitrate/" className="hover:text-[var(--primary)] transition-colors">1080p Bitrate Guide</Link></li>
                  <li><Link href="/size/4k-30fps/" className="hover:text-[var(--primary)] transition-colors">4K 30fps</Link></li>
                  <li><Link href="/size/4k-60fps/" className="hover:text-[var(--primary)] transition-colors">4K 60fps</Link></li>
                  <li><Link href="/size/4k-streaming-bitrate/" className="hover:text-[var(--primary)] transition-colors">4K Bitrate Guide</Link></li>
                  <li><Link href="/size/" className="hover:text-[var(--primary)] transition-colors">All Resolutions &rarr;</Link></li>
                </ul>
              </div>

              {/* Tools */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Tools</h4>
                <ul className="text-sm text-[var(--muted-foreground)] space-y-2">
                  <li><Link href="/" className="hover:text-[var(--primary)] transition-colors">Bitrate Calculator</Link></li>
                  <li><Link href="/compare/" className="hover:text-[var(--primary)] transition-colors">Codec Comparison</Link></li>
                  <li><Link href="/tools/bandwidth-calculator/" className="hover:text-[var(--primary)] transition-colors">Bandwidth Calculator</Link></li>
                  <li><Link href="/tools/upload-time-calculator/" className="hover:text-[var(--primary)] transition-colors">Upload Time Calculator</Link></li>
                  <li><Link href="/tools/recording-time-calculator/" className="hover:text-[var(--primary)] transition-colors">Recording Time Calculator</Link></li>
                  <li><Link href="/tools/aspect-ratio-calculator/" className="hover:text-[var(--primary)] transition-colors">Aspect Ratio Calculator</Link></li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Resources</h4>
                <ul className="text-sm text-[var(--muted-foreground)] space-y-2">
                  <li><Link href="/blog/" className="hover:text-[var(--primary)] transition-colors">Guides &amp; Blog</Link></li>
                  <li><Link href="/blog/youtube-streaming-bitrate-guide/" className="hover:text-[var(--primary)] transition-colors">YouTube Bitrate Guide</Link></li>
                  <li><Link href="/blog/twitch-streaming-bitrate-guide/" className="hover:text-[var(--primary)] transition-colors">Twitch Bitrate Guide</Link></li>
                  <li><Link href="/blog/best-obs-bitrate-settings/" className="hover:text-[var(--primary)] transition-colors">OBS Bitrate Guide</Link></li>
                  <li><Link href="/platforms/" className="hover:text-[var(--primary)] transition-colors">Platform Settings</Link></li>
                  <li><Link href="/glossary/" className="hover:text-[var(--primary)] transition-colors">Glossary</Link></li>
                  <li><Link href="/about/" className="hover:text-[var(--primary)] transition-colors">About</Link></li>
                  <li><Link href="/privacy-policy/" className="hover:text-[var(--primary)] transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-[var(--muted-foreground)]">
                &copy; {new Date().getFullYear()} Streamer<span className="text-[var(--brand)]">Size</span>. All rights reserved.
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">
                All calculations run 100% in your browser.{" "}
                We use analytics and ads to keep this tool free.{" "}
                <Link href="/privacy-policy/" className="underline hover:text-[var(--foreground)] transition-colors">Privacy Policy</Link>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
