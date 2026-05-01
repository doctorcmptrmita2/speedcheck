import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SpeedCheck.DEV — Free Internet Speed Test",
  description:
    "Test your internet speed instantly. Measure download speed, upload speed, ping, jitter, and connection quality with SpeedCheck.DEV.",
  keywords: [
    "speed test",
    "internet speed",
    "download speed",
    "upload speed",
    "ping test",
    "jitter",
    "bandwidth test",
  ],
  openGraph: {
    title: "SpeedCheck.DEV — Free Internet Speed Test",
    description:
      "Test your internet speed instantly. Measure download speed, upload speed, ping, jitter, and connection quality with SpeedCheck.DEV.",
    siteName: "SpeedCheck.DEV",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
