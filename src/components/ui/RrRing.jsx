import { buildRrRingGeometry } from "../../utils/valorant.js";

export default function RrRing({ percent = 0, size = 60 }) {
  const { radius, circumference, offset } = buildRrRingGeometry(percent);

  return (
    <svg viewBox="0 0 60 60" width={size} height={size} className="rotate-[-90deg]" aria-hidden="true">
      <circle cx="30" cy="30" r={radius} fill="none" stroke="var(--color-border)" strokeWidth="4" />
      <circle
        cx="30"
        cy="30"
        r={radius}
        fill="none"
        stroke="var(--rank-color, var(--color-accent))"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}
