import type { Metadata } from "next";
import { Inter, VT323 } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const vt323 = VT323({
  weight: "400",
  variable: "--font-vt323",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HANTA GRAVITY LIVE | Virus Tracker",
  description: "Global Hantavirus outbreak tracking system - 2026 Emergency Response",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${vt323.variable} antialiased selection:bg-primary selection:text-background relative`}>
        <div className="crt-overlay" />
        <div className="crt-flicker fixed inset-0 pointer-events-none z-[9998] opacity-[0.05] bg-primary/5" />
        {children}
      </body>
    </html>
  );
}
