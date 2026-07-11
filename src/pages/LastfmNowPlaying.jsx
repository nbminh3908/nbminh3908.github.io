import { useState } from "react";
import { Github } from "lucide-react";

// The deployed build of https://github.com/nbminh3908/lastfm-now-playing
// lives at /lastfm-now-playing/ on this same domain (built by the
// lastfm-widget/ workspace, see its vite.config.js `base` + outDir, and
// the root package.json `build` script that builds it before this app).
// It's an independent Vite + Tailwind app with its own design tokens,
// fonts, and dependencies (colorthief, etc.), so it's embedded here via
// iframe rather than merged into this app's source — that keeps it fully
// isolated from the portfolio, with no shared navbar, footer, or styling.
const APP_PATH = "/lastfm-now-playing/";

export default function LastfmNowPlaying() {
  const [loaded, setLoaded] = useState(false);

  // Note: this renders inside <PageTransition>, which applies a Framer
  // Motion transform to animate the page in/out. A non-"none" transform on
  // an ancestor makes `position: fixed` descendants behave like `absolute`
  // relative to that ancestor instead of the viewport, so this deliberately
  // uses a plain full-viewport block (h-screen w-screen) rather than
  // `fixed inset-0`, and positions the GitHub link with `absolute` inside it.
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {!loaded ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black text-sm text-white/50">
          Loading…
        </div>
      ) : null}

      <iframe
        src={APP_PATH}
        title="Last.fm Now Playing"
        className="h-full w-full border-0"
        onLoad={() => setLoaded(true)}
        allow="clipboard-write"
      />

      <a
        href="https://github.com/nbminh3908/lastfm-now-playing"
        target="_blank"
        rel="noreferrer"
        aria-label="View source on GitHub"
        className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/80 hover:text-white"
      >
        <Github size={20} />
      </a>
    </div>
  );
}
