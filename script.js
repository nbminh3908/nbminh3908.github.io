const root = document.documentElement;
const toggle = document.querySelector("[data-theme-toggle]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const topbar = document.querySelector(".topbar");
const storedTheme = localStorage.getItem("theme");
const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

function applyTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("theme", theme);
  if (toggle) {
    toggle.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    toggle.setAttribute("title", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }
}

applyTheme(storedTheme || (preferredDark ? "dark" : "light"));

if (toggle) {
  toggle.addEventListener("click", () => {
    applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });
}

const currentRoute = document.body.dataset.route;
document.querySelectorAll(".nav-link").forEach((link) => {
  if (link.dataset.route === currentRoute) {
    link.setAttribute("aria-current", "page");
  }

  link.addEventListener("click", () => {
    topbar?.classList.remove("nav-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open menu");
  });
});

if (menuToggle && topbar) {
  menuToggle.addEventListener("click", () => {
    const isOpen = topbar.classList.toggle("nav-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });
}

const valorantProfile = {
  name: "Nanashi Mumei",
  tag: "baooo",
  region: "ap",
  platform: "pc",
  apiKey: "HDEV-23b0cd8a-bd7e-4010-9a4e-b2763e5179e9",
};

const henrikBase = "https://api.henrikdev.xyz";
const valorantApiBase = "https://valorant-api.com/v1";

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const json = await response.json().catch(() => ({}));

  if (!response.ok || json.status === 0) {
    throw new Error(json.errors?.[0]?.message || json.error || `Request failed: ${response.status}`);
  }

  return json;
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = value ?? "--";
  }
}

function showImage(selector, src, alt) {
  const image = document.querySelector(selector);
  if (!image || !src) return;

  image.src = src;
  image.alt = alt;
  image.hidden = false;
}

function titleCase(text) {
  return String(text || "--")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getRankName(mmr) {
  return (
    mmr?.data?.current?.tier?.name ||
    mmr?.data?.current_data?.currenttierpatched ||
    mmr?.data?.current_data?.currenttier_patched ||
    mmr?.data?.currenttierpatched ||
    "--"
  );
}

function getCurrentTierNumber(mmr) {
  return (
    mmr?.data?.current?.tier?.id ||
    mmr?.data?.current_data?.currenttier ||
    mmr?.data?.currenttier ||
    null
  );
}

function getPeakRankName(mmr) {
  return (
    mmr?.data?.peak?.tier?.name ||
    mmr?.data?.highest_rank?.patched_tier ||
    mmr?.data?.highest_rank?.tier_name ||
    "--"
  );
}

function getPeakTierNumber(mmr) {
  return (
    mmr?.data?.peak?.tier?.id ||
    mmr?.data?.highest_rank?.tier ||
    null
  );
}

function findRankAsset(competitiveTiers, tierNumber, rankName) {
  const latestTierSet = [...(competitiveTiers?.data || [])].reverse().find((set) => Array.isArray(set.tiers));
  const tiers = latestTierSet?.tiers || [];
  const normalizedName = String(rankName || "").toLowerCase();

  return tiers.find((tier) => tier.tier === tierNumber || tier.tierNumber === tierNumber) ||
    tiers.find((tier) => String(tier.tierName || tier.divisionName || "").toLowerCase() === normalizedName);
}

function normalizeRankColor(color) {
  const clean = String(color || "").replace(/[^a-fA-F0-9]/g, "");

  return clean.length >= 6 ? `#${clean.slice(0, 6)}` : null;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeCssUrl(value) {
  return String(value || "").replace(/["\\]/g, "\\$&");
}

function normalizeAssetName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function findAssetByName(collection, name) {
  const normalizedName = normalizeAssetName(name);
  if (!normalizedName) return null;

  return (collection?.data || []).find((item) => {
    const aliases = [
      item.displayName,
      item.uuid,
      item.mapUrl,
      item.assetPath,
      item.narrativeDescription,
    ];

    return aliases.some((alias) => {
      if (!alias) return false;
      const normalizedAlias = normalizeAssetName(alias);
      if (!normalizedAlias) return false;

      return normalizedAlias === normalizedName ||
        normalizedAlias.includes(normalizedName) ||
        normalizedName.includes(normalizedAlias);
    });
  });
}

function displayValue(value, fallback = "Unknown") {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (value && typeof value === "object") {
    return value.name || value.displayName || value.localizedName || value.map_name || value.id || fallback;
  }

  return fallback;
}

function getRoundCount(match, ownScore = 0, enemyScore = 0) {
  return Number(
    match?.metadata?.rounds_played ||
    match?.metadata?.rounds ||
    match?.rounds?.length ||
    match?.rounds_played ||
    ownScore + enemyScore ||
    1
  );
}

function getCurrentRR(mmr) {
  return (
    mmr?.data?.current?.rr ||
    mmr?.data?.current_data?.ranking_in_tier ||
    mmr?.data?.ranking_in_tier ||
    null
  );
}

function getMatchPlayer(match) {
  const players = match?.players?.all_players || match?.players || [];
  const flatPlayers = Array.isArray(players)
    ? players
    : [...(players.red || []), ...(players.blue || [])];

  return flatPlayers.find((player) => {
    const name = player.name || player.gameName;
    const tag = player.tag || player.tagLine;
    return String(name).toLowerCase() === valorantProfile.name.toLowerCase() &&
      String(tag).toLowerCase() === valorantProfile.tag.toLowerCase();
  });
}

function getTeamScore(match, teamId) {
  const teams = match?.teams;
  if (Array.isArray(teams)) {
    return teams.find((team) => String(team.team_id || team.teamId).toLowerCase() === String(teamId).toLowerCase())?.rounds?.won ?? 0;
  }

  const team = teams?.[String(teamId || "").toLowerCase()] || teams?.[teamId];
  return team?.rounds_won ?? team?.rounds?.won ?? 0;
}

function getMatchDate(match) {
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

  return `${day}/${month}/${year} · ${hours}:${minutes}`;
}

function findMmrSnapshot(match, mmrHistory) {
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

function buildRrRing(percent) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percent));
  const offset = circumference * (1 - clamped / 100);

  return `
    <svg class="match-rr-ring" viewBox="0 0 60 60" aria-hidden="true">
      <circle class="match-rr-ring-track" cx="30" cy="30" r="${radius}"></circle>
      <circle class="match-rr-ring-fill" cx="30" cy="30" r="${radius}" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"></circle>
    </svg>
  `;
}

function renderMatches(matches, assets = {}) {
  const list = document.querySelector("[data-match-list]");
  if (!list) return;

  const matchItems = Array.isArray(matches?.data)
    ? matches.data
    : matches?.data?.matches || matches?.matches || (Array.isArray(matches) ? matches : []);

  const rows = matchItems.slice(0, 5).map((match) => {
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
    const kills = player?.stats?.kills ?? player?.kills ?? "--";
    const deaths = player?.stats?.deaths ?? player?.deaths ?? "--";
    const assists = player?.stats?.assists ?? player?.assists ?? "--";
    const roundCount = Math.max(getRoundCount(match, Number(ownScore), Number(enemyScore)), 1);
    const acs = player?.stats?.score
      ? Math.round(player.stats.score / roundCount)
      : player?.stats?.average_combat_score ?? player?.stats?.acs ?? "--";

    return `
      <article class="match-row" style="--match-bg: url('${escapeCssUrl(mapImage)}')">
        <div class="match-top">
          <div>
            <span class="match-mode">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v12H4z"></path><path d="M9 21h6"></path><path d="M12 17v4"></path></svg>
              ${escapeHtml(titleCase(mode))}
            </span>
            <span class="match-meta">${escapeHtml(getMatchDate(match))}</span>
          </div>
          ${isCompetitive ? `
          <div class="match-rank">
            <div class="match-rank-text">
              <span class="match-rr ${rrChange !== null && rrChange > 0 ? "match-rr-positive" : "match-rr-negative"}">${rrChange === null ? "RR --" : `${rrChange > 0 ? "+" : ""}${rrChange}`}</span>
              ${rrTotal === null ? "" : `<span class="match-rr-total">${rrTotal}</span>`}
            </div>
            <div class="match-rank-ring">
              ${buildRrRing(rrTotal ?? 0)}
              ${rankIcon ? `<img src="${escapeHtml(rankIcon)}" alt="">` : ""}
            </div>
          </div>
          ` : ""}
        </div>

        <div class="match-art">
          ${agentImage ? `<img class="match-agent-img" src="${escapeHtml(agentImage)}" alt="">` : ""}
          <div class="match-agent">
            <strong>${escapeHtml(agent)}</strong>
            <span class="match-map">${escapeHtml(map)}</span>
          </div>
          <span class="match-result ${won ? "win" : "loss"}">${won ? "VICTORY" : "DEFEAT"}</span>
        </div>

        <div class="match-bottom">
          <span class="match-stat">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"></circle><path d="M12 3v4"></path><path d="M12 17v4"></path><path d="M3 12h4"></path><path d="M17 12h4"></path></svg>
            ${escapeHtml(kills)} / ${escapeHtml(deaths)} / ${escapeHtml(assists)}
          </span>
          <span class="match-stat">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20V10"></path><path d="M12 20V4"></path><path d="M19 20v-7"></path></svg>
            ${escapeHtml(acs)}
          </span>
          <span class="match-stat match-score">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5v14"></path><path d="M5 5h11l-2 4 2 4H5"></path></svg>
            ${escapeHtml(ownScore)} - ${escapeHtml(enemyScore)}
          </span>
        </div>
      </article>
    `;
  });

  list.innerHTML = rows.length ? rows.join("") : `
    <article class="match-row match-row-loading">
      <span>No recent matches found.</span>
    </article>
  `;
}

async function loadValorantStats() {
  if (currentRoute !== "valorant-stats") return;

  const encodedName = encodeURIComponent(valorantProfile.name);
  const encodedTag = encodeURIComponent(valorantProfile.tag);
  const authHeaders = { Authorization: valorantProfile.apiKey };
  const accountUrl = `${henrikBase}/valorant/v1/account/${encodedName}/${encodedTag}`;
  const mmrUrl = `${henrikBase}/valorant/v3/mmr/${valorantProfile.region}/${valorantProfile.platform}/${encodedName}/${encodedTag}`;
  const matchesUrl = `${henrikBase}/valorant/v4/matches/${valorantProfile.region}/${valorantProfile.platform}/${encodedName}/${encodedTag}?size=5`;
  const mmrHistoryUrl = `${henrikBase}/valorant/v1/mmr-history/${valorantProfile.region}/${encodedName}/${encodedTag}`;

  try {
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
    if (rankColor) {
      root.style.setProperty("--rank-color", rankColor);
    }

    showImage(
      "[data-valorant-card]",
      playerCard?.data?.smallArt || account?.data?.card?.small || playerCard?.data?.displayIcon,
      `${valorantProfile.name} player card`
    );

    const profilePanel = document.querySelector(".valorant-profile");
    const cardBackground = playerCard?.data?.wideArt || account?.data?.card?.wide || playerCard?.data?.largeArt;
    if (profilePanel && cardBackground) {
      profilePanel.style.setProperty("--valorant-card-bg", `url("${cardBackground}")`);
    }

    showImage("[data-current-rank-icon]", currentRankAsset?.largeIcon || currentRankAsset?.smallIcon, `${currentRank} rank icon`);
    showImage("[data-peak-rank-icon]", peakRankAsset?.rankTriangleUpIcon || peakRankAsset?.largeIcon || peakRankAsset?.smallIcon, `${peakRank} rank icon`);

    const currentRR = getCurrentRR(mmr);
    const rrFill = document.querySelector("[data-valorant-rr-fill]");
    if (rrFill) {
      rrFill.style.width = `${Math.max(0, Math.min(100, currentRR ?? 0))}%`;
    }

    setText("[data-valorant-level]", account?.data?.account_level);
    setText("[data-valorant-current-rank]", currentRank);
    setText("[data-valorant-peak-rank]", peakRank);
    setText("[data-valorant-rr]", currentRR === null ? "-- RR" : `${currentRR} RR`);
    setText("[data-valorant-status]", "Live data loaded.");
    renderMatches(matches, { agents, maps, currentRankAsset, mmrHistory });
  } catch (error) {
    setText("[data-valorant-status]", `Could not load live stats: ${error.message}`);
    renderMatches([]);
  }
}

loadValorantStats();
