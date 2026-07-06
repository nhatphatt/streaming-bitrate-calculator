"use client";

import { useEffect, useRef } from "react";
import { ADSTERRA_DOMAIN, ADSTERRA_NATIVE } from "@/lib/adsterra";

/**
 * Adsterra Native Banner. The async invoke.js fills `#container-<id>`.
 * We build the container + script fresh on each mount (and tear them down on
 * unmount) so it re-renders correctly across Next.js client-side navigation
 * and never collides on a repeated container id.
 */
export default function AdsterraNative({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const container = document.createElement("div");
    container.id = `container-${ADSTERRA_NATIVE.containerId}`;
    host.appendChild(container);

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = `${ADSTERRA_DOMAIN}/${ADSTERRA_NATIVE.containerId}/invoke.js`;
    host.appendChild(script);

    return () => {
      host.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className={`my-6 w-full ${className}`}
      role="complementary"
      aria-label="Advertisement"
    />
  );
}
