import { motion } from "framer-motion";

const transition = { duration: 0.3, ease: [0.16, 1, 0.3, 1] };

export default function MenuIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" aria-hidden="true">
      <motion.path
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        d="M4 7h16"
        animate={open ? { y: 5, rotate: 45 } : { y: 0, rotate: 0 }}
        transition={transition}
        style={{ transformOrigin: "12px 7px" }}
      />
      <motion.path
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        d="M4 12h16"
        animate={open ? { opacity: 0 } : { opacity: 1 }}
        transition={transition}
      />
      <motion.path
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        d="M4 17h16"
        animate={open ? { y: -5, rotate: -45 } : { y: 0, rotate: 0 }}
        transition={transition}
        style={{ transformOrigin: "12px 17px" }}
      />
    </svg>
  );
}
