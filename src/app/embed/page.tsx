import type { Metadata } from "next";
import CalculatorForm from "@/components/CalculatorForm";

export const metadata: Metadata = {
  title: "StreamerSize Embed — Bitrate Calculator Widget",
  robots: { index: false, follow: false },
};

export default function EmbedPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <CalculatorForm />
      <div className="mt-4 text-center text-xs text-gray-500">
        Powered by <a href="https://streamersize.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">StreamerSize.com</a>
      </div>
    </div>
  );
}
