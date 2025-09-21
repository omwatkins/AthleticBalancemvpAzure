import type React from "react"
import "./globals.css"
import Navigation from "@/components/navigation"

import { Suspense } from "react"

export const metadata = {
  title: "Athletic Balance - AI Coaching for Teen Athletes",
  description:
    "Science-based AI coaching for middle and high school athletes. Text-only sessions grounded in sports psychology, flow theory, and deliberate practice.",
  keywords: "AI coaching, teen athletes, sports psychology, athletic performance, mental training",
  authors: [{ name: "Athletic Balance" }],
  creator: "Athletic Balance",
  publisher: "Athletic Balance",
  robots: "index, follow",
  openGraph: {
    title: "Athletic Balance - AI Coaching for Teen Athletes",
    description: "Science-based AI coaching for middle and high school athletes",
    url: "https://athletic-balance.vercel.app",
    siteName: "Athletic Balance",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Athletic Balance - AI Coaching Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Athletic Balance - AI Coaching for Teen Athletes",
    description: "Science-based AI coaching for middle and high school athletes",
    images: ["/og-image.png"],
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className="bg-background text-foreground antialiased">
        <Suspense fallback={<div>Loading...</div>}>
          <Navigation />
          {children}
          
        </Suspense>
      </body>
    </html>
  )
}
