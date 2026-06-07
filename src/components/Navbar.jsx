import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfile } from "../data/profile";
import "./Navbar.css";

export default function Navbar() {
  const [profile, setProfile] = useState(() => getProfile());
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleSync = () => {
      setProfile(getProfile());
    };
    window.addEventListener("portfolio-data-sync", handleSync);
    return () => window.removeEventListener("portfolio-data-sync", handleSync);
  }, []);

  const handleAdminClick = () => {
    if (isAuthenticated) {
      navigate("/admin/dashboard");
    } else {
      navigate("/admin");
    }
  };

  return (
    <nav>
      <Link to="/" className="n-logo">
        {(profile.name || "Mustafa").charAt(0)}
        <em>.</em>
      </Link>
      <ul className="n-links">
        <li>
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>
            About
          </NavLink>
        </li>
        <li>
          <NavLink to="/projects" className={({ isActive }) => (isActive ? "active" : "")}>
            Work
          </NavLink>
        </li>
        <li>
          <NavLink to="/experience" className={({ isActive }) => (isActive ? "active" : "")}>
            Experience
          </NavLink>
        </li>
        <li>
          <NavLink to="/skills" className={({ isActive }) => (isActive ? "active" : "")}>
            Skills
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>
            Contact
          </NavLink>
        </li>
      </ul>
      <div className="n-right">
        <span className="fb-pill">
          <span className={`fb-dot ${isAuthenticated ? "ok" : ""}`} id="fbDot"></span>
          <span id="fbTxt">{isAuthenticated ? "Admin Session" : "Secure Mode"}</span>
        </span>
        <button className="n-admin" onClick={handleAdminClick} id="adminBtn">
          {isAuthenticated ? "Dashboard" : "Admin"}
        </button>
      </div>
    </nav>
  );
}
