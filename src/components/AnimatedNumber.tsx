"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: string;
  className?: string;
}

/**
 * Smoothly animates between text values with a brief fade transition.
 */
export default function AnimatedNumber({
  value,
  className = "",
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value);
  const [fading, setFading] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (value !== prevValue.current) {
      setFading(true);
      const timer = setTimeout(() => {
        setDisplay(value);
        setFading(false);
        prevValue.current = value;
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <span
      className={`inline-block transition-all duration-150 ${
        fading ? "opacity-30 scale-95" : "opacity-100 scale-100"
      } ${className}`}
    >
      {display}
    </span>
  );
}
