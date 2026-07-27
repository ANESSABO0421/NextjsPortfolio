import type { Metadata, Viewport } from "next";
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
  metadataBase: new URL("https://anees-portofolio.vercel.app"),
  title: {
    default: "Anees Aboobacker - MERN Stack Developer",
    template: "%s | Anees Aboobacker",
  },
  description:
    "Portfolio of Anees Aboobacker, a Junior MERN Stack Developer building scalable web and mobile applications using MongoDB, Express.js, React.js, and Node.js.",
  keywords: [
    "Anees Aboobacker",
    "MERN Stack Developer",
    "React developer",
    "Node.js developer",
    "Next.js portfolio",
    "Full stack developer",
  ],
  authors: [{ name: "Anees Aboobacker" }],
  creator: "Anees Aboobacker",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Anees Aboobacker - MERN Stack Developer",
    description:
      "Junior MERN Stack Developer building scalable web and mobile applications.",
    url: "/",
    siteName: "Anees Aboobacker Portfolio",
    images: [
      {
        url: "/anees-aboo3.png",
        width: 1200,
        height: 1200,
        alt: "Anees Aboobacker portrait",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anees Aboobacker - MERN Stack Developer",
    description:
      "Junior MERN Stack Developer building scalable web and mobile applications.",
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111112",
  colorScheme: "dark",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Anees Aboobacker",
  jobTitle: "MERN Stack Developer",
  url: "https://anees-portofolio.vercel.app",
  image: "https://anees-portofolio.vercel.app/anees-aboo3.png",
  sameAs: [
    "https://linkedin.com/in/anees-aboobacker",
    "https://github.com/ANESSABO0421",
  ],
  knowsAbout: [
    "MongoDB",
    "Express.js",
    "React.js",
    "Node.js",
    "Next.js",
    "React Native",
    "TypeScript",
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
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
