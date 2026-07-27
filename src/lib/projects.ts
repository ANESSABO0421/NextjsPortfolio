export interface ProjectDetail {
  title: string;
  category: string;
  src: string;
  role: string;
  credits: string;
  locationYear: string;
  liveUrl: string;
  nextId: string;
  nextTitle: string;
  description: string;
}

export const projectDetails: Record<string, ProjectDetail> = {
  "devpulse": {
    title: "DEVPULSE",
    category: "AI / Developer Tools",
    src: "/project-1.png",
    role: "Full-Stack Development & AI Integration",
    credits: "Development: Anees Aboobacker",
    locationYear: "Kerala, India © 2026",
    liveUrl: "https://devpulse.vercel.app", // placeholder
    nextId: "malappuram-fc",
    nextTitle: "Malappuram FC Ultras",
    description:
      "DevPulse is an AI-powered developer tools platform built with the MERN stack, featuring full-stack development and AI integration.",
  },
  "malappuram-fc": {
    title: "MALAPPURAM FC",
    category: "Full Stack / Community",
    src: "/project-2.png",
    role: "MERN Stack Development",
    credits: "Development: Anees Aboobacker",
    locationYear: "Kerala, India © 2026",
    liveUrl: "https://malappuramfc.vercel.app", // placeholder
    nextId: "synapse",
    nextTitle: "Synapse",
    description:
      "Malappuram FC Ultras is a full-stack community platform built with the MERN stack for a football fan community.",
  },
  "synapse": {
    title: "SYNAPSE",
    category: "Node.js / Platform",
    src: "/project-3.png",
    role: "Backend & WebSockets",
    credits: "Development: Anees Aboobacker",
    locationYear: "Kerala, India © 2026",
    liveUrl: "https://synapse.vercel.app", // placeholder
    nextId: "lumio",
    nextTitle: "Lumio",
    description:
      "Synapse is a real-time Node.js platform built with WebSockets (Socket.io) for live, event-driven data.",
  },
  "lumio": {
    title: "LUMIO",
    category: "React / Social Media",
    src: "/project-1.png",
    role: "Frontend & Animation",
    credits: "Development: Anees Aboobacker",
    locationYear: "Kerala, India © 2026",
    liveUrl: "https://lumio.vercel.app", // placeholder
    nextId: "devpulse",
    nextTitle: "DevPulse",
    description:
      "Lumio is a React-based social media frontend focused on smooth interface animation and interaction design.",
  },
};

export const projectIds = Object.keys(projectDetails);
