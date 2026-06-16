import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Michael Smith | Portfolio",
  description: "Creative Fullstack Founder and Scholar digital portfolio landing page.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-transparent text-text-primary selection:bg-text-primary/20 selection:text-text-primary">
        {children}
      </body>
    </html>
  );
}
