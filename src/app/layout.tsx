import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { generateSiteJsonLd } from "@/lib/seo";
import { SiteNav } from "@/components/shared/site-nav";
import { PageTransition } from "@/components/shared/page-transition";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIP Simulator — Real Returns, No Marketing",
  description: "Inflation-adjusted, tax-aware SIP projection tool for Indian investors. Privacy-first, client-side computation.",
  other: {
    "geo.region": "IN",
    "geo.country": "IN",
    "language": "en-IN",
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-IN": "/",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSchemas = generateSiteJsonLd();

  return (
    <html
      lang="en-IN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {siteSchemas.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            // Content is server-generated from our own static config — never user input.
            // This is the standard Next.js pattern for injecting structured data.
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body className="min-h-full flex flex-col bg-ink text-text-primary">
        <SiteNav />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}