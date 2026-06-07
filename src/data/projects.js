import { syncToFirestore } from "./dbSync";

const defaultProjects = [
  {
    id: "1",
    title: "E-Commerce Platform",
    description:
      "A full-featured e-commerce platform with real-time inventory management, secure payment processing, and an intuitive admin dashboard.",
    image: "",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    category: "Full Stack",
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
  },
  {
    id: "2",
    title: "Task Management App",
    description:
      "A collaborative task management tool with drag-and-drop boards, real-time updates, and team workspace functionality.",
    image: "",
    tags: ["React", "Firebase", "Tailwind CSS"],
    category: "Frontend",
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
  },
  {
    id: "3",
    title: "AI Chat Interface",
    description:
      "An intelligent chat application powered by GPT APIs with conversation history, markdown rendering, and code highlighting.",
    image: "",
    tags: ["Next.js", "OpenAI", "TypeScript"],
    category: "AI/ML",
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
  },
  {
    id: "4",
    title: "Weather Dashboard",
    description:
      "A beautiful weather dashboard with 7-day forecasts, interactive maps, and location-based weather alerts.",
    image: "",
    tags: ["React", "REST API", "Chart.js"],
    category: "Frontend",
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
  },
  {
    id: "5",
    title: "Portfolio CMS",
    description:
      "A headless CMS built specifically for developer portfolios with markdown support, image optimization, and SEO tools.",
    image: "",
    tags: ["Node.js", "Express", "PostgreSQL"],
    category: "Backend",
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
  },
  {
    id: "6",
    title: "Fitness Tracker",
    description:
      "A mobile-responsive fitness tracking app with workout logging, progress charts, and personalized training recommendations.",
    image: "",
    tags: ["React Native", "GraphQL", "MongoDB"],
    category: "Mobile",
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
  },
];

export function getProjects() {
  const stored = localStorage.getItem("portfolio_projects");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultProjects;
    }
  }
  return defaultProjects;
}

export function saveProjects(projects) {
  localStorage.setItem("portfolio_projects", JSON.stringify(projects));
  syncToFirestore();
}

export default defaultProjects;
