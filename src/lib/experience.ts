export type RoleKind = "internship" | "employment" | "studio";

export interface Role {
  id: string;
  company: string;
  /** Short name used on the route map where space is tight. */
  short: string;
  /** Printed under each stop on the route map, metro-sign style. */
  station: string;
  location: string;
  title: string;
  start: string;
  end: string;
  current: boolean;
  kind: RoleKind;
  /** Full résumé bullets. */
  points: string[];
  /** Condensed, still-factual bullets for the route-map cards. */
  brief: string[];
  stack: string[];
}

// Chronological — the route map reads left to right, oldest stop first.
export const roles: Role[] = [
  {
    id: "softroniics",
    company: "Softroniics",
    short: "Softroniics",
    station: "Perinthalmanna",
    location: "Perinthalmanna",
    title: "MERN Stack Developer Intern",
    start: "May 2025",
    end: "Nov 2025",
    current: false,
    kind: "internship",
    points: [
      "Developed full-stack features with React.js and Node.js/Express.js, owning end-to-end delivery from API design to UI integration.",
      "Implemented JWT authentication, RBAC, and modular middleware routing; optimized MongoDB queries via compound indexing and integrated Socket.io real-time broadcasting.",
    ],
    brief: [
      "Shipped full-stack features end to end — from API design to UI integration.",
      "JWT auth, RBAC and modular middleware; compound indexes on hot MongoDB queries; Socket.io broadcasting.",
    ],
    stack: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT", "Socket.io"],
  },
  {
    id: "necttos",
    company: "Necttos OPC Private Limited",
    short: "Necttos",
    station: "Pattambi",
    location: "Pattambi",
    title: "Full Stack Developer",
    start: "Nov 2025",
    end: "Apr 2026",
    current: false,
    kind: "employment",
    points: [
      "Built a Transfer Certificate generation module with Node.js and PDFKit, automating dynamic PDF creation and eliminating 100% of manual processing.",
      "Architected a React.js ERP frontend with reusable components, data-heavy tables, dashboards, and multi-step forms across 5+ feature modules, backed by an Alumni Management system using MongoDB aggregation pipelines.",
      "Designed RESTful APIs serving both React.js web and React Native mobile clients, and fixed a critical React Native form bug that let empty values overwrite existing records.",
    ],
    brief: [
      "Transfer Certificate module with Node.js + PDFKit — manual processing eliminated entirely.",
      "React ERP frontend across 5+ modules; Alumni Management on MongoDB aggregation pipelines.",
      "REST APIs shared by web and React Native clients; fixed a form bug that overwrote records.",
    ],
    stack: ["React.js", "React Native", "Node.js", "MongoDB", "PDFKit"],
  },
  {
    id: "skiaflow",
    company: "SkiaFlow",
    short: "SkiaFlow",
    station: "Remote",
    location: "Remote",
    title: "Founder & Full Stack Developer",
    start: "Apr 2026",
    end: "Present",
    current: true,
    kind: "studio",
    points: [
      "Founded a freelance software studio and delivered 2 end-to-end client products — the Malappuram FC Ultras community platform and the KrisCorp corporate website.",
      "Architected REST APIs and JWT/RBAC authentication, and owned requirements gathering, deployment on Vercel and Render, and post-launch maintenance.",
    ],
    brief: [
      "Founded a freelance studio; delivered Malappuram FC Ultras and KrisCorp end to end.",
      "REST APIs and JWT/RBAC auth, plus requirements, Vercel/Render deploys and maintenance.",
    ],
    stack: ["Next.js", "React.js", "Node.js", "Express.js", "MongoDB", "Vercel"],
  },
  {
    id: "xynex",
    company: "XY-NEX Learning & Alans Academy",
    short: "XY-NEX & Alans",
    station: "Kozhikode",
    location: "Kozhikode",
    title: "Full Stack Developer",
    start: "Jul 2026",
    end: "Present",
    current: true,
    kind: "employment",
    points: [
      "Own the Leave Management module of a multi-tenant HRMS serving 6 user roles across 2 institutional branches, with a Department Head → HR → Admin approval workflow.",
      "Built a leave quota engine enforcing monthly and annual paid-leave caps with half-day splitting and week-off exclusion; resolved 15+ production defects across approval, rejection, and quota calculation.",
      "Re-architected 6,000+ lines of monolithic React components into 50+ modular components, custom hooks, and Context providers, and split a 571-line Express controller into controller and service layers.",
      "Implemented Socket.io notifications with room-scoped broadcasting and presence, plus node-cron jobs for reminders and automated daily attendance closing.",
    ],
    brief: [
      "Own Leave Management in a multi-tenant HRMS — 6 roles, 2 branches, Dept Head → HR → Admin approvals.",
      "Leave quota engine with monthly/annual caps, half-days and week-offs; 15+ production defects resolved.",
      "6,000+ lines of monolithic React re-architected into 50+ components; a 571-line controller split into services.",
      "Socket.io notifications with rooms and presence; node-cron reminders and automatic attendance closing.",
    ],
    stack: ["React.js", "Node.js", "Express.js", "MongoDB", "Socket.io", "node-cron"],
  },
];

export const education = {
  degree: "B.Sc. Computer Science",
  school: "GEMS Arts & Science College",
  campus: "Ramapuram",
  university: "Calicut University",
  period: "2022 — 2025",
};

export const certifications = [
  { title: "AI Hackathon Participant", issuer: "Softroniics", year: "2025" },
];
