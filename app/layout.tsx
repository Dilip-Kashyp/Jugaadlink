import type { Metadata } from "next";
import 'antd/dist/reset.css';
import "./globals.css";
import ReactQueryProvider from "./components/common/ReactQueryProvider";

import { ThemeProvider } from "./components/common/ThemeContext";

export const metadata: Metadata = {
  title: {
    default: "JugaadLink — Shrink. Track. Dominate.",
    template: "%s | JugaadLink",
  },
  description:
    "JugaadLink is the modern link management platform. Shorten URLs, track real-time analytics, protect links with passwords, and visualize traffic on a world map — all in one premium dashboard.",
  keywords: [
    "url shortener",
    "link shortener",
    "short link",
    "link management",
    "link analytics",
    "click tracking",
    "qr code generator",
    "url analytics",
    "link intelligence",
    "jugaadlink",
    "free url shortener",
    "custom short url",
  ],
  authors: [{ name: "JugaadLink Team" }],
  creator: "JugaadLink",
  publisher: "JugaadLink",
  metadataBase: new URL("https://jugaadlink.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jugaadlink.com",
    siteName: "JugaadLink",
    title: "JugaadLink — Shrink. Track. Dominate.",
    description:
      "The modern link management platform. Shorten URLs, track analytics, protect links, and visualize global traffic — all in one place.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JugaadLink — The Modern Link Intelligence Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JugaadLink — Shrink. Track. Dominate.",
    description:
      "The modern link management platform. Shorten URLs, track analytics, and visualize global traffic.",
    images: ["/og-image.png"],
    creator: "@jugaadlink",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://jugaadlink.com",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#6366f1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <ThemeProvider>
        <ReactQueryProvider>
          <body>
            {children}
          </body>
        </ReactQueryProvider>
      </ThemeProvider>
    </html>
  );
}
