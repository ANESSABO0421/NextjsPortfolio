// Single source of truth for identity, contact and navigation data. Anything
// rendered in more than one place (header, footer, contact page, JSON-LD)
// reads from here so the details can never drift apart.

export const site = {
  name: "Anees Aboobacker",
  firstName: "Anees",
  role: "Full Stack MERN Developer",
  url: "https://anees-portofolio.vercel.app",
  email: "aneesaboo123@gmail.com",
  phone: "+91 75920 89970",
  phoneHref: "tel:+917592089970",
  region: "Kerala, India",
  // Kerala's geographic centre — the same coordinate the preloader and footer print.
  coordinates: "10.8505° N, 76.2711° E",
  timeZone: "Asia/Kolkata",
  resume: "/Anees_Resume.pdf",
  resumeFileName: "Anees-Aboobacker-Resume.pdf",
  portrait: "/anees-aboo3.png",
  portraitStudio: "/Anees.png",
  summary:
    "Full Stack (MERN) Developer building production ERP, HRMS, and real-time platforms. Currently developing a multi-tenant HRMS serving 6 role-based dashboards — owning the Leave Management module and leading frontend and backend architecture refactoring. Skilled in REST API design, JWT authentication, RBAC, Socket.io, and MongoDB query optimization.",
  shortSummary:
    "Full Stack MERN developer building production ERP, HRMS and real-time platforms from Kerala, India.",
  studio: {
    name: "SkiaFlow",
    founded: "April 2026",
  },
  socials: {
    linkedin: "https://www.linkedin.com/in/anees-aboobacker-4842b627a/",
    github: "https://github.com/ANESSABO0421",
  },
  languages: [
    { name: "English", level: "Fluent" },
    { name: "Malayalam", level: "Native" },
    { name: "Hindi", level: "Conversational" },
  ],
} as const;

export interface NavSection {
  id: string;
  label: string;
}

// Ids are kept from the previous build so existing /#hash links keep working.
export const sections: NavSection[] = [
  { id: "hero", label: "Index" },
  { id: "about", label: "About" },
  { id: "skills", label: "Stack" },
  { id: "experience", label: "Experience" },
  { id: "works", label: "Work" },
  { id: "contact", label: "Contact" },
];

export const pad2 = (value: number) => String(value).padStart(2, "0");
