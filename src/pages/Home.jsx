import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import TiltCard from "../components/TiltCard";
import GlowOrbs from "../components/GlowOrbs";
import { getProfile } from "../data/profile";
import { getProjects } from "../data/projects";
import { getExperience } from "../data/experience";
import { getSkills } from "../data/skills";
import "./Home.css";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};
export default function Home() {
  const [profile, setProfile] = useState(() => getProfile());
  const [projects, setProjects] = useState(() => getProjects());
  const [experience, setExperience] = useState(() => getExperience());
  const [skillsCategories, setSkillsCategories] = useState(() => getSkills());

  useEffect(() => {
    const handleSync = () => {
      setProfile(getProfile());
      setProjects(getProjects());
      setExperience(getExperience());
      setSkillsCategories(getSkills());
    };
    window.addEventListener("portfolio-data-sync", handleSync);
    return () => window.removeEventListener("portfolio-data-sync", handleSync);
  }, []);

  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
  const topExperience = experience.slice(0, 2);
  const topSkills = skillsCategories
    .flatMap((cat) => cat.items.map((s) => ({ ...s, category: cat.category })))
    .sort((a, b) => b.level - a.level)
    .slice(0, 8);

  return (
    <PageTransition>
      {/* ══════ HERO ══════ */}
      <div id="hero" style={{ position: "relative" }}>
        <GlowOrbs />
        <motion.div
          className="h-inner w"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.p className="h-eye" variants={fadeUp}>
            {profile.title || "Full Stack Developer"}
          </motion.p>
          <motion.h1 className="h-name" variants={fadeUp}>
            {profile.name || "Mustafa"}
            <br />
            <span className="dim">Builds Things.</span>
          </motion.h1>
          <motion.p className="h-bio" variants={fadeUp}>
            {profile.bio || "Full-stack developer crafting intelligent systems."}
          </motion.p>
          <motion.div className="h-cta" variants={fadeUp}>
            <Link to="/projects" className="btn-i">View Work</Link>
            <Link to="/contact" className="btn-o">Get in Touch</Link>
            <a href="/cv/resume.pdf" download className="btn-o">Download CV</a>
          </motion.div>
          <motion.div className="h-kpis" variants={stagger}>
            {[
              { val: projects.length, label: "Projects" },
              { val: experience.length, label: "Experiences" },
              { val: skillsCategories.flatMap((c) => c.items).length + "+", label: "Skills" },
              { val: "100%", label: "Commitment" },
            ].map((kpi, i) => (
              <motion.div key={i} variants={scaleIn} whileHover={{ scale: 1.08, y: -3 }}>
                <div className="kn">{kpi.val}</div>
                <div className="kl">{kpi.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        <motion.div
          className="scroll-h"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <span>Scroll</span>
          <div className="scroll-l" />
        </motion.div>
      </div>

      {/* ══════ FEATURED PROJECTS ══════ */}
      {featuredProjects.length > 0 && (
        <section className="sec w" style={{ position: "relative" }}>
          <motion.div
            className="sh"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <p className="sl">Selected Work</p>
              <h2 className="st">Featured Projects</h2>
            </div>
            <Link to="/projects" className="btn-o" style={{ padding: ".5rem 1.2rem", fontSize: "11px" }}>
              View All
            </Link>
          </motion.div>

          <div className="pg">
            {featuredProjects.map((project, i) => {
              const name = project.title || project.name;
              const category = project.category || project.tag || "Project";
              const desc = project.description || project.desc;
              const stack = project.tags || project.stack || [];
              const live = project.liveUrl || project.live;
              const github = project.githubUrl || project.github;

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <TiltCard className="gc pc" style={{ height: "100%" }}>
                    <span className="p-tag">{category}</span>
                    <h3 className="p-name">{name}</h3>
                    <p className="p-desc">{desc}</p>
                    <div className="p-stack">
                      {stack.map((s) => (
                        <span key={s} className="sp">{s}</span>
                      ))}
                    </div>
                    {(live || github) && (
                      <div className="p-links">
                        {live && live !== "#" && (
                          <a href={live} target="_blank" rel="noopener noreferrer" className="p-link">Live</a>
                        )}
                        {github && github !== "#" && (
                          <a href={github} target="_blank" rel="noopener noreferrer" className="p-link">GitHub</a>
                        )}
                      </div>
                    )}
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* ══════ TOP SKILLS ══════ */}
      {topSkills.length > 0 && (
        <section className="sec w" style={{ position: "relative" }}>
          <motion.div
            className="sh"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <p className="sl">Tools & Tech</p>
              <h2 className="st">Core Skills</h2>
            </div>
            <Link to="/skills" className="btn-o" style={{ padding: ".5rem 1.2rem", fontSize: "11px" }}>
              View All
            </Link>
          </motion.div>

          <div className="sg">
            {topSkills.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <TiltCard className="gc sk" style={{ height: "100%" }}>
                  <p className="sn">{s.name}</p>
                  <div className="str">
                    <motion.div
                      className="sb"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: s.level / 100 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      style={{ transformOrigin: "left" }}
                    />
                  </div>
                  <span style={{
                    display: "block",
                    fontSize: "9px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--faint)",
                    marginTop: "0.45rem",
                  }}>
                    {s.category}
                  </span>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ══════ EXPERIENCE HIGHLIGHTS ══════ */}
      {topExperience.length > 0 && (
        <section className="sec w" style={{ position: "relative" }}>
          <motion.div
            className="sh"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <p className="sl">Career</p>
              <h2 className="st">Recent Experience</h2>
            </div>
            <Link to="/experience" className="btn-o" style={{ padding: ".5rem 1.2rem", fontSize: "11px" }}>
              View All
            </Link>
          </motion.div>

          <div className="el">
            {topExperience.map((e, i) => {
              const role = e.role || e.title;
              const period = e.period || e.duration;
              const type = e.type === "education" ? "Education" : "Full-time";
              const desc = e.desc || e.description;

              return (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <TiltCard className="gc ec">
                    <div>
                      <h3 className="er">{role}</h3>
                      <p className="eco">{e.company}</p>
                      <p className="ed">{desc}</p>
                    </div>
                    <div className="em">
                      <p className="ep">{period}</p>
                      <span className="eb">{type}</span>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* ══════ CTA BANNER ══════ */}
      <section className="sec w" style={{ position: "relative" }}>
        <motion.div
          className="gc"
          style={{
            padding: "3.5rem 3rem",
            textAlign: "center",
            borderImage: "linear-gradient(135deg, var(--border-h), var(--border)) 1",
          }}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="sl" style={{ marginBottom: "0.6rem" }}>Interested?</p>
          <h2 className="st" style={{ marginBottom: "1.2rem" }}>
            Let's build something together.
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "14px", maxWidth: "460px", margin: "0 auto 2rem", lineHeight: 1.8 }}>
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/contact" className="btn-i">Get in Touch</Link>
            <a href="/cv/resume.pdf" download className="btn-o">Download CV</a>
          </div>
        </motion.div>
      </section>
    </PageTransition>
  );
}
