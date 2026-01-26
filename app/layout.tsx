import type React from "react"
import type { Metadata } from "next"
import { DM_Sans, Playfair_Display, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

// Google Fonts setup with CSS variables
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" })

// Metadata for the app
export const metadata: Metadata = {
  title: "LED Lights Supplier & Lighting fixtures in the Philippines | Ecoshift Corp.",
  description: "Emails that write themselves. One sentence from you. Perfect replies forever.",
  icons: {
    icon: "/favicon.ico",          // Default favicon
    shortcut: "/images/green.png", // Modern browsers PNG shortcut
    apple: "/images/green.png",    // Apple touch / PWA icon
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${playfair.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}
