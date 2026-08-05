"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Magnetic from "@/components/ui/magnetic";
import { Download, GraduationCap, Award } from "lucide-react";

interface Role {
  company: string;
  location: string;
  title: string;
  period: string;
  current?: boolean;
  points: string[];
  stack: string[];
}

const roles: Role[] = [
  {
    company: "XY-NEX Learning & Alans Academy",
    location: "Kozhikode",
    title: "Full Stack Developer",
    period: "Jul 2026 — Present",
    current: true,
    points: [
      "Own the Leave Management module of a multi-tenant HRMS serving 6 user roles across 2 institutional branches, with a Department Head → HR → Admin approval workflow.",
      "Built a leave quota engine enforcing monthly and annual paid-leave caps with half-day splitting and week-off exclusion; resolved 15+ production defects across approval, rejection, and quota calculation.",
      "Re-architected 6,000+ lines of monolithic React components into 50+ modular components, custom hooks, and Context providers, and split a 571-line Express controller into controller and service layers.",
      "Implemented Socket.io notifications with room-scoped broadcasting and presence, plus node-cron jobs for reminders and automated daily attendance closing.",
    ],
    stack: ["React.js", "Node.js", "Express.js", "MongoDB", "Socket.io", "node-cron"],
  },
  {
    company: "SkiaFlow",
    location: "Remote",
    title: "Founder & Full Stack Developer",
    period: "Apr 2026 — Present",
    current: true,
    points: [
      "Founded a freelance software studio and delivered 2 end-to-end client products — the Malappuram FC Ultras community platform and the KrisCorp corporate website.",
      "Architected REST APIs and JWT/RBAC authentication, and owned requirements gathering, deployment on Vercel and Render, and post-launch maintenance.",
    ],
    stack: ["Next.js", "React.js", "Node.js", "Express.js", "MongoDB", "Vercel"],
  },
  {
    company: "Necttos OPC Private Limited",
    location: "Pattambi",
    title: "Full Stack Developer",
    period: "Nov 2025 — Apr 2026",
    points: [
      "Built a Transfer Certificate generation module with Node.js and PDFKit, automating dynamic PDF creation and eliminating 100% of manual processing.",
      "Architected a React.js ERP frontend with reusable components, data-heavy tables, dashboards, and multi-step forms across 5+ feature modules, backed by an Alumni Management system using MongoDB aggregation pipelines.",
      "Designed RESTful APIs serving both React.js web and React Native mobile clients, and fixed a critical React Native form bug that let empty values overwrite existing records.",
    ],
    stack: ["React.js", "React Native", "Node.js", "MongoDB", "PDFKit"],
  },
  {
    company: "Softroniics",
    location: "Perinthalmanna",
    title: "MERN Stack Developer Intern",
    period: "May 2025 — Nov 2025",
    points: [
      "Developed full-stack features with React.js and Node.js/Express.js, owning end-to-end delivery from API design to UI integration.",
      "Implemented JWT authentication, RBAC, and modular middleware routing; optimized MongoDB queries via compound indexing and integrated Socket.io real-time broadcasting.",
    ],
    stack: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT", "Socket.io"],
  },
];

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".experience-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".experience-timeline",
            start: "top 85%",
          },
        }
      );

      gsap.fromTo(
        ".experience-footer-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".experience-footer",
            start: "top 90%",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      id="experience"
      ref={containerRef}
      className="relative w-full bg-[#111112] py-20 sm:py-28 lg:py-32 text-white overflow-hidden"
    >
      <div className="px-6 sm:px-10 md:px-16 lg:px-24 max-w-7xl mx-auto w-full flex flex-col gap-12 sm:gap-16 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="flex flex-col gap-4">
            <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9fd34]" />
              Experience
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Where I&apos;ve Shipped.
            </h2>
          </div>

          <Magnetic actionStrength={0.25} hoverAreaPadding="p-0">
            <a
              href="/Anees_Resume.pdf"
              download="Anees-Aboobacker-Resume.pdf"
              className="group inline-flex items-center gap-3 text-xs font-semibold tracking-wider uppercase border border-zinc-700 rounded-full px-6 py-3.5 hover:bg-[#c9fd34] hover:text-black hover:border-transparent transition-all duration-300"
            >
              Download Resume
              <Download className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>
          </Magnetic>
        </div>

        {/* Timeline */}
        <div className="experience-timeline flex flex-col border-t border-zinc-800">
          {roles.map((role, index) => (
            <div
              key={index}
              className="experience-card group relative grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 py-8 sm:py-10 border-b border-zinc-800 transition-colors duration-300"
            >
              {/* Left rail: period */}
              <div className="md:col-span-4 flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      role.current ? "bg-[#c9fd34]" : "bg-zinc-700"
                    }`}
                  />
                  <span className="text-[11px] uppercase tracking-widest text-zinc-500 font-semibold">
                    {role.period}
                  </span>
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-medium tracking-tight text-zinc-100 transition-colors duration-300 group-hover:text-[#c9fd34]">
                  {role.company}
                </h3>
                <span className="text-xs text-zinc-500 font-light">
                  {role.location}
                </span>
              </div>

              {/* Right: role + bullets + stack */}
              <div className="md:col-span-8 flex flex-col gap-4">
                <span className="text-sm font-semibold text-zinc-300">
                  {role.title}
                </span>
                <ul className="flex flex-col gap-2.5">
                  {role.points.map((point, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm leading-relaxed text-zinc-400 font-light"
                    >
                      <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2 pt-1">
                  {role.stack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide rounded-full border border-white/[0.06] bg-white/[0.02] text-zinc-500"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Education & Certifications */}
        <div className="experience-footer grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="experience-footer-card flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
              <GraduationCap className="w-3.5 h-3.5 text-[#c9fd34]" />
              Education
            </span>
            <h4 className="font-heading text-lg font-medium text-zinc-100">
              B.Sc. Computer Science
            </h4>
            <p className="text-sm text-zinc-500 font-light leading-relaxed">
              GEMS Arts &amp; Science College, Ramapuram — Calicut University,
              Kerala · 2022 — 2025
            </p>
          </div>

          <div className="experience-footer-card flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
              <Award className="w-3.5 h-3.5 text-[#c9fd34]" />
              Certifications &amp; Languages
            </span>
            <h4 className="font-heading text-lg font-medium text-zinc-100">
              AI Hackathon Participant
            </h4>
            <p className="text-sm text-zinc-500 font-light leading-relaxed">
              Softroniics, Perinthalmanna (2025) · English (Fluent), Malayalam
              (Native), Hindi (Conversational)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
