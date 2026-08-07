"use client";

import { useEffect, useRef } from "react";

export default function StarsBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const count = Math.max(50, Math.floor((width * height) / 4000));

    for (let i = 0; i < count; i++) {
      const star = document.createElement("figure");
      star.className = "absolute bg-white rounded-full animate-twinkle";

      const size = Math.random() * 3 + 1;
      star.style.width = size + "px";
      star.style.height = size + "px";
      star.style.top = Math.random() * 100 + "%";
      star.style.left = Math.random() * 100 + "%";
      star.style.opacity = "0";

      const duration = (2 + Math.random() * 4) * 1000;
      const delay = Math.random() * 5 * 1000;

      star.animate([{ opacity: 0.1 }, { opacity: 0.8 }], {
        duration,
        delay,
        iterations: Infinity,
        direction: "alternate",
        easing: "ease-in-out",
      });

      container.appendChild(star);
    }

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-full z-20 pointer-events-none overflow-hidden"
    />
  );
}
