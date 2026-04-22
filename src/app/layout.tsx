import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { generateSiteJsonLd } from "@/lib/seo";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSchema = generateSiteJsonLd();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          // Content is server-generated from our own config — not user input.
          // Standard Next.js pattern for structured data injection.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-ink text-text-primary">
        {children}
      </body>
    </html>
  );
}