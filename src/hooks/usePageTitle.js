import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const titles = {
  "/": "Home",
  "/devices": "Devices",
  "/socials": "Socials",
  "/projects": "Projects",
  "/valorant-stats": "VALORANT Stats",
};

// Routes that are standalone apps embedded in the portfolio (not part of
// its site structure) get their own title, with no "| Ngo Bao Minh" suffix.
const standaloneTitles = {
  "/lastfm-now-playing": "Last.fm · Now Playing",
};

const SITE_NAME = "Ngo Bao Minh";

export function usePageTitle() {
  const location = useLocation();

  useEffect(() => {
    if (standaloneTitles[location.pathname]) {
      document.title = standaloneTitles[location.pathname];
      return;
    }
    const pageName = titles[location.pathname];
    document.title = pageName ? `${pageName} | ${SITE_NAME}` : SITE_NAME;
  }, [location.pathname]);
}
