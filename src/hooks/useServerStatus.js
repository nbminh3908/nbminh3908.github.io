import { useEffect, useState } from "react";
import { loadServerStatus } from "../utils/uptimeKuma.js";

/**
 * Fetches live Uptime Kuma status only while `active` is true (i.e. while
 * the server detail view is open), so the Devices page never makes network
 * requests the user hasn't asked for. Mirrors the loading/error shape of
 * useValorantStats.
 */
export function useServerStatus(active) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!active) return undefined;

    const controller = new AbortController();
    let cancelled = false;

    setLoading(true);
    setError(null);

    loadServerStatus(controller.signal)
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (cancelled || err?.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Could not load live server status.");
        setLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [active]);

  return { data, error, loading };
}
