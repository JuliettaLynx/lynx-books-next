import React, { useEffect, useRef, useCallback } from "react";

interface ShootingStarsProps {
  interval?: number;
}

const ShootingStars: React.FC<ShootingStarsProps> = ({ interval = 2000 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const starTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isInitialized = useRef(false);

  const createFallingStar = useCallback(() => {
    if (!containerRef.current) return;

    const star = document.createElement("div");
    star.className =
      "absolute w-[7px] h-[7px] bg-white rounded-full pointer-events-none top-[-10vh]";

    const x = 30 + Math.random() * 140;
    star.style.left = x + "vw";

    const duration = 1 + Math.random() * 2;
    star.style.transitionDuration = duration + "s";

    containerRef.current.appendChild(star);

    requestAnimationFrame(() => {
      star.style.transform = "translateX(-120vw) translateY(120vh)";
    });

    const timeout = setTimeout(
      () => {
        if (star.parentNode) star.remove();
      },
      duration * 1000 + 200,
    );

    starTimeoutsRef.current.push(timeout);
  }, []);

  useEffect(() => {
    if (!containerRef.current || isInitialized.current) return;

    createFallingStar();
    intervalRef.current = setInterval(createFallingStar, interval);
    isInitialized.current = true;

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      starTimeoutsRef.current.forEach((t) => clearTimeout(t));
      starTimeoutsRef.current = [];
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      isInitialized.current = false;
    };
  }, [createFallingStar, interval]);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-screen h-screen pointer-events-none z-10 overflow-hidden"
    />
  );
};

export default ShootingStars;
