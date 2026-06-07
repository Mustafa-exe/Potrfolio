import { syncToFirestore } from "./dbSync";

const defaultProfile = {
  name: "Mustafa",
  title: "Full Stack Developer",
  subtitle: "Building digital experiences that matter",
  bio: "I'm a passionate developer with a keen eye for design and a love for creating seamless, performant web applications. With experience spanning both frontend and backend technologies, I bring ideas to life through clean code and thoughtful architecture.",
  avatar: "",
  email: "hello@mustafa.dev",
  location: "Pakistan",
  social: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
  },
  stats: {
    yearsExperience: "2+",
    projectsCompleted: "15+",
    technologiesUsed: "20+",
    coffeeCups: "1000+",
  },
};

export function getProfile() {
  const stored = localStorage.getItem("portfolio_profile");
  if (stored) {
    try {
      return { ...defaultProfile, ...JSON.parse(stored) };
    } catch {
      return defaultProfile;
    }
  }
  return defaultProfile;
}

export function saveProfile(profile) {
  localStorage.setItem("portfolio_profile", JSON.stringify(profile));
  syncToFirestore();
}

export default defaultProfile;
