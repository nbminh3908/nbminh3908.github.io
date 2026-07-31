// Live data for the Server device card's uptime detail view.
// Talks directly to a public Uptime Kuma status page from the browser —
// no API key or private endpoint is required.

export const uptimeKumaStatusPageUrl = "https://ubuntu.tail9ac9e3.ts.net/status/homeserver";

const STATUS_PAGE_API_URL = "https://ubuntu.tail9ac9e3.ts.net/api/status-page/homeserver";
const HEARTBEAT_API_URL = "https://ubuntu.tail9ac9e3.ts.net/api/status-page/heartbeat/homeserver";

// Uptime Kuma heartbeat status codes.
const HEARTBEAT_DOWN = 0;
const HEARTBEAT_UP = 1;
const HEARTBEAT_PENDING = 2;
const HEARTBEAT_MAINTENANCE = 3;

export function mapHeartbeatStatus(status) {
  switch (status) {
    case HEARTBEAT_UP:
      return { label: "Operational", tone: "up" };
    case HEARTBEAT_DOWN:
      return { label: "Offline", tone: "down" };
    case HEARTBEAT_PENDING:
      return { label: "Degraded", tone: "pending" };
    case HEARTBEAT_MAINTENANCE:
      return { label: "Maintenance", tone: "pending" };
    default:
      return { label: "Unknown", tone: "unknown" };
  }
}

function overallFromServices(services) {
  if (!services.length) return { label: "Unavailable", tone: "unknown" };

  const downCount = services.filter((service) => service.tone === "down").length;
  const hasIssues = services.some(
    (service) => service.tone === "down" || service.tone === "pending" || service.tone === "unknown"
  );

  if (downCount === services.length) return { label: "Offline", tone: "down" };
  if (hasIssues) return { label: "Partially Degraded", tone: "degraded" };
  return { label: "Operational", tone: "up" };
}

// Uptime Kuma returns naive UTC timestamps ("YYYY-MM-DD HH:mm:ss.SSS").
// Formatted to match the dd/mm/yy · HH:MM style already used for match
// dates on the VALORANT Stats page.
function formatHeartbeatTime(rawTime) {
  if (!rawTime) return null;

  const date = new Date(`${String(rawTime).replace(" ", "T")}Z`);
  if (Number.isNaN(date.getTime())) return null;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} \u00b7 ${hours}:${minutes}`;
}

async function fetchJson(url, signal) {
  const response = await fetch(url, { signal, headers: { Accept: "application/json" } });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

/**
 * Loads and normalizes the public Uptime Kuma status page + heartbeat data
 * for the homeserver status page. Services are derived entirely from the
 * API response — nothing is hardcoded — so newly added monitors show up
 * automatically.
 */
export async function loadServerStatus(signal) {
  const [statusPage, heartbeats] = await Promise.all([
    fetchJson(STATUS_PAGE_API_URL, signal),
    fetchJson(HEARTBEAT_API_URL, signal),
  ]);

  const monitors = (statusPage?.publicGroupList || []).flatMap((group) =>
    Array.isArray(group?.monitorList) ? group.monitorList : []
  );
  const heartbeatList = heartbeats?.heartbeatList || {};
  const uptimeList = heartbeats?.uptimeList || {};

  const services = monitors
    .filter((monitor) => monitor && monitor.id != null)
    .map((monitor) => {
      const history = Array.isArray(heartbeatList[String(monitor.id)]) ? heartbeatList[String(monitor.id)] : [];
      const latest = history.length ? history[history.length - 1] : null;
      const { label, tone } = latest ? mapHeartbeatStatus(latest.status) : { label: "Unknown", tone: "unknown" };
      const uptimeRatio = uptimeList[`${monitor.id}_24`];

      return {
        id: monitor.id,
        name: monitor.name || "Unnamed service",
        statusLabel: label,
        tone,
        uptimePercent: typeof uptimeRatio === "number" ? Math.round(uptimeRatio * 1000) / 10 : null,
        latestPing: latest && typeof latest.ping === "number" ? latest.ping : null,
        lastUpdate: latest ? formatHeartbeatTime(latest.time) : null,
        history: history.slice(-30).map((beat) => mapHeartbeatStatus(beat?.status).tone),
      };
    });

  const overall = overallFromServices(services);

  return {
    overallLabel: overall.label,
    overallTone: overall.tone,
    services,
  };
}
