export type ProjectDevice = "laptop" | "phone";

export interface ProjectEntry {
  id: string;
  title: string;
  listTitle: string;
  category: string;
  src: string;
  /** Optional screen-recording that plays inside the device mockup instead of the static screenshot. */
  video?: string;
  device: ProjectDevice;
  role: string;
  credits: string;
  locationYear: string;
  liveUrl: string;
  liveLabel: string;
  description: string;
  about: string;
  highlights: string[];
  stack: string[];
}

export interface ProjectDetail extends ProjectEntry {
  nextId: string;
  nextTitle: string;
}

// Ordered the same way the works list renders them; "next case" wraps around.
const projects: ProjectEntry[] = [
  {
    id: "spendova",
    title: "SPENDOVA",
    listTitle: "Spendova",
    category: "React Native / AI Mobile",
    src: "/project-1.png",
    video: "/video/Spendova.mp4",
    device: "phone",
    role: "Mobile App & REST API Development",
    credits: "Development: Anees Aboobacker",
    locationYear: "Kerala, India © 2026",
    liveUrl: "https://github.com/ANESSABO0421",
    liveLabel: "Source",
    description:
      "Spendova is a cross-platform React Native expense tracker with voice-driven transaction entry, Gemini-powered spending insights, and category-wise analytics.",
    about:
      "A cross-platform income and expense tracker built with React Native and Expo. Transactions can be entered by voice through expo-speech-recognition, while the Gemini API turns raw spending history into readable insights and category-wise analytics. The Express and MongoDB API is deployed on Render, with mobile builds generated through Expo.",
    highlights: [
      "Voice-driven transaction entry powered by expo-speech-recognition.",
      "Gemini API spending insights and category-wise analytics dashboards.",
      "Express + MongoDB REST API deployed on Render, mobile builds via Expo.",
    ],
    stack: [
      "React Native",
      "Expo",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Gemini API",
      "expo-speech-recognition",
      "Render",
    ],
  },
  {
    id: "malappuram-fc",
    title: "MALAPPURAM FC",
    listTitle: "Malappuram FC Ultras",
    category: "Next.js / Community Platform",
    src: "/project-2.png",
    video: "/video/Ultrasmalappuram.mp4",
    device: "laptop",
    role: "Full Stack Development",
    credits: "Development: Anees Aboobacker — SkiaFlow",
    locationYear: "Malappuram, Kerala © 2026",
    liveUrl: "https://www.ultrasmalappuram.com/",
    liveLabel: "Live Site",
    description:
      "Malappuram FC Ultras is a football community platform with admin-controlled standings, fixtures, galleries, and news management, built with Next.js and the MERN stack.",
    about:
      "A football fan community platform delivered end to end for Malappuram FC Ultras. The admin panel drives league standings, fixtures, galleries, and news, so the club can publish without touching code. Backend response caching keeps the public read paths fast during match days.",
    highlights: [
      "Admin-controlled standings, fixtures, galleries, and news management.",
      "Backend response caching to improve read performance on public pages.",
      "JWT authentication and role-based access for the admin dashboard.",
    ],
    stack: [
      "Next.js",
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Tailwind CSS",
      "JWT Auth",
      "Vercel",
    ],
  },
  {
    id: "kriscorp",
    title: "KRISCORP",
    listTitle: "KrisCorp",
    category: "Next.js / Corporate Site",
    src: "/project-3.png",
    video: "/video/Kriscorp.mp4",
    device: "laptop",
    role: "Full Stack Development & SEO",
    credits: "Development: Anees Aboobacker — SkiaFlow",
    locationYear: "Kerala, India © 2026",
    liveUrl: "https://kriscorp-website.vercel.app/",
    liveLabel: "Live Site",
    description:
      "KrisCorp is a construction company website with project showcases, inquiry management, and lead generation, built with Next.js, Node.js, MongoDB, and GSAP.",
    about:
      "A client website for a construction company, covering project showcases, inquiry management, and lead generation. Built as an SEO-optimised Next.js app with GSAP motion throughout, and deployed on Vercel with post-launch maintenance handled in house.",
    highlights: [
      "Project showcase, inquiry management, and lead generation flows.",
      "SEO-optimised routing and metadata, deployed on Vercel.",
      "GSAP-driven scroll and reveal animations across the site.",
    ],
    stack: [
      "Next.js",
      "React.js",
      "Node.js",
      "MongoDB",
      "GSAP",
      "Tailwind CSS",
      "SEO",
      "Vercel",
    ],
  },
  {
    id: "devpulse",
    title: "DEVPULSE",
    listTitle: "DevPulse",
    category: "AI / Developer Tools",
    src: "/project-2.png",
    video: "/video/Devpulse.mp4",
    device: "laptop",
    role: "Full-Stack Development & AI Integration",
    credits: "Development: Anees Aboobacker",
    locationYear: "Kerala, India © 2026",
    liveUrl: "https://github.com/ANESSABO0421/devpulse-ai-code-analyzer",
    liveLabel: "Source",
    description:
      "DevPulse is an AI-powered code review platform that uses the Claude API for automated code quality analysis, structured review scores, and review history.",
    about:
      "An AI-powered code review platform that pipes submitted code through the Claude API and returns structured quality analysis: scored reviews, prioritised findings, and a persistent review history per user. Role-based access separates reviewers from admins, and CI/CD runs on Render.",
    highlights: [
      "Claude API integration for automated code quality analysis.",
      "Structured review scores and per-user review history.",
      "RBAC across reviewer and admin roles, with CI/CD on Render.",
    ],
    stack: [
      "Next.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Claude API",
      "RBAC",
      "TypeScript",
      "Render",
    ],
  },
  {
    id: "synapse",
    title: "SYNAPSE",
    listTitle: "Synapse",
    category: "Socket.io / Real-Time Platform",
    src: "/project-3.png",
    device: "laptop",
    role: "Full Stack Development & Real-Time Systems",
    credits: "Development: Anees Aboobacker",
    locationYear: "Kerala, India © 2026",
    liveUrl: "https://github.com/ANESSABO0421/Synapsis-NSS-Management-System",
    liveLabel: "Source",
    description:
      "Synapse is a multi-role NSS management portal with JWT authentication, real-time group chat, Stripe payments, and automated PDF certificate generation.",
    about:
      "A management portal for an NSS unit, serving multiple roles from a single codebase. Members, volunteers, and administrators each get a scoped dashboard, backed by JWT authentication, Socket.io group chat, Stripe payments, and automated PDF certificate generation.",
    highlights: [
      "Multi-role portal with JWT authentication and scoped dashboards.",
      "Real-time group chat over Socket.io with room-scoped broadcasting.",
      "Stripe payments and automated PDF certificate generation.",
    ],
    stack: [
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Socket.io",
      "Stripe API",
      "PDFKit",
      "JWT Auth",
    ],
  },
];

export const projectDetails: Record<string, ProjectDetail> = Object.fromEntries(
  projects.map((project, index) => {
    const next = projects[(index + 1) % projects.length];
    return [
      project.id,
      { ...project, nextId: next.id, nextTitle: next.listTitle },
    ];
  })
);

export const projectIds = projects.map((project) => project.id);

// Shape the works list consumes — keeps the section and the detail pages in sync.
export const projectList = projects.map(({ id, listTitle, category, src, video }) => ({
  id,
  title: listTitle,
  category,
  src,
  video,
}));
