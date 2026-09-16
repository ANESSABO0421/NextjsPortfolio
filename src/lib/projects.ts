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
  modules?: ProjectModule[];
  rolesMatrix?: ProjectRolePersona[];
}

export interface ProjectDetail extends ProjectEntry {
  nextId: string;
  nextTitle: string;
}

// Ordered the same way the works list renders them; "next case" wraps around.
const projects: ProjectEntry[] = [
  {
    id: "obsera",
    title: "OBSERA",
    listTitle: "Obsera",
    category: "Enterprise ERP & Operations Platform",
    src: "/project-1.png",
    video: "/video/Obsera.mp4",
    device: "laptop",
    role: "Full Stack Architecture & Systems Engineering",
    credits: "Development: Anees Aboobacker — XY-NEX / ALANS",
    locationYear: "Kerala, India © 2026",
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
