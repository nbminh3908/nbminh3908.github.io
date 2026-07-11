import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, TrendingUp, Trophy, Loader2, AlertTriangle, User } from "lucide-react";
import Layout from "../components/layout/Layout.jsx";
import { Eyebrow } from "../components/ui/SectionHeader.jsx";
import { Reveal } from "../components/animations/Reveal.jsx";
import SpotlightCard from "../components/ui/SpotlightCard.jsx";
import MatchRow from "../components/ui/MatchRow.jsx";
import { useValorantStats } from "../hooks/useValorantStats.js";

export default function ValorantStats() {
  const { data, error, loading, refreshing } = useValorantStats();

  useEffect(() => {
    if (data?.rankColor) {
      document.documentElement.style.setProperty("--rank-color", data.rankColor);
    }
    return () => {
      document.documentElement.style.removeProperty("--rank-color");
    };
  }, [data?.rankColor]);

  return (
    <Layout apiCredit>
      <section aria-labelledby="valorant-title">
        <Reveal>
          <h1 id="valorant-title" className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            VALORANT Stats
          </h1>
        </Reveal>
      </section>

      <Reveal delay={0.1} className="mt-8" aria-label="VALORANT profile">
        <SpotlightCard className="overflow-hidden">
          {data?.cardWide ? (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-[0.16]"
              style={{ backgroundImage: `url('${data.cardWide}')` }}
              aria-hidden="true"
            />
          ) : null}

          <div className="relative z-10 p-6 sm:p-8">
            <Eyebrow icon={User}>Profile</Eyebrow>

            <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {data?.cardSmall ? (
                  <img
                    src={data.cardSmall}
                    alt="Player card"
                    className="h-16 w-16 rounded-2xl border border-base-border object-cover"
                  />
                ) : (
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                    <Swords size={22} />
                  </span>
                )}
                <div>
                  <h2 className="font-display text-xl font-semibold text-ink">
                    Nanashi Mumei<span className="ml-1 text-base font-normal text-ink-faint">#baooo</span>
                  </h2>
                  <p className="mt-0.5 text-sm text-ink-muted">
                    Level <strong className="font-mono text-ink">{data?.level ?? "--"}</strong>
                  </p>
                </div>
              </div>

              <figure className="flex items-center gap-3 rounded-2xl border border-base-border bg-base-surface/50 px-4 py-3">
                {data?.peakRankIcon ? (
                  <img src={data.peakRankIcon} alt="" className="h-9 w-9" />
                ) : (
                  <Trophy size={20} className="text-ink-faint" />
                )}
                <div>
                  <figcaption className="text-[11px] uppercase tracking-wide text-ink-faint">Lifetime Peak</figcaption>
                  <strong className="block font-display text-sm text-ink">
                    {data?.peakRank ?? "--"}
                  </strong>
                </div>
              </figure>
            </div>

            <div className="mt-6 flex items-center gap-4 rounded-2xl border border-base-border bg-base-surface/50 p-4">
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent-soft">
                {data?.currentRankIcon ? (
                  <img src={data.currentRankIcon} alt="" className="h-9 w-9" />
                ) : (
                  <TrendingUp size={18} className="text-ink-faint" />
                )}
              </div>
              <div className="flex-1">
                <strong className="block font-display text-base text-ink">
                  {data?.currentRank ?? "--"}
                </strong>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-xs font-medium text-ink-muted">
                    {data?.currentRR == null ? "-- RR" : `${data.currentRR} RR`}
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-base-border">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: "var(--rank-color, var(--color-accent))" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(0, Math.min(100, data?.currentRR ?? 0))}%` }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-4 flex items-center gap-2 text-xs text-ink-faint" role="status">
              {loading || refreshing ? <Loader2 size={13} className="animate-spin" /> : null}
              {error ? <AlertTriangle size={13} className="text-loss" /> : null}
              {loading
                ? "Loading live stats..."
                : error
                ? `Could not load live stats: ${error}`
                : refreshing
                ? "Updating with live stats..."
                : data?.status}
            </p>
          </div>
        </SpotlightCard>
      </Reveal>

      <section className="mt-10" aria-label="Match history">
        <Reveal>
          <Eyebrow icon={TrendingUp}>Matches</Eyebrow>
        </Reveal>

        <div className="mt-5 flex flex-col gap-3">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 rounded-2xl border border-base-border glass-panel p-6 text-sm text-ink-muted"
              >
                <Loader2 size={15} className="animate-spin" />
                Loading matches...
              </motion.div>
            ) : data?.matches?.length ? (
              <motion.div key="matches" className="flex flex-col gap-3">
                {data.matches.map((match, index) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <MatchRow match={match} index={index} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-base-border glass-panel p-6 text-sm text-ink-muted"
              >
                {error ? `Couldn't load matches: ${error}` : "No recent matches found."}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </Layout>
  );
}
