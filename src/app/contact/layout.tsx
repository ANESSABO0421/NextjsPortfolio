import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Anees Aboobacker for full-stack MERN development, web, and mobile app projects.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact — Anees Aboobacker",
    description:
      "Get in touch with Anees Aboobacker for full-stack MERN development, web, and mobile app projects.",
    url: "/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
