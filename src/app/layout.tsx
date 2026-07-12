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
  title: "Anessa Bo — Senior Frontend Architect & Interactive Developer",
  description: "Immersive digital portfolio showcasing award-winning motion design, WebGL interactive engineering, and custom web architectures.",
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
