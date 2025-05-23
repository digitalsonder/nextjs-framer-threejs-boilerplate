'use client'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Lenis from "lenis"
import { useEffect } from "react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
    })

    return () => {
      lenis.destroy()
    }
  }, [])
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
