export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased p-4">
        {children}
      </body>
    </html>
  );
}
