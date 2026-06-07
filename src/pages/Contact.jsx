import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import GlowOrbs from "../components/GlowOrbs";
import { getProfile } from "../data/profile";
import "./Contact.css";

export default function Contact() {
  const profile = getProfile();

  return (
    <PageTransition>
      <div
        className="page w"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 120px)",
          position: "relative",
        }}
      >
        <GlowOrbs />
        <motion.div
          className="cb"
          initial={{ opacity: 0, y: 40, rotateX: -8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center", perspective: "800px" }}
        >
          <motion.p
            className="sl"
            style={{ textAlign: "center", marginBottom: "0.5rem" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Get in Touch
          </motion.p>
          <motion.h2
            className="st"
            style={{ textAlign: "center", marginTop: "0.45rem", marginBottom: "1.5rem" }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
          >
            Let's work
            <br />
            together.
          </motion.h2>
          <motion.a
            className="ce"
            id="cEmail"
            href={`mailto:${profile.email}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            whileHover={{
              scale: 1.05,
              textShadow: "0 0 25px rgba(168, 212, 245, 0.5)",
            }}
          >
            {profile.email}
          </motion.a>

          {/* Animated decorative line */}
          <motion.div
            style={{
              width: "80px",
              height: "1px",
              background: "linear-gradient(90deg, transparent, var(--ice), transparent)",
              margin: "2rem auto",
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          />

          <motion.div
            className="srow"
            id="sRow"
            style={{ marginTop: "1rem" }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {profile.social?.github && profile.social.github !== "#" && (
              <motion.a
                href={profile.social.github}
                className="sa"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3, color: "var(--ice)" }}
              >
                GitHub
              </motion.a>
            )}
            {profile.social?.linkedin && profile.social.linkedin !== "#" && (
              <motion.a
                href={profile.social.linkedin}
                className="sa"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3, color: "var(--ice)" }}
              >
                LinkedIn
              </motion.a>
            )}
            {profile.social?.twitter && profile.social.twitter !== "#" && (
              <motion.a
                href={profile.social.twitter}
                className="sa"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3, color: "var(--ice)" }}
              >
                Twitter / X
              </motion.a>
            )}
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
