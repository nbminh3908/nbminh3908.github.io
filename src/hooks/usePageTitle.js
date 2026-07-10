import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const titles = {
  "/": "Home",
  "/devices": "Devices",
  "/socials": "Socials",
  "/projects": "Projects",
  "/valorant-stats": "VALORANT Stats",
};

const SITE_NAME = "Ngo Bao Minh";

export function usePageTitle() {
  const location = useLocation();

  useEffect(() => {
    const pageName = titles[location.pathname];
    document.title = pageName ? `${pageName} | ${SITE_NAME}` : SITE_NAME;
  }, [location.pathname]);
}
