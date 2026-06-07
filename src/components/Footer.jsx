import { useState, useEffect } from "react";
import { getProfile } from "../data/profile";
import "./Footer.css";

export default function Footer() {
  const [profile, setProfile] = useState(() => getProfile());
  const year = new Date().getFullYear();

  useEffect(() => {
    const handleSync = () => {
      setProfile(getProfile());
    };
    window.addEventListener("portfolio-data-sync", handleSync);
    return () => window.removeEventListener("portfolio-data-sync", handleSync);
  }, []);

  return (
    <footer>
      <span id="fName">{profile.name || "Portfolio"} — Portfolio</span>
      <span id="fYear">{year}</span>
    </footer>
  );
}
