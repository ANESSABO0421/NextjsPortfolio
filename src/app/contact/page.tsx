"use client";

import React, { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Magnetic from "@/components/ui/magnetic";
import Header from "@/components/layout/header";
import { useTransition } from "@/components/providers/transition-provider";
import { useLenis } from "@/components/providers/smooth-scroll-provider";
import { ArrowDownLeft, ArrowLeft, Send } from "lucide-react";

export default function ContactPage() {
  const { transitionTo } = useTransition();
  const { lenis } = useLenis();

  // Form State
  const [form, setForm] = useState({
    name: "",
    email: "",
    org: "",
    message: "",
  });
  const [selectedService, setSelectedService] = useState<string>("Development");

  const services = useMemo(() => ["Design", "Development", "Motion Design", "WebGL / 3D", "Full-Stack"], []);

  // Form Handlers
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleServiceSelect = useCallback((service: string) => {
    setSelectedService(service);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you ${form.name || "there"}! Your message for ${selectedService} has been sent.`);
    setForm({ name: "", email: "", org: "", message: "" });
  }, [form, selectedService]);

  const handleHomeClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    transitionTo("/", "Home");
  }, [transitionTo]);

  return (
    <main className="relative min-h-screen bg-[#0f0f10] text-white font-sans selection:bg-[#c9fd34] selection:text-black">
      {/* 1. Global Navigation header (mix-blend-difference automatically turns links white/black) */}
      <Header />

      {/* 2. Page Content Wrapper */}
      <div className="px-6 sm:px-12 md:px-24 pt-36 pb-24 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        
        {/* Left Column: Form and Main Header Title */}
        <div className="lg:col-span-8 flex flex-col gap-16">
          
          {/* Back Home link */}
          <a
            href="/"
            onClick={handleHomeClick}
            className="group inline-flex items-center gap-2 text-xs tracking-wider uppercase text-zinc-500 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
            Go Back
          </a>

          {/* Form Header */}
          <div className="overflow-hidden">
            <h1 className="font-heading text-5xl sm:text-7xl font-bold uppercase tracking-tight leading-[0.9] text-zinc-100 max-w-2xl">
              Let&apos;s start a <br />
              project together
            </h1>
          </div>

          {/* Multi-Step Planner Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-12 sm:gap-16 pt-8">
            
            {/* 01. Name */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-12 items-baseline border-b border-zinc-800 pb-6 sm:pb-8">
              <span className="text-xs font-mono text-zinc-600">01</span>
              <div className="flex-1 w-full flex flex-col gap-2">
                <label className="text-sm font-medium text-zinc-400">What&apos;s your name?</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="John Doe *"
                  required
                  className="w-full bg-transparent border-none text-zinc-100 placeholder-zinc-700 text-lg sm:text-2xl font-light focus:outline-none focus:ring-0 py-2"
                />
              </div>
            </div>

            {/* 02. Email */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-12 items-baseline border-b border-zinc-800 pb-6 sm:pb-8">
              <span className="text-xs font-mono text-zinc-600">02</span>
              <div className="flex-1 w-full flex flex-col gap-2">
                <label className="text-sm font-medium text-zinc-400">What&apos;s your email?</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="john@doe.com *"
                  required
                  className="w-full bg-transparent border-none text-zinc-100 placeholder-zinc-700 text-lg sm:text-2xl font-light focus:outline-none focus:ring-0 py-2"
                />
              </div>
            </div>

            {/* 03. Organization */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-12 items-baseline border-b border-zinc-800 pb-6 sm:pb-8">
              <span className="text-xs font-mono text-zinc-600">03</span>
              <div className="flex-1 w-full flex flex-col gap-2">
                <label className="text-sm font-medium text-zinc-400">What&apos;s your organization?</label>
                <input
                  type="text"
                  name="org"
                  value={form.org}
                  onChange={handleInputChange}
                  placeholder="John Doe Ltd."
                  className="w-full bg-transparent border-none text-zinc-100 placeholder-zinc-700 text-lg sm:text-2xl font-light focus:outline-none focus:ring-0 py-2"
                />
              </div>
            </div>

            {/* 04. Service Selector */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-12 items-baseline border-b border-zinc-800 pb-8 sm:pb-12">
              <span className="text-xs font-mono text-zinc-600">04</span>
              <div className="flex-1 w-full flex flex-col gap-4">
                <label className="text-sm font-medium text-zinc-400">What services are you looking for?</label>
                <div className="flex flex-wrap gap-2.5 pt-2">
                  {services.map((service, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleServiceSelect(service)}
                      className={`px-5 py-2.5 text-xs font-semibold rounded-full border tracking-wide transition-all duration-300 ${
                        selectedService === service
                          ? "bg-white text-black border-transparent scale-105"
                          : "bg-transparent text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-500"
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 05. Message */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-12 items-baseline border-b border-zinc-800 pb-6 sm:pb-8 relative">
              <span className="text-xs font-mono text-zinc-600">05</span>
              <div className="flex-1 w-full flex flex-col gap-2">
                <label className="text-sm font-medium text-zinc-400">Your message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleInputChange}
                  placeholder="Hello Anees, can you help me with... *"
                  required
                  rows={4}
                  className="w-full bg-transparent border-none text-zinc-100 placeholder-zinc-700 text-lg sm:text-2xl font-light focus:outline-none focus:ring-0 py-2 resize-none"
                />
              </div>

              {/* Massive Magnetic Circular Submit Button floats over the dividing line */}
              <div className="absolute right-0 bottom-[-60px] sm:bottom-[-80px] z-20">
                <Magnetic actionStrength={0.35} hoverAreaPadding="p-0">
                  <button
                    type="submit"
                    className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[#3c5df6] text-white flex flex-col items-center justify-center gap-1 hover:scale-105 transition-transform duration-300 shadow-2xl font-heading tracking-widest text-[9px] font-extrabold uppercase"
                  >
                    <span>Send it!</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </Magnetic>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Profile Portrait & Details */}
        <div className="lg:col-span-4 flex flex-col gap-12 lg:pt-28">
          
          {/* Portrait and Layout Arrow */}
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 rounded-full overflow-hidden relative border border-zinc-800 shadow-xl bg-zinc-900">
              <Image
                src="/anees-aboo3.png"
                alt="Anees Aboobacker"
                fill
                sizes="80px"
                className="object-cover object-center"
              />
            </div>
            <ArrowDownLeft className="w-8 h-8 text-zinc-600 stroke-[1.5px] animate-pulse" />
          </div>

          {/* Contact Details Column */}
          <div className="flex flex-col gap-4 border-t border-zinc-800 pt-8 mt-4">
            <span className="text-[10px] tracking-wider uppercase text-zinc-500 font-bold">Contact Details</span>
            <div className="flex flex-col gap-1.5 text-sm font-light text-zinc-300">
              <a href="mailto:aneesaboo123@gmail.com" className="hover:text-white transition-colors">
                aneesaboo123@gmail.com
              </a>
              <a href="tel:+917592089970" className="hover:text-white transition-colors">
                +91 75920 89970
              </a>
            </div>
          </div>

          {/* Business Details Column */}
          <div className="flex flex-col gap-4 border-t border-zinc-800 pt-8">
            <span className="text-[10px] tracking-wider uppercase text-zinc-500 font-bold">Business Details</span>
            <div className="flex flex-col gap-1 text-sm font-light text-zinc-400">
              <p>Anees Aboobacker</p>
              <p>Kerala, India</p>
            </div>
          </div>
        </div>
      </div>

      {/* Spacing spacer */}
      <div className="h-36 sm:h-48" />

      {/* 3. Footer Section (VERSION, CLOCK, SOCIALS) */}
      <footer className="border-t border-zinc-900 bg-[#0c0c0d] py-10 px-6 sm:px-12 md:px-24">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-6 text-zinc-500 text-[10px] tracking-wider uppercase font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-600">Version</span>
            <p className="text-zinc-400 font-medium">2026 © Edition</p>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-zinc-600">Local Time</span>
            <p className="text-zinc-300 font-mono font-medium">
              12:12 PM IST
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a href="https://www.linkedin.com/in/anees-aboobacker-4842b627a/" target="_blank" className="hover:text-white transition-colors text-zinc-400">
              LinkedIn
            </a>
            <a href="https://github.com/ANESSABO0421" target="_blank" className="hover:text-white transition-colors text-zinc-400">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
