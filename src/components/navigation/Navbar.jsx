import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Home, Laptop, Share2, Code2, Swords } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext.jsx";
import MenuIcon from "../ui/MenuIcon.jsx";
import siteIcon from "../../assets/site-icon.png";

const links = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/devices", label: "Devices", icon: Laptop },
  { to: "/socials", label: "Socials", icon: Share2 },
  { to: "/projects", label: "Projects", icon: Code2 },
  { to: "/valorant-stats", label: "VALORANT Stats", icon: Swords },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handleChange = (e) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-2xl border border-base-border bg-base-surface/95 backdrop-blur-xl px-4 py-3 shadow-glass">
        <NavLink to="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setOpen(false)}>
          <img src={siteIcon} alt="" className="h-8 w-8 rounded-lg" />
          <span className="font-display text-sm font-bold tracking-tight text-ink sm:text-base">
            Ngo Bao Minh
          </span>
        </NavLink>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `relative flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive ? "text-ink" : "text-ink-muted hover:text-ink"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-accent-soft"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  ) : null}
                  <link.icon size={14} strokeWidth={2.25} className="relative z-10" />
                  <span className="relative z-10">{link.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-base-border text-ink-muted transition-colors hover:text-ink"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex items-center justify-center"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </motion.span>
            </AnimatePresence>
          </button>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-base-border text-ink-muted transition-colors hover:text-ink md:hidden"
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-4 top-full z-50 mx-auto mt-2 max-w-5xl overflow-hidden rounded-2xl border border-base-border glass-panel sm:inset-x-6 md:hidden"
          >
            <div className="flex flex-col p-2">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                      isActive ? "bg-accent-soft text-ink" : "text-ink-muted hover:text-ink"
                    }`
                  }
                >
                  <link.icon size={16} strokeWidth={2.25} />
                  {link.label}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
