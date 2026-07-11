import { Gamepad2, Target, BarChart3, Swords, Crown, Star } from "lucide-react";

export default function MatchRow({ match, index }) {
  const {
    mode,
    isCompetitive,
    date,
    map,
    mapImage,
    agent,
    agentImage,
    won,
    ownScore,
    enemyScore,
    rrChange,
    isMatchMvp,
    isTeamMvp,
    kills,
    deaths,
    assists,
    acs,
  } = match;

  return (
    <article
      className="relative overflow-hidden rounded-2xl border border-base-border glass-panel"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {mapImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.14]"
          style={{ backgroundImage: `url('${mapImage}')` }}
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-r from-base-surface via-base-surface/85 to-transparent" />

      <div className="relative z-10 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {agentImage ? (
            <img src={agentImage} alt="" className="h-14 w-14 rounded-xl border border-base-border object-cover" />
          ) : (
            <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <Gamepad2 size={20} />
            </span>
          )}
          <div>
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-ink-faint">
              <Gamepad2 size={12} />
              {mode}
              <span aria-hidden="true">&middot;</span>
              <span>{date}</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <p className="font-display text-base font-semibold text-ink">{agent}</p>
              {isMatchMvp ? (
                <span
                  className="inline-flex items-center gap-1 rounded-full bg-[#FFD25E]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#FFD25E]"
                  title="Highest combat score in the match"
                >
                  <Crown size={11} />
                  Match MVP
                </span>
              ) : isTeamMvp ? (
                <span
                  className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                  title="Highest combat score on the team"
                >
                  <Star size={11} />
                  Team MVP
                </span>
              ) : null}
            </div>
            <p className="text-sm text-ink-muted">{map}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-6 sm:justify-end">
          <div className="flex items-center gap-5 font-mono text-sm text-ink-muted">
            <span className="flex items-center gap-1.5" title="Kills / Deaths / Assists">
              <Target size={14} className="text-ink-faint" />
              {kills}/{deaths}/{assists}
            </span>
            <span className="flex items-center gap-1.5" title="Average combat score">
              <BarChart3 size={14} className="text-ink-faint" />
              {acs}
            </span>
            <span className="flex items-center gap-1.5" title="Round score">
              <Swords size={14} className="text-ink-faint" />
              {ownScore}-{enemyScore}
            </span>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 font-mono text-sm font-bold ${
                isCompetitive
                  ? rrChange !== null && rrChange > 0
                    ? "bg-win/15 text-win"
                    : "bg-loss/15 text-loss"
                  : "invisible"
              }`}
              title={isCompetitive ? "RR change" : undefined}
              aria-hidden={!isCompetitive}
            >
              {isCompetitive
                ? rrChange === null
                  ? "RR --"
                  : `${rrChange > 0 ? "+" : ""}${rrChange} RR`
                : "RR --"}
            </span>
            <span
              className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                won ? "bg-win/15 text-win" : "bg-loss/15 text-loss"
              }`}
            >
              {won ? "Victory" : "Defeat"}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
