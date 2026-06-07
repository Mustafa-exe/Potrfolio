import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import TiltCard from "../components/TiltCard";
import GlowOrbs from "../components/GlowOrbs";
import { getProfile } from "../data/profile";
import { getSkills } from "../data/skills";
import { getExperience } from "../data/experience";
import "./About.css";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const WHAT_I_DO = [
  {
    title: "Frontend Development",
    desc: "Building responsive, performant interfaces with React, Next.js, and modern CSS. Pixel-perfect implementations with smooth animations.",
  },
  {
    title: "Backend Engineering",
    desc: "Designing scalable APIs and microservices with Node.js, Express, and Python. Database architecture and optimization.",
  },
  {
    title: "Full Stack Solutions",
    desc: "End-to-end application development from database schema to deployment. CI/CD pipelines, cloud infrastructure, and DevOps.",
  },
  {
    title: "UI/UX Design",
    desc: "Creating intuitive user experiences with a focus on accessibility, performance, and visual aesthetics. Prototyping and design systems.",
  },
];

export default function About() {
  const [profile, setProfile] = useState(() => getProfile());
  const [skillsCategories, setSkillsCategories] = useState(() => getSkills());
  const [experience, setExperience] = useState(() => getExperience());

  useEffect(() => {
    const handleSync = () => {
      setProfile(getProfile());
      setSkillsCategories(getSkills());
      setExperience(getExperience());
    };
    window.addEventListener("portfolio-data-sync", handleSync);
    return () => window.removeEventListener("portfolio-data-sync", handleSync);
  }, []);

  const initials = (profile.name || "M")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <PageTransition>
      <div className="page w" style={{ padding: "4rem 0", position: "relative" }}>
        <GlowOrbs />

        {/* ── Header ── */}
        <div className="sh rev on">
          <div>
            <p className="sl">Bio</p>
            <h2 className="st">About Me</h2>
          </div>
          <span className="sc">01</span>
        </div>

        {/* ── Profile Card + Bio ── */}
        <div className="about-grid">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <TiltCard
              className="gc"
              style={{
                width: "100%",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.5rem",
              }}
            >
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(168,212,245,0.15), rgba(74,128,176,0.1))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                }}
              >
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span
                    style={{
                      fontFamily: "var(--fd)",
                      fontSize: "2.2rem",
                      fontWeight: 800,
                      color: "var(--ice)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {initials}
                  </span>
                )}
              </div>
              <div style={{ textAlign: "center" }}>
                <h3 style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)" }}>
                  {profile.name}
                </h3>
                <p style={{ fontSize: "11px", color: "var(--ice)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "6px" }}>
                  {profile.title}
                </p>
              </div>
              <div style={{ width: "100%", borderTop: "1px solid var(--border)", paddingTop: "1.2rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {profile.location && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "13px" }}>
                    <span style={{ color: "var(--ice)", fontWeight: 500 }}>Location</span>
                    <span style={{ color: "var(--faint)" }}>--</span>
                    <span style={{ color: "var(--muted)" }}>{profile.location}</span>
                  </div>
                )}
                {profile.email && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "13px" }}>
                    <span style={{ color: "var(--ice)", fontWeight: 500 }}>Email</span>
                    <span style={{ color: "var(--faint)" }}>--</span>
                    <span style={{ color: "var(--muted)", wordBreak: "break-all" }}>{profile.email}</span>
                  </div>
                )}
                {profile.social?.github && profile.social.github !== "#" && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "13px" }}>
                    <span style={{ color: "var(--ice)", fontWeight: 500 }}>GitHub</span>
                    <span style={{ color: "var(--faint)" }}>--</span>
                    <a href={profile.social.github} target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)", textDecoration: "none", borderBottom: "1px solid var(--border)" }}>
                      Profile
                    </a>
                  </div>
                )}
              </div>
              <Link to="/contact" className="btn-i" style={{ width: "100%", textAlign: "center", marginTop: "0.5rem" }}>
                Get in Touch
              </Link>
            </TiltCard>
          </motion.div>

          <motion.div
            className="about-info"
            variants={stagger}
            initial="hidden"
            animate="visible"
            style={{ textAlign: "left" }}
          >
            <motion.div variants={fadeUp}>
              <h3 style={{ fontFamily: "var(--fd)", fontWeight: 700, color: "var(--ice)", marginBottom: "1rem" }}>
                My Story
              </h3>
              <p style={{ color: "var(--muted)", fontSize: "14.5px", lineHeight: 1.8, fontWeight: 300, marginBottom: "1.5rem" }}>
                {profile.bio}
              </p>
              <p style={{ color: "var(--muted)", fontSize: "14.5px", lineHeight: 1.8, fontWeight: 300, marginBottom: "2rem" }}>
                I believe in writing clean, maintainable code and building products that solve real problems.
                Every project is an opportunity to learn something new and push the boundaries of what's possible on the web.
              </p>
            </motion.div>

            {profile.stats && (
              <motion.div variants={fadeUp} style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem", marginBottom: "2rem" }}>
                <h3 style={{ fontFamily: "var(--fd)", fontWeight: 700, color: "var(--ice)", marginBottom: "1.2rem" }}>
                  By the Numbers
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.8rem" }}>
                  {Object.entries(profile.stats).map(([key, val]) => (
                    <TiltCard key={key} className="gc" style={{ padding: "1rem", textAlign: "center" }}>
                      <div style={{ fontFamily: "var(--fd)", fontSize: "1.6rem", fontWeight: 800, color: "var(--ice)", lineHeight: 1 }}>
                        {val}
                      </div>
                      <div style={{ fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--faint)", marginTop: "6px" }}>
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </div>
                    </TiltCard>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* ── What I Do ── */}
        <section style={{ marginTop: "4rem" }}>
          <motion.div
            className="sh"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <p className="sl">Services</p>
              <h2 className="st">What I Do</h2>
            </div>
            <span className="sc">02</span>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.2rem" }}>
            {WHAT_I_DO.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <TiltCard className="gc" style={{ padding: "1.8rem", height: "100%", textAlign: "left" }}>
                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "6px",
                    background: "var(--ice-dim)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem",
                  }}>
                    <div style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "var(--ice)",
                    }} />
                  </div>
                  <h4 style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: "1rem", color: "var(--text)", marginBottom: "0.6rem" }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.7 }}>
                    {item.desc}
                  </p>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Tech Stack Overview ── */}
        <section style={{ marginTop: "4rem" }}>
          <motion.div
            className="sh"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <p className="sl">Stack</p>
              <h2 className="st">Technologies</h2>
            </div>
            <Link to="/skills" className="btn-o" style={{ padding: ".5rem 1.2rem", fontSize: "11px" }}>
              View All
            </Link>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {skillsCategories.map((cat, ci) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: ci * 0.08 }}
              >
                <p style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ice)", marginBottom: "0.6rem" }}>
                  {cat.category}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {cat.items.map((s) => (
                    <span key={s.name} className="sp" style={{ fontSize: "11px", padding: "0.3rem 0.7rem" }}>
                      {s.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Timeline ── */}
        {experience.length > 0 && (
          <section style={{ marginTop: "4rem" }}>
            <motion.div
              className="sh"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <p className="sl">Journey</p>
                <h2 className="st">Timeline</h2>
              </div>
              <span className="sc">03</span>
            </motion.div>

            <div className="about-timeline">
              {experience.map((e, i) => (
                <motion.div
                  key={e.id}
                  className="about-timeline-item"
                  initial={{ opacity: 0, x: i % 2 === 0 ? -15 : 15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="about-timeline-dot" />
                  <div className="gc" style={{ padding: "1.2rem 1.5rem", flex: 1, textAlign: "left" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                      <div>
                        <h4 style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: "0.95rem", color: "var(--text)", marginBottom: "0.15rem" }}>
                          {e.role || e.title}
                        </h4>
                        <p style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ice)" }}>
                          {e.company}
                        </p>
                      </div>
                      <span style={{ fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--faint)", whiteSpace: "nowrap" }}>
                        {e.period || e.duration}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </PageTransition>
  );
}
