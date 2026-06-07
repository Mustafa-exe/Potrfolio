import { syncToFirestore } from "./dbSync";

const defaultSkills = [
  {
    category: "Frontend",
    icon: "FE",
    items: [
      { name: "React / Next.js", level: 90 },
      { name: "JavaScript / TypeScript", level: 88 },
      { name: "HTML5 / CSS3", level: 95 },
      { name: "Framer Motion", level: 80 },
      { name: "Tailwind CSS", level: 85 },
    ],
  },
  {
    category: "Backend",
    icon: "BE",
    items: [
      { name: "Node.js / Express", level: 85 },
      { name: "Python / Django", level: 75 },
      { name: "REST APIs", level: 90 },
      { name: "GraphQL", level: 70 },
      { name: "WebSockets", level: 72 },
    ],
  },
  {
    category: "Database",
    icon: "DB",
    items: [
      { name: "MongoDB", level: 82 },
      { name: "PostgreSQL", level: 78 },
      { name: "Firebase", level: 80 },
      { name: "Redis", level: 65 },
    ],
  },
  {
    category: "DevOps & Tools",
    icon: "DO",
    items: [
      { name: "Git / GitHub", level: 92 },
      { name: "Docker", level: 75 },
      { name: "AWS / Vercel", level: 70 },
      { name: "CI/CD", level: 68 },
      { name: "Linux", level: 73 },
    ],
  },
];

export function getSkills() {
  const stored = localStorage.getItem("portfolio_skills");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultSkills;
    }
  }
  return defaultSkills;
}

export function saveSkills(skills) {
  localStorage.setItem("portfolio_skills", JSON.stringify(skills));
  syncToFirestore();
}

export default defaultSkills;
