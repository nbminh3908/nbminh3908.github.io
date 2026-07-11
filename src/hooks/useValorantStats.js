import { useEffect, useState } from "react";
import { loadValorantStats } from "../utils/valorant.js";

const CACHE_KEY = "valorant-stats-cache-v1";

function readCache() {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.data ?? null;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify({ data, savedAt: Date.now() }));
  } catch {
    // Ignore storage errors (private mode, quota, etc.) — caching is best-effort.
  }
}

export function useValorantStats() {
  const cached = readCache();
  const [data, setData] = useState(cached);
  const [error, setError] = useState(null);
  // Only show the blocking "loading" state when we have nothing cached to show yet.
  const [loading, setLoading] = useState(!cached);
  const [refreshing, setRefreshing] = useState(Boolean(cached));

  useEffect(() => {
    let cancelled = false;

    loadValorantStats()
      .then((result) => {
        if (!cancelled) {
          setData(result);
          writeCache(result);
          setLoading(false);
          setRefreshing(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load live stats.");
          setLoading(false);
          setRefreshing(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, error, loading, refreshing };
}
