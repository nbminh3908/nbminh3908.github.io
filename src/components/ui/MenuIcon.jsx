import "./MenuIcon.css";

export default function MenuIcon({ open }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={16}
      height={16}
      fill="none"
      aria-hidden="true"
      className={`menu-toggle${open ? " is-open" : ""}`}
    >
      <path stroke="currentColor" strokeWidth={2} strokeLinecap="round" d="M4 7h16" />
      <path stroke="currentColor" strokeWidth={2} strokeLinecap="round" d="M4 12h16" />
      <path stroke="currentColor" strokeWidth={2} strokeLinecap="round" d="M4 17h16" />
    </svg>
  );
}