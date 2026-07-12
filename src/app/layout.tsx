import type { Metadata } from "next";
import { Outfit, Syne } from "next/font/google";
import SmoothScrollProvider from "@/components/providers/smooth-scroll-provider";
import TransitionProvider from "@/components/providers/transition-provider";
import CustomCursor from "@/components/ui/custom-cursor";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://anessaboo.com"),
  title: {
    default: "Anessa Bo - Senior Frontend Architect & Interactive Developer",
    template: "%s | Anessa Bo",
  },
  description:
    "Portfolio of Anessa Bo, a senior frontend architect and interactive developer building fast, responsive, motion-rich digital experiences with Next.js, React, GSAP, and WebGL.",
  keywords: [
    "Anessa Bo",
    "frontend architect",
    "interactive developer",
    "Next.js portfolio",
    "React developer",
    "GSAP animation",
    "creative developer",
  ],
  authors: [{ name: "Anessa Bo" }],
  creator: "Anessa Bo",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Anessa Bo - Senior Frontend Architect & Interactive Developer",
    description:
      "Fast, responsive, motion-rich portfolio work across frontend architecture, interactive development, and premium web experiences.",
    url: "/",
    siteName: "Anessa Bo Portfolio",
    images: [
      {
        url: "/anees-aboo3.png",
        width: 1200,
        height: 1200,
        alt: "Anessa Bo portrait",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anessa Bo - Senior Frontend Architect & Interactive Developer",
    description:
      "Senior frontend architecture, interactive development, and high-performance motion design.",
    images: ["/anees-aboo3.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${syne.variable} h-full antialiased dark`}
    >
      <body className="min-h-full bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
        <SmoothScrollProvider>
          <TransitionProvider>
            <CustomCursor />
            {children}
          </TransitionProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
