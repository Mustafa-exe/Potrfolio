import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "../components/PageTransition";
import TiltCard from "../components/TiltCard";
import GlowOrbs from "../components/GlowOrbs";
import { getProjects } from "../data/projects";
import "./Projects.css";

export default function Projects() {
  const [projects, setProjects] = useState(() => getProjects());
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const handleSync = () => {
      setProjects(getProjects());
    };
    window.addEventListener("portfolio-data-sync", handleSync);
    return () => window.removeEventListener("portfolio-data-sync", handleSync);
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(
      projects.map((p) => p.tag || p.category).filter(Boolean)
    );
    return ["All", ...cats];
  }, [projects]);

  const filtered = useMemo(() => {
    if (activeFilter === "All") return projects;
    return projects.filter(
      (p) => (p.tag || p.category) === activeFilter
    );
  }, [projects, activeFilter]);

  return (
    <PageTransition>
      <div className="page w" style={{ padding: "4rem 0", position: "relative" }}>
        <GlowOrbs />
        <div className="sh rev on">
          <div>
            <p className="sl">Selected Work</p>
            <h2 className="st">Projects</h2>
          </div>
          <span className="sc" id="cP">
            {String(filtered.length).padStart(2, "0")}
          </span>
        </div>

        {/* Filters */}
        <div
          className="projects-filters"
          style={{
            display: "flex",
            gap: "1.5rem",
            marginBottom: "2.5rem",
            borderBottom: "1px solid var(--border)",
            paddingBottom: "1px",
          }}
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "0.5rem 0.2rem",
                fontSize: "12px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                background: "transparent",
                border: "none",
                borderBottom: "2px solid transparent",
                color: activeFilter === cat ? "var(--ice)" : "var(--muted)",
                borderBottomColor: activeFilter === cat ? "var(--ice)" : "transparent",
                fontFamily: "var(--fb)",
                cursor: "none",
                transition: "all 0.2s",
                marginBottom: "-1px",
              }}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Grid */}
        <div className="pg">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => {
              const name = project.name || project.title;
              const category = project.tag || project.category || "Project";
              const description = project.desc || project.description;
              const stack = project.stack || project.tags || [];
              const live = project.live || project.liveUrl;
              const github = project.github || project.githubUrl;

              return (
                <TiltCard
                  key={project.id}
                  className="gc pc"
                  initial={{ opacity: 0, y: 15, rotateX: -5 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -15, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  layout
                >
                  <span className="p-tag">{category}</span>
                  <h3 className="p-name">{name}</h3>
                  <p className="p-desc">{description}</p>
                  <div className="p-stack">
                    {stack.map((s) => (
                      <span key={s} className="sp">
                        {s}
                      </span>
                    ))}
                  </div>
                  {(live || github) && (
                    <div className="p-links">
                      {live && (
                        <a
                          href={live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-link"
                        >
                          Live
                        </a>
                      )}
                      {github && (
                        <a
                          href={github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-link"
                        >
                          GitHub
                        </a>
                      )}
                    </div>
                  )}
                </TiltCard>
              );
            })}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <p style={{ color: "var(--faint)", fontSize: "14px" }}>
              No projects in this category yet.
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
