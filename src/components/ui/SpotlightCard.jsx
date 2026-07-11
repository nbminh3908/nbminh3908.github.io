import { useRef } from "react";

export default function SpotlightCard({ as: Tag = "div", className = "", children, ...props }) {
  const ref = useRef(null);

  function handleMouseMove(event) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  }

  return (
    <Tag
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden rounded-2xl border border-base-border glass-panel ${className}`}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(280px circle at var(--spot-x) var(--spot-y), var(--color-accent-soft), transparent 70%)",
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </Tag>
  );
}
