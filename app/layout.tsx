import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { I18nProvider } from "@/lib/i18n"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "My Notes App",
  description: "A multilingual note-taking application with tags and search",
  generator: "v0.app",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "My Notes App",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "My Notes App",
    title: "My Notes App",
    description: "A multilingual note-taking application with tags and search",
  },
  twitter: {
    card: "summary",
    title: "My Notes App",
    description: "A multilingual note-taking application with tags and search",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="My Notes App" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="My Notes App" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icon-192.jpg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-192.jpg" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-192.jpg" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/icon-192.jpg" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <I18nProvider>{children}</I18nProvider>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
