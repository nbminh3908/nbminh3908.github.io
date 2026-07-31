import { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Server, Activity, Gauge, Clock, ExternalLink, AlertTriangle, Loader2 } from "lucide-react";
import { useServerStatus } from "../../hooks/useServerStatus.js";
import { uptimeKumaStatusPageUrl } from "../../utils/uptimeKuma.js";

const easing = [0.16, 1, 0.3, 1];

const toneBadgeClass = {
  up: "bg-win/15 text-win",
  down: "bg-loss/15 text-loss",
  pending: "bg-accent-cyan/15 text-accent-cyan",
  unknown: "bg-base-border/60 text-ink-faint",
};

const toneDotClass = {
  up: "bg-win",
  down: "bg-loss",
  pending: "bg-accent-cyan",
  unknown: "bg-ink-faint",
};

/**
 * Native detail view for the Server device card. Opens as an overlay (the
 * project has no existing modal/drawer system to reuse) styled with the
 * same glass-panel, border, radius, and motion conventions used by the
 * mobile nav menu and the SpotlightCard components elsewhere in the app.
 */
export default function ServerStatusDetail({ open, onClose }) {
  const { data, error, loading } = useServerStatus(open);
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;
    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll("a[href], button:not([disabled])");
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: easing }}
        >
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: easing }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-base-border glass-panel shadow-glass"
          >
            <div className="flex items-center justify-between gap-3 border-b border-base-border p-5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Server size={17} strokeWidth={2.25} />
                </span>
                <div>
                  <h2 id={titleId} className="font-display text-base font-semibold text-ink">
                    Server Uptime
                  </h2>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-muted" role="status">
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                        loading ? "bg-ink-faint" : toneDotClass[data?.overallTone || "unknown"]
                      }`}
                    />
                    {loading
                      ? "Checking status..."
                      : error
                      ? "Status unavailable"
                      : data?.overallLabel || "Unknown"}
                  </p>
                </div>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close server status"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-base-border text-ink-muted transition-colors hover:text-ink"
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-5">
              {loading ? (
                <div className="flex items-center gap-2 py-6 text-sm text-ink-muted" role="status">
                  <Loader2 size={15} className="animate-spin" />
                  Loading live status...
                </div>
              ) : error ? (
                <div
                  className="flex items-start gap-2 rounded-xl border border-base-border bg-base-surface/50 p-4 text-sm text-ink-muted"
                  role="status"
                >
                  <AlertTriangle size={15} className="mt-0.5 shrink-0 text-loss" />
                  <span>Live status is temporarily unavailable right now. You can still check the full status page below.</span>
                </div>
              ) : !data?.services?.length ? (
                <div className="rounded-xl border border-base-border bg-base-surface/50 p-4 text-sm text-ink-muted" role="status">
                  No live status data available right now.
                </div>
              ) : (
                <ul className="flex flex-col gap-3">
                  {data.services.map((service) => (
                    <li key={service.id} className="rounded-xl border border-base-border bg-base-surface/50 p-3.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-ink">{service.name}</span>
                        <span
                          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                            toneBadgeClass[service.tone]
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${toneDotClass[service.tone]}`} />
                          {service.statusLabel}
                        </span>
                      </div>

                      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-ink-muted">
                        <span className="flex items-center gap-1.5" title="24h uptime">
                          <Gauge size={12} className="text-ink-faint" />
                          {service.uptimePercent === null ? "-- %" : `${service.uptimePercent}%`}
                        </span>
                        <span className="flex items-center gap-1.5" title="Latest response time">
                          <Activity size={12} className="text-ink-faint" />
                          {service.latestPing === null ? "-- ms" : `${service.latestPing} ms`}
                        </span>
                        <span className="flex items-center gap-1.5" title="Last checked">
                          <Clock size={12} className="text-ink-faint" />
                          {service.lastUpdate || "--"}
                        </span>
                      </div>

                      {service.history.length ? (
                        <div className="mt-3 flex h-9 items-stretch gap-[3px]" aria-hidden="true">
                          {service.history.map((tone, index) => (
                            <span key={index} className={`flex-1 rounded-sm ${toneDotClass[tone]}`} />
                          ))}
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex items-center justify-end border-t border-base-border p-5">
              <a
                href={uptimeKumaStatusPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-base-border px-3.5 py-2 text-xs font-medium text-ink-muted transition-colors hover:text-ink"
              >
                View Full Status Page
                <ExternalLink size={12} />
              </a>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
