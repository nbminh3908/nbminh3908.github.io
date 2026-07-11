// Ported 1:1 from the original vanilla-JS implementation (script.js).
// URLs, headers, request order, and parsing/fallback logic are preserved
// exactly — only the DOM-writing side has been replaced with pure
// functions that return data for React to render.

export const valorantProfile = {
  name: "Nanashi Mumei",
  tag: "baooo",
  region: "ap",
  platform: "pc",
  apiKey: import.meta.env.VITE_HENRIKDEV_API_KEY || "",
};

export const henrikBase = "https://api.henrikdev.xyz";
export const valorantApiBase = "https://valorant-api.com/v1";

export async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const json = await response.json().catch(() => ({}));

  if (!response.ok || json.status === 0) {
    throw new Error(json.errors?.[0]?.message || json.error || `Request failed: ${response.status}`);
  }

  return json;
}

export function titleCase(text) {
  return String(text || "--")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function getRankName(mmr) {
  return (
    mmr?.data?.current?.tier?.name ||
    mmr?.data?.current_data?.currenttierpatched ||
    mmr?.data?.current_data?.currenttier_patched ||
    mmr?.data?.currenttierpatched ||
    "--"
  );
}

export function getCurrentTierNumber(mmr) {
  return (
    mmr?.data?.current?.tier?.id ||
    mmr?.data?.current_data?.currenttier ||
    mmr?.data?.currenttier ||
    null
  );
}

export function getPeakRankName(mmr) {
  return (
    mmr?.data?.peak?.tier?.name ||
    mmr?.data?.highest_rank?.patched_tier ||
    mmr?.data?.highest_rank?.tier_name ||
    "--"
  );
}

export function getPeakTierNumber(mmr) {
  return mmr?.data?.peak?.tier?.id || mmr?.data?.highest_rank?.tier || null;
}

export function findRankAsset(competitiveTiers, tierNumber, rankName) {
  const latestTierSet = [...(competitiveTiers?.data || [])].reverse().find((set) => Array.isArray(set.tiers));
  const tiers = latestTierSet?.tiers || [];
  const normalizedName = String(rankName || "").toLowerCase();

  return (
    tiers.find((tier) => tier.tier === tierNumber || tier.tierNumber === tierNumber) ||
    tiers.find((tier) => String(tier.tierName || tier.divisionName || "").toLowerCase() === normalizedName)
  );
}

export function normalizeRankColor(color) {
  const clean = String(color || "").replace(/[^a-fA-F0-9]/g, "");
  return clean.length >= 6 ? `#${clean.slice(0, 6)}` : null;
}

export function normalizeAssetName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function findAssetByName(collection, name) {
  const normalizedName = normalizeAssetName(name);
  if (!normalizedName) return null;

  return (collection?.data || []).find((item) => {
    const aliases = [item.displayName, item.uuid, item.mapUrl, item.assetPath, item.narrativeDescription];

    return aliases.some((alias) => {
      if (!alias) return false;
      const normalizedAlias = normalizeAssetName(alias);
      if (!normalizedAlias) return false;

      return (
        normalizedAlias === normalizedName ||
        normalizedAlias.includes(normalizedName) ||
        normalizedName.includes(normalizedAlias)
      );
    });
  });
}

export function displayValue(value, fallback = "Unknown") {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (value && typeof value === "object") {
    return value.name || value.displayName || value.localizedName || value.map_name || value.id || fallback;
  }

  return fallback;
}

export function getPlayerScore(player) {
  return Number(player?.stats?.score ?? player?.score ?? 0);
}

/**
 * HenrikDev's API doesn't expose an explicit MVP flag, so this mirrors what
 * most community trackers do: the highest total combat score in the match
 * is the Match MVP, and the highest score on a given team is that team's
 * Team MVP (the Match MVP is, by definition, also their Team MVP, so callers
 * should treat isMatchMvp as taking priority over isTeamMvp).
 */
export function getMvpBadges(match, player, teamId) {
  const playersRaw = match?.players?.all_players || match?.players || [];
  const allPlayers = Array.isArray(playersRaw) ? playersRaw : [...(playersRaw.red || []), ...(playersRaw.blue || [])];

  if (!allPlayers.length || !player) {
    return { isMatchMvp: false, isTeamMvp: false };
  }

  const playerScore = getPlayerScore(player);
  const maxMatchScore = Math.max(...allPlayers.map(getPlayerScore));

  const teammates = allPlayers.filter(
    (candidate) => String(candidate.team || candidate.team_id || candidate.teamId).toLowerCase() === String(teamId).toLowerCase()
  );
  const maxTeamScore = teammates.length ? Math.max(...teammates.map(getPlayerScore)) : playerScore;

  return {
    isMatchMvp: maxMatchScore > 0 && playerScore === maxMatchScore,
    isTeamMvp: maxTeamScore > 0 && playerScore === maxTeamScore,
  };
}

export function getRoundCount(match, ownScore = 0, enemyScore = 0) {
  return Number(
    match?.metadata?.rounds_played ||
      match?.metadata?.rounds ||
      match?.rounds?.length ||
      match?.rounds_played ||
      ownScore + enemyScore ||
      1
  );
}

export function getCurrentRR(mmr) {
  return (
    mmr?.data?.current?.rr ||
    mmr?.data?.current_data?.ranking_in_tier ||
    mmr?.data?.ranking_in_tier ||
    null
  );
}

export function getMatchPlayer(match) {
  const players = match?.players?.all_players || match?.players || [];
  const flatPlayers = Array.isArray(players) ? players : [...(players.red || []), ...(players.blue || [])];

  return flatPlayers.find((player) => {
    const name = player.name || player.gameName;
    const tag = player.tag || player.tagLine;
    return (
      String(name).toLowerCase() === valorantProfile.name.toLowerCase() &&
      String(tag).toLowerCase() === valorantProfile.tag.toLowerCase()
    );
  });
}

export function getTeamScore(match, teamId) {
  const teams = match?.teams;
  if (Array.isArray(teams)) {
    return (
      teams.find((team) => String(team.team_id || team.teamId).toLowerCase() === String(teamId).toLowerCase())
        ?.rounds?.won ?? 0
    );
  }

  const team = teams?.[String(teamId || "").toLowerCase()] || teams?.[teamId];
  return team?.rounds_won ?? team?.rounds?.won ?? 0;
}

export function getMatchDate(match) {
  const metadata = match?.metadata || {};
  const rawDate = metadata.started_at || metadata.game_start_patched || metadata.game_start || match?.game_start;

  let date = null;
  if (typeof rawDate === "number") {
    // HenrikDev returns game_start as a unix timestamp in seconds; JS Date needs milliseconds.
    date = new Date(rawDate < 10_000_000_000 ? rawDate * 1000 : rawDate);
  } else if (rawDate) {
    date = new Date(rawDate);
  }

  if (!date || Number.isNaN(date.getTime())) {
    return "recently";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} \u00b7 ${hours}:${minutes}`;
}

export function findMmrSnapshot(match, mmrHistory) {
  const historyItems = Array.isArray(mmrHistory?.data) ? mmrHistory.data : [];
  const matchId = match?.metadata?.matchid || match?.metadata?.match_id || match?.match_id || match?.id;
  const history = historyItems.find((item) => item.match_id === matchId || item.matchid === matchId);
  const change = history?.mmr_change_to_last_game ?? history?.elo_change_to_last_game ?? history?.rr_change;
  const total = history?.ranking_in_tier ?? history?.rr;

  return {
    change: Number.isFinite(Number(change)) ? Number(change) : null,
    total: Number.isFinite(Number(total)) ? Number(total) : null,
  };
}

/**
 * Builds the normalized list of rows the UI renders for the match list.
 * Mirrors renderMatches() from the original script.js, minus the HTML
 * string building (React owns markup now).
 */
export function buildMatchRows(matches, assets = {}) {
  const matchItems = Array.isArray(matches?.data)
    ? matches.data
    : matches?.data?.matches || matches?.matches || (Array.isArray(matches) ? matches : []);

  return matchItems.slice(0, 5).map((match, index) => {
    const metadata = match.metadata || {};
    const player = getMatchPlayer(match);
    const teamId = player?.team || player?.team_id || player?.teamId;
    const enemyTeam = String(teamId).toLowerCase() === "red" ? "Blue" : "Red";
    const ownScore = getTeamScore(match, teamId);
    const enemyScore = getTeamScore(match, enemyTeam);
    const won = ownScore > enemyScore;
    const mode = displayValue(metadata.mode || metadata.queue || match.mode, "Match");
    const isCompetitive = mode.toLowerCase() === "competitive";
    const map = displayValue(metadata.map || match.map, "Unknown map");
    const agent = displayValue(player?.character || player?.agent?.name || player?.agent, "Agent unknown");
    const mapAsset = findAssetByName(assets.maps, map);
    const agentAsset = findAssetByName(assets.agents, agent);
    const rankIcon = assets.currentRankAsset?.largeIcon || assets.currentRankAsset?.smallIcon || "";
    const mapImage = mapAsset?.splash || "";
    const agentImage = agentAsset?.displayIcon || agentAsset?.bustPortrait || agentAsset?.fullPortrait || "";
    const { change: rrChange, total: rrTotal } = findMmrSnapshot(match, assets.mmrHistory);
    const { isMatchMvp, isTeamMvp } = getMvpBadges(match, player, teamId);
    const kills = player?.stats?.kills ?? player?.kills ?? "--";
    const deaths = player?.stats?.deaths ?? player?.deaths ?? "--";
    const assists = player?.stats?.assists ?? player?.assists ?? "--";
    const roundCount = Math.max(getRoundCount(match, Number(ownScore), Number(enemyScore)), 1);
    const acs = player?.stats?.score
      ? Math.round(player.stats.score / roundCount)
      : player?.stats?.average_combat_score ?? player?.stats?.acs ?? "--";

    return {
      id: metadata.matchid || metadata.match_id || match.match_id || match.id || index,
      mode: titleCase(mode),
      isCompetitive,
      date: getMatchDate(match),
      map,
      mapImage,
      agent,
      agentImage,
      rankIcon,
      won,
      ownScore,
      enemyScore,
      rrChange,
      rrTotal,
      isMatchMvp,
      isTeamMvp,
      kills,
      deaths,
      assists,
      acs,
    };
  });
}

export function buildRrRingGeometry(percent) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percent));
  const offset = circumference * (1 - clamped / 100);
  return { radius, circumference, offset };
}

/**
 * Performs the exact same request sequence as loadValorantStats() in the
 * original script.js: account + mmr + matches + mmr-history in parallel,
 * then competitive tiers / agents / maps, then (conditionally) the player
 * card. Returns a plain data object instead of writing to the DOM.
 */
export async function loadValorantStats() {
  if (!valorantProfile.apiKey) {
    throw new Error(
      "No HenrikDev API key found. Add VITE_HENRIKDEV_API_KEY to your .env file."
    );
  }

  const encodedName = encodeURIComponent(valorantProfile.name);
  const encodedTag = encodeURIComponent(valorantProfile.tag);
  const authHeaders = { Authorization: valorantProfile.apiKey };
  const accountUrl = `${henrikBase}/valorant/v1/account/${encodedName}/${encodedTag}`;
  const mmrUrl = `${henrikBase}/valorant/v3/mmr/${valorantProfile.region}/${valorantProfile.platform}/${encodedName}/${encodedTag}`;
  const matchesUrl = `${henrikBase}/valorant/v4/matches/${valorantProfile.region}/${valorantProfile.platform}/${encodedName}/${encodedTag}?size=5`;
  const mmrHistoryUrl = `${henrikBase}/valorant/v1/mmr-history/${valorantProfile.region}/${encodedName}/${encodedTag}`;

  const [account, mmr, matches, mmrHistory, competitiveTiers, agents, maps] = await Promise.all([
    fetchJson(accountUrl, { headers: authHeaders }),
    fetchJson(mmrUrl, { headers: authHeaders }),
    fetchJson(matchesUrl, { headers: authHeaders }),
    fetchJson(mmrHistoryUrl, { headers: authHeaders }).catch(() => ({ data: [] })),
    fetchJson(`${valorantApiBase}/competitivetiers`),
    fetchJson(`${valorantApiBase}/agents?isPlayableCharacter=true`),
    fetchJson(`${valorantApiBase}/maps`),
  ]);

  const playerCardId = account?.data?.card?.id;
  let playerCard = null;

  if (playerCardId) {
    playerCard = await fetchJson(`${valorantApiBase}/playercards/${playerCardId}`).catch(() => null);
  }

  const currentRank = getRankName(mmr);
  const peakRank = getPeakRankName(mmr);
  const currentRankAsset = findRankAsset(competitiveTiers, getCurrentTierNumber(mmr), currentRank);
  const peakRankAsset = findRankAsset(competitiveTiers, getPeakTierNumber(mmr), peakRank);
  const rankColor = normalizeRankColor(currentRankAsset?.color);
  const currentRR = getCurrentRR(mmr);

  const cardSmall = playerCard?.data?.smallArt || account?.data?.card?.small || playerCard?.data?.displayIcon;
  const cardWide = playerCard?.data?.wideArt || account?.data?.card?.wide || playerCard?.data?.largeArt;
  const currentRankIcon = currentRankAsset?.largeIcon || currentRankAsset?.smallIcon;
  const peakRankIcon = peakRankAsset?.rankTriangleUpIcon || peakRankAsset?.largeIcon || peakRankAsset?.smallIcon;

  const rows = buildMatchRows(matches, { agents, maps, currentRankAsset, mmrHistory });

  return {
    level: account?.data?.account_level ?? "--",
    currentRank,
    peakRank,
    currentRR,
    rankColor,
    cardSmall,
    cardWide,
    currentRankIcon,
    peakRankIcon,
    matches: rows,
    status: "Live data loaded.",
  };
}
