export type ProjectDevice = "laptop" | "phone";

export interface ProjectModule {
  title: string;
  badge?: string;
  description: string;
  points?: string[];
}

export interface ProjectRolePersona {
  role: string;
  badge: string;
  scope: string;
}

export interface ProjectEntry {
  id: string;
  title: string;
  listTitle: string;
  category: string;
  /** One-line pitch used by the editorial spreads on the home page. */
  tagline: string;
  /** A real frame pulled from the project's own screen recording. */
  poster?: string;
  /** Optional screen-recording that plays inside the device mockup instead of the static poster. */
  video?: string;
  /** Sampled from the product's own UI; only ever used in small doses. */
  accent: string;
  device: ProjectDevice;
  role?: string;
  credits: string;
  locationYear: string;
  year: string;
  liveUrl: string;
  liveLabel: string;
  description: string;
  about: string;
  highlights: string[];
  stack: string[];
  modules?: ProjectModule[];
  rolesMatrix?: ProjectRolePersona[];
}

export interface ProjectDetail extends ProjectEntry {
  index: number;
  total: number;
  nextId: string;
  nextTitle: string;
}

// Ordered the same way the works section renders them; "next case" wraps around.
const projects: ProjectEntry[] = [
  {
    id: "d-aide-nexus",
    title: "D-AIDE NEXUS",
    listTitle: "D-AIDE Nexus",
    category: "Admission & University Processing ERP",
    tagline: "I built a full-stack ERP that takes a student from admission at a learning centre to a university enrollment number in one workspace.",
    accent: "#38bdb0",
    device: "laptop",
    credits: "I built this with one other developer as a team of two.",
    locationYear: "Kerala, India © 2026",
    year: "2026",
    liveUrl: "",
    liveLabel: "",
    description:
      "I built D-AIDE Nexus, a multi-role admission ERP for an education partner network, covering documents, payments, bank reconciliation, verification and university submission.",
    about:
      "I built D-AIDE Nexus for an education partner network to connect learning-centre admissions with university processing. I brought the workflow into one workspace: centres admit students through a one-page form that saves itself, upload documents and payment receipts, and submit for review. I built tools for staff to verify documents, automatically match receipts to imported bank statements, export verified students in each university's Excel format, and record enrollment numbers.",
    highlights: [
      "I built a one-page admission form with automatic saving, clear section requirements and in-place file previews.",
      "I automated receipt reading and bank reconciliation, matching credits by reference and amount with duplicate detection.",
      "I built a guided verification checklist for documents and payments, with a full audit log.",
      "I connected verified admissions to university-specific Excel exports, document bundles and enrollment-number imports.",
    ],
    stack: [
      "Next.js", "React", "TypeScript", "TanStack Query", "Tailwind CSS", "shadcn/ui", "GSAP",
      "Node.js", "Express", "Zod", "Session Auth", "bcrypt", "Role-Based Access", "Audit Logging",
      "PostgreSQL", "Neon", "Drizzle ORM", "Redis", "Upstash", "Backblaze B2", "S3 API",
      "PaddleOCR", "Tesseract.js", "SheetJS", "ExcelJS", "PDF Parsing & Rendering",
      "npm Workspaces", "Vitest", "PGlite", "Playwright", "Render",
    ],
    modules: [
      {
        title: "Catalogue builder",
        badge: "Setup",
        description: "I built a step-by-step catalogue builder for universities, boards, courses, specialisations, sessions, fees and required documents.",
        points: [
          "I added a single-file Excel import with a row-by-row check before saving.",
          "I automated code generation for catalogue entries.",
        ],
      },
      {
        title: "One-page admission form",
        badge: "Admissions",
        description: "I built an admission form where every section saves itself, so learning centres can work through an application in one place.",
        points: [
          "I made locked sections explain exactly what is missing.",
          "I highlighted required documents and added in-place file previews.",
        ],
      },
      {
        title: "Payment automation & bank reconciliation",
        badge: "Payments",
        description: "I integrated OCR to read the amount, UTR, date and payer from receipt screenshots and reduce manual payment entry.",
        points: [
          "I added bank-statement imports from PDF, scanned PDF, Excel, CSV and images.",
          "I matched bank credits to receipts by reference and amount, with duplicate detection.",
        ],
      },
      {
        title: "Verification workflow",
        badge: "Review",
        description: "I built a guided checklist for staff to approve or return each document and payment.",
        points: ["I kept a full audit log so verification decisions can be traced."],
      },
      {
        title: "University processing",
        badge: "Submission",
        description: "I built university-specific export templates with a drag-and-drop column editor and live preview.",
        points: [
          "I made each batch generate an Excel sheet and a document zip organised by university, course and application.",
          "I added manual enrollment-number entry and bulk uploads from Excel.",
        ],
      },
      {
        title: "Roles & security",
        badge: "Access",
        description: "I implemented Super Admin, Admin and LSC centre roles with session authentication, bcrypt and centre-scoped data access.",
        points: [
          "I used private, versioned Backblaze B2 storage through the S3 API, with signed file links.",
          "I used PostgreSQL on Neon with Drizzle ORM, and Upstash Redis for caching and sessions.",
        ],
      },
      {
        title: "Architecture & testing",
        badge: "Engineering",
        description: "I organised the application as an npm-workspaces monorepo with shared Zod schemas and TypeScript types, deployed on Render.",
        points: [
          "I tested the backend with Vitest and in-memory PostgreSQL through PGlite.",
          "I tested browser workflows with Playwright.",
        ],
      },
    ],
  },
  {
    id: "obsera",
    title: "OBSERA",
    listTitle: "Obsera",
    category: "Enterprise ERP & Operations Platform",
    tagline: "One platform replacing an academy group's legacy software — HR, admissions, payroll and attendance.",
    poster: "/posters/obsera.jpg",
    video: "/video/Obsera.mp4",
    accent: "#e2338f",
    device: "laptop",
    role: "Full Stack Architecture & Systems Engineering",
    credits: "Development: Anees Aboobacker — XY-NEX / ALANS",
    locationYear: "Kerala, India © 2026",
    year: "2026",
    liveUrl: "https://github.com/ANESSABO0421",
    liveLabel: "Source",
    description:
      "Obsera is an enterprise-grade ERP, operations, and management platform built for an educational academy conglomerate (ALANS, XY-NEX, Aide, Malabar, Lumen, SGS).",
    about:
      "An enterprise-grade ERP, operations, and management platform built for an educational academy conglomerate operating brands including ALANS Academy, XY-NEX, Aide, Malabar, Lumen, and Southeast Global Skillvarsity (SGS). Built to replace legacy academy software (DSMS), Obsera centralizes human resources, multi-brand student admissions and accounting ledgers, studio recording sessions for faculty, field marketing pipelines, geofenced biometric/GPS attendance, automated 3-tier leave workflows, and multi-channel communications across regional offices in Calicut, Malappuram, and Kasargod.",
    highlights: [
      "Multi-brand student admissions & financial ledgers with split fee buckets, EMI tracking, and accountant verification.",
      "Dual-layer attendance access control combining company Wi-Fi IP locking with GPS geofencing across multiple branch coordinates.",
      "Automated 11:00 PM auto-checkout cron routines and overdue EMI payment warnings via node-cron.",
      "3-tier hierarchical leave approval engine (Department Head → HR Manager → CEO / Super Admin).",
      "Faculty & recording studio management across 3 studios with deliverable PPT/notes verification and hourly compensation engine.",
      "Zero-trust media security with Backblaze B2 private object storage and AWS S3 SDK v3 15-minute presigned URLs.",
      "Multi-branch regional scoping (Calicut, Malappuram, Kasargod) with JWT-authenticated Socket.IO room multicasting.",
    ],
    stack: [
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Socket.io",
      "Tailwind CSS",
      "Vite",
      "Backblaze B2",
      "node-cron",
      "JWT Auth",
      "Recharts",
      "TypeScript",
    ],
    modules: [
      {
        title: "Student Admissions & Multi-Brand Financial Ledger",
        badge: "Admissions & Accounts",
        description:
          "Multi-brand admission engine supporting XYNEX, ALANS, AIDE, MALABAR, LUMEN, and SGS. Features split admission/course fee buckets, flexible 1-to-4 EMI payment schedules, private payment proof uploads, and automated overdue installment alerts.",
        points: [
          "Configurable fee structures and EMI schedules per academy brand.",
          "Accountant payment verification workflow before admission confirmation.",
          "Daily automated cron alerts 3 days, 2 days, and 1 day before installment due dates.",
          "Student document & ID verification with QR codes and client-side PDF receipts.",
        ],
      },
      {
        title: "Geofenced GPS & Biometric Attendance",
        badge: "Operations & HR",
        description:
          "Dual-layer attendance access control validating employee GPS coordinates against configured office perimeters (Calicut, Malappuram, Kasargod) alongside company Wi-Fi IP restrictions.",
        points: [
          "Real-time GPS coordinate radius check within office boundaries (50m–100m perimeter).",
          "Late check-in justification workflows with HR and Admin review steps.",
          "Automated 11:00 PM node-cron checkout to close unattended daily sessions.",
        ],
      },
      {
        title: "Faculty & Recording Studio Management",
        badge: "Academic Production",
        description:
          "Dedicated scheduling engine for Studios 1, 2, and 3. Faculty reserve studio slots with subject and module tags, while the Production Head verifies chapter slide decks and class notes before clearing session hours for payroll.",
        points: [
          "Studio 1, 2, and 3 booking calendar with conflict prevention and slot locking.",
          "Deliverable verification: class PPTs and notes required before sign-off.",
          "Automated hourly compensation (base ₹400/hr) and Travel Allowance (TA) calculations.",
        ],
      },
      {
        title: "3-Tier Hierarchical Leave Management",
        badge: "HR & Compliance",
        description:
          "Sequential multi-level leave approval workflow enforcing department quotas, half-day / full-day deductions, and medical document attachments.",
        points: [
          "Sequential multi-level approval: Department Head → HR Manager → Super Admin.",
          "Leave quota engine tracking monthly and annual paid-leave allowances.",
          "Direct synchronization with employee attendance ledgers and payroll deductions.",
        ],
      },
      {
        title: "Staff & Faculty Payroll Automation",
        badge: "Payroll & Finance",
        description:
          "Automated salary computation engine generating monthly pay slips for salaried administrative staff and hourly-compensated studio faculty.",
        points: [
          "Net salary calculation factoring base allowances, unpaid leaves, and advance deductions.",
          "Studio hour aggregation and dynamic hourly payout ledgers for course instructors.",
          "Client-side PDF payslip generation and employee portal downloads.",
        ],
      },
      {
        title: "Marketing & Centre Lead Pipeline",
        badge: "Business Development",
        description:
          "Institutional outreach and school/college tie-up tracking across 8 progressive stages from initial sourcing to SGS certification.",
        points: [
          "Lifecycle tracking: New → Visit → Interested → Application → SRC Fee → SGS → Certificate.",
          "Field BDO visit assignment and telecalling follow-up queues.",
          "Monthly target tracking for outreach leads, visits, and partner certifications.",
        ],
      },
      {
        title: "Communication Center & Emergency Notices",
        badge: "Communications",
        description:
          "Centralized broadcast system sending modal notices to staff departments and dispatching batched email campaigns to students.",
        points: [
          "Mandatory acknowledgment modal notices for Sales and Admin staff.",
          "Targeted student mass mailer filtered by academy entity, course, and batch.",
          "Asynchronous queue processing with live delivery progress updates.",
        ],
      },
      {
        title: "Enterprise Cloud Security & Private Storage",
        badge: "Security & Cloud",
        description:
          "Zero-trust media architecture with Backblaze B2 and AWS S3 SDK v3 presigned URLs, paired with defense-in-depth API hardening.",
        points: [
          "Time-limited (15-min) presigned URLs for Aadhaar, CVs, and payment proofs.",
          "API hardening: Helmet, express-mongo-sanitize, and express-rate-limit.",
          "JWT authentication with regional and user-scoped Socket.IO multicasting.",
        ],
      },
    ],
    rolesMatrix: [
      {
        role: "Admin / CEO",
        badge: "Super Admin",
        scope: "Unrestricted system-wide visibility, company policies, geofencing coordinates, audit logs, and global payroll approvals.",
      },
      {
        role: "HR Manager",
        badge: "Human Resources",
        scope: "Staff onboarding, GPS attendance oversight, multi-branch holidays, leave reviews, and employee/faculty payroll computations.",
      },
      {
        role: "Accountant",
        badge: "Finance & Accounts",
        scope: "Verifies student fee payment proofs (Cash/Online/EMI), confirms admissions, and finalizes salary disbursements.",
      },
      {
        role: "Department Heads",
        badge: "Operations & Depts",
        scope: "Production Head (studio oversight, deliverable approvals), Sales Head (admissions ledger), Marketing Head (lead quotas).",
      },
      {
        role: "Employee / BDO",
        badge: "Staff & Field",
        scope: "Daily attendance punch-in, tasks, student admission form submission, sales reports, and centre lead outreach.",
      },
      {
        role: "Faculty",
        badge: "Instructors",
        scope: "Books recording studio slots, registers syllabus completion, submits notes and PPTs, and tracks hourly earnings.",
      },
      {
        role: "Referral Agent",
        badge: "External Partners",
        scope: "External educational partners submitting student and SGS admission applications, tracking commissions.",
      },
    ],
  },
  {
    id: "spendova",
    title: "SPENDOVA",
    listTitle: "Spendova",
    category: "React Native / AI Mobile",
    tagline: "Speak a transaction, get an insight — a voice-first expense tracker with Gemini analytics.",
    poster: "/posters/spendova.jpg",
    video: "/video/Spendova.mp4",
    accent: "#3d7bff",
    device: "phone",
    role: "Mobile App & REST API Development",
    credits: "Development: Anees Aboobacker",
    locationYear: "Kerala, India © 2026",
    year: "2026",
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
    tagline: "A home for the Ultras — standings, fixtures, galleries and news the club runs itself.",
    poster: "/posters/malappuram-fc.jpg",
    video: "/video/Ultrasmalappuram.mp4",
    accent: "#e5322d",
    device: "laptop",
    role: "Full Stack Development",
    credits: "Development: Anees Aboobacker — SkiaFlow",
    locationYear: "Malappuram, Kerala © 2026",
    year: "2026",
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
    tagline: "A construction company's showroom and lead engine — SEO-first, set in motion with GSAP.",
    poster: "/posters/kriscorp.jpg",
    video: "/video/Kriscorp.mp4",
    accent: "#e0663a",
    device: "laptop",
    role: "Full Stack Development & SEO",
    credits: "Development: Anees Aboobacker — SkiaFlow",
    locationYear: "Kerala, India © 2026",
    year: "2026",
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
    tagline: "Paste code, get a scored review — Claude-powered analysis with a history you can come back to.",
    poster: "/posters/devpulse.jpg",
    video: "/video/Devpulse.mp4",
    accent: "#3ad0e6",
    device: "laptop",
    role: "Full-Stack Development & AI Integration",
    credits: "Development: Anees Aboobacker",
    locationYear: "Kerala, India © 2026",
    year: "2026",
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
    tagline: "An NSS unit's control room — live group chat, payments and certificates from one codebase.",
    accent: "#c9fd34",
    device: "laptop",
    role: "Full Stack Development & Real-Time Systems",
    credits: "Development: Anees Aboobacker",
    locationYear: "Kerala, India © 2026",
    year: "2026",
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

export const allProjects: readonly ProjectEntry[] = projects;

export const projectDetails: Record<string, ProjectDetail> = Object.fromEntries(
  projects.map((project, index) => {
    const next = projects[(index + 1) % projects.length];
    return [
      project.id,
      {
        ...project,
        index: index + 1,
        total: projects.length,
        nextId: next.id,
        nextTitle: next.listTitle,
      },
    ];
  })
);

export const projectIds = projects.map((project) => project.id);

export function getProject(id: string): ProjectDetail | undefined {
  return projectDetails[id];
}
