import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import TiltCard from "../components/TiltCard";
import GlowOrbs from "../components/GlowOrbs";
import { getSkills } from "../data/skills";
import "./Skills.css";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Skills() {
  const [skillsCategories, setSkillsCategories] = useState(() => getSkills());

  useEffect(() => {
    const handleSync = () => {
      setSkillsCategories(getSkills());
    };
    window.addEventListener("portfolio-data-sync", handleSync);
    return () => window.removeEventListener("portfolio-data-sync", handleSync);
  }, []);

  const skills = skillsCategories.flatMap((cat) =>
    cat.items.map((item) => ({
      name: item.name,
      level: item.level / 100,
      category: cat.category,
    }))
  );

  return (
    <PageTransition>
      <div className="page w" style={{ padding: "4rem 0", position: "relative" }}>
        <GlowOrbs />
        <div className="sh rev on">
          <div>
            <p className="sl">Tools &amp; Tech</p>
            <h2 className="st">Skills</h2>
          </div>
          <span className="sc" id="cE">
            {String(skills.length).padStart(2, "0")}
          </span>
        </div>

        <motion.div
          className="sg"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {skills.map((s, i) => (
            <motion.div key={i} variants={cardVariants}>
              <TiltCard className="gc sk" style={{ height: "100%" }}>
                <p className="sn">{s.name}</p>
                <div className="str">
                  <motion.div
                    className="sb on"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: s.level }}
                    transition={{
                      duration: 1.2,
                      delay: 0.3 + i * 0.04,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{ transformOrigin: "left" }}
                  />
                </div>
                <motion.span
                  style={{
                    display: "block",
                    fontSize: "9px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--faint)",
                    marginTop: "0.5rem",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.04 }}
                >
                  {s.category}
                </motion.span>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>

        {skills.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <p style={{ color: "var(--faint)", fontSize: "14px" }}>
              No skills added yet.
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
