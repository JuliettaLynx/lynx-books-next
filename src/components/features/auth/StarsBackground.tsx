"use client";

import { useEffect, useRef } from "react";
import "./authBgStyle.css";

export default function StarsBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const count = Math.max(1, Math.floor((width * height) / 4000));

    for (let i = 0; i < count; i++) {
      const star = document.createElement("figure");
      star.className = "star";

      const size = Math.random() * 3 + 1;
      star.style.width = size + "px";
      star.style.height = size + "px";

      const x = Math.random() * 100;
      const y = Math.random() * 100;
      star.style.top = y + "%";
      star.style.left = x + "%";

      const duration = 2 + Math.random() * 4;
      const delay = Math.random() * 5;
      star.style.animationDuration = duration + "s";
      star.style.animationDelay = delay + "s";

      star.style.opacity = "0";

      container.appendChild(star);
    }

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (
    <div
      id="stars-container"
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 20,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    />
  );
}
