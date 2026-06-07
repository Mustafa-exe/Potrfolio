import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import TiltCard from "../components/TiltCard";
import GlowOrbs from "../components/GlowOrbs";
import { getExperience } from "../data/experience";
import "./Experience.css";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: -30, rotateY: 5 },
  visible: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Experience() {
  const [experience, setExperience] = useState(() => getExperience());

  useEffect(() => {
    const handleSync = () => {
      setExperience(getExperience());
    };
    window.addEventListener("portfolio-data-sync", handleSync);
    return () => window.removeEventListener("portfolio-data-sync", handleSync);
  }, []);

  return (
    <PageTransition>
      <div className="page w" style={{ padding: "4rem 0", position: "relative" }}>
        <GlowOrbs />
        <div className="sh rev on">
          <div>
            <p className="sl">Career</p>
            <h2 className="st">Experience</h2>
          </div>
          <span className="sc" id="cE">
            {String(experience.length).padStart(2, "0")}
          </span>
        </div>

        <motion.div
          className="el"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ perspective: "1000px" }}
        >
          {experience.map((e) => {
            const role = e.role || e.title;
            const company = e.company;
            const period = e.period || e.duration;
            const type = e.type || "Full-time";
            const desc = e.desc || e.description;

            return (
              <motion.div key={e.id} variants={cardVariants}>
                <TiltCard className="gc ec">
                  <div>
                    <h3 className="er">{role}</h3>
                    <p className="eco">{company}</p>
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
        </motion.div>

        {experience.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <p style={{ color: "var(--faint)", fontSize: "14px" }}>
              No experience records added yet.
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
