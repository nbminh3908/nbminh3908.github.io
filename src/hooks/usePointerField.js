import { useEffect, useRef } from "react";

/**
 * Tracks pointer position and scroll progress, writing them to CSS custom
 * properties on <html> via requestAnimationFrame so consumers (the aurora
 * background, spotlight cards, etc.) can read them purely through CSS —
 * no re-renders, stays smooth at 60fps.
 */
export function usePointerField() {
  const frame = useRef(null);
  const target = useRef({ x: 0.5, y: 0.35 });
  const current = useRef({ x: 0.5, y: 0.35 });

  useEffect(() => {
    const root = document.documentElement;

    function handlePointerMove(event) {
      target.current.x = event.clientX / window.innerWidth;
      target.current.y = event.clientY / window.innerHeight;
    }

    function handleScroll() {
      const max = document.body.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      root.style.setProperty("--scroll-progress", progress.toFixed(4));
    }

    function tick() {
      current.current.x += (target.current.x - current.current.x) * 0.06;
      current.current.y += (target.current.y - current.current.y) * 0.06;
      root.style.setProperty("--aurora-x", `${(current.current.x * 100).toFixed(2)}%`);
      root.style.setProperty("--aurora-y", `${(current.current.y * 100).toFixed(2)}%`);
      frame.current = requestAnimationFrame(tick);
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    frame.current = requestAnimationFrame(tick);
    handleScroll();

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);
}
