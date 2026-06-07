import { syncToFirestore } from "./dbSync";

const defaultExperience = [
  {
    id: "1",
    company: "Tech Innovations Inc.",
    role: "Senior Full Stack Developer",
    duration: "2024 - Present",
    description:
      "Leading development of microservices architecture, mentoring junior developers, and implementing CI/CD pipelines. Reduced deployment time by 60% and improved application performance by 40%.",
    technologies: ["React", "Node.js", "AWS", "Docker", "PostgreSQL"],
    type: "work",
  },
  {
    id: "2",
    company: "Digital Solutions Co.",
    role: "Frontend Developer",
    duration: "2022 - 2024",
    description:
      "Built responsive web applications using React and modern CSS. Collaborated with UX team to implement pixel-perfect designs and improve user engagement metrics by 35%.",
    technologies: ["React", "TypeScript", "SCSS", "Redux", "Jest"],
    type: "work",
  },
  {
    id: "3",
    company: "StartUp Hub",
    role: "Junior Developer",
    duration: "2021 - 2022",
    description:
      "Developed and maintained web applications for various clients. Gained experience in agile methodologies, code reviews, and version control best practices.",
    technologies: ["JavaScript", "HTML/CSS", "Python", "Git"],
    type: "work",
  },
  {
    id: "4",
    company: "University of Technology",
    role: "Bachelor's in Computer Science",
    duration: "2018 - 2022",
    description:
      "Graduated with honors. Focused on software engineering, data structures, and web technologies. Led the university coding club and organized hackathons.",
    technologies: ["Java", "Python", "C++", "Algorithms"],
    type: "education",
  },
];

export function getExperience() {
  const stored = localStorage.getItem("portfolio_experience");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultExperience;
    }
  }
  return defaultExperience;
}

export function saveExperience(experience) {
  localStorage.setItem("portfolio_experience", JSON.stringify(experience));
  syncToFirestore();
}

export default defaultExperience;
