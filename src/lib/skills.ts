import { allProjects } from "@/lib/projects";
import { roles } from "@/lib/experience";

export type ElementGroup = "interface" | "server" | "data" | "tooling";

export const groupLabels: Record<ElementGroup, string> = {
  interface: "UI",
  server: "API",
  data: "DATA",
  tooling: "OPS",
};

export interface StackElement {
  number: number;
  symbol: string;
  /** Must match the spelling used in project and role `stack` arrays. */
  name: string;
  group: ElementGroup;
  /** Brand colour — only used for the small brand mark in the readout. */
  color: string;
  note: string;
  usedFor: [string, string];
  /** Symbols of the elements this one is most often combined with. */
  bonds: string[];
}

// Numbered so M·E·R·N land on 01–04 — the compound the formula panel spells out.
export const elements: StackElement[] = [
  {
    number: 1, symbol: "Mg", name: "MongoDB", group: "data", color: "#00ED64",
    note: "Aggregation pipelines, compound indexing.",
    usedFor: ["Aggregation pipelines for alumni and analytics data", "Compound indexes to speed up hot queries"],
    bonds: ["Ex", "No", "Pg"],
  },
  {
    number: 2, symbol: "Ex", name: "Express.js", group: "server", color: "#e8e8e8",
    note: "Middleware, RBAC, controller/service split.",
    usedFor: ["JWT auth, RBAC and modular middleware routing", "Splitting large controllers into service layers"],
    bonds: ["No", "Mg", "Io"],
  },
  {
    number: 3, symbol: "Re", name: "React.js", group: "interface", color: "#61DAFB",
    note: "Component architecture, hooks, render performance.",
    usedFor: ["ERP & HRMS dashboards with 6 role-based views", "Refactoring 6,000+ lines into 50+ modular components"],
    bonds: ["Nx", "Rn", "Rx", "Tw"],
  },
  {
    number: 4, symbol: "No", name: "Node.js", group: "server", color: "#5FA04E",
    note: "REST APIs, service-layer design, background jobs.",
    usedFor: ["APIs serving both web and React Native clients", "node-cron jobs for reminders and attendance closing"],
    bonds: ["Ex", "Io", "Mg", "Dk"],
  },
  {
    number: 5, symbol: "Nx", name: "Next.js", group: "interface", color: "#ffffff",
    note: "App Router, server rendering, SEO-first builds.",
    usedFor: ["Client websites and community platforms", "SEO-friendly pages deployed on Vercel"],
    bonds: ["Re", "Tw", "Ts"],
  },
  {
    number: 6, symbol: "Ts", name: "TypeScript", group: "tooling", color: "#3178C6",
    note: "Typed contracts across the stack.",
    usedFor: ["Typed API contracts and shared models", "Safer refactors in larger codebases"],
    bonds: ["Re", "Nx", "No"],
  },
  {
    number: 7, symbol: "Rn", name: "React Native", group: "interface", color: "#61DAFB",
    note: "Cross-platform mobile apps with Expo.",
    usedFor: ["Voice-driven expense tracking on mobile", "ERP mobile forms backed by shared REST APIs"],
    bonds: ["Re", "No"],
  },
  {
    number: 8, symbol: "Tw", name: "Tailwind CSS", group: "interface", color: "#38BDF8",
    note: "Utility-first, design-system driven UI.",
    usedFor: ["Responsive layouts from 320px phones up", "Consistent design tokens — including this site"],
    bonds: ["Re", "Nx"],
  },
  {
    number: 9, symbol: "Io", name: "Socket.io", group: "server", color: "#c9fd34",
    note: "Real-time events, room-scoped broadcasting.",
    usedFor: ["Live HRMS notifications with presence", "Room-scoped broadcasting for real-time updates"],
    bonds: ["No", "Ex"],
  },
  {
    number: 10, symbol: "Pg", name: "PostgreSQL", group: "data", color: "#4169E1",
    note: "Relational schemas, indexed querying.",
    usedFor: ["Relational schemas for structured data", "Joins and indexed queries"],
    bonds: ["No", "Mg"],
  },
  {
    number: 11, symbol: "Rx", name: "Redux Toolkit", group: "interface", color: "#764ABC",
    note: "Predictable global state at scale.",
    usedFor: ["Global state for data-heavy ERP modules", "Slices for predictable, testable updates"],
    bonds: ["Re"],
  },
  {
    number: 12, symbol: "Dk", name: "Docker", group: "tooling", color: "#2496ED",
    note: "Containerized builds and environments.",
    usedFor: ["Reproducible local development setups", "Consistent builds across machines"],
    bonds: ["No"],
  },
];

export const mernSymbols = ["Mg", "Ex", "Re", "No"] as const;

export interface ElementUsage {
  projects: { id: string; title: string }[];
  roleCount: number;
}

// Derived from the project and role data rather than hand-maintained, so the
// "found in" counts can never disagree with the case studies themselves.
export const elementUsage: Record<string, ElementUsage> = Object.fromEntries(
  elements.map((element) => [
    element.symbol,
    {
      projects: allProjects
        .filter((project) => project.stack.includes(element.name))
        .map((project) => ({ id: project.id, title: project.listTitle })),
      roleCount: roles.filter((role) => role.stack.includes(element.name)).length,
    },
  ])
);

export const projectTotal = allProjects.length;
export const roleTotal = roles.length;
