import { motion } from "framer-motion";

export function Eyebrow({ children, icon: Icon }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-base-border bg-base-surface/60 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">
      {Icon ? <Icon size={13} strokeWidth={2.25} className="text-accent" /> : null}
      {children}
    </span>
  );
}

export default function SectionHeader({ eyebrow, icon, title, description, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`mb-8 flex flex-col gap-3 ${className}`}
    >
      {eyebrow ? <Eyebrow icon={icon}>{eyebrow}</Eyebrow> : null}
      {title ? (
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl text-balance">{title}</h2>
      ) : null}
      {description ? <p className="max-w-2xl text-ink-muted">{description}</p> : null}
    </motion.div>
  );
}
