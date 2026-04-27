import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { generateSiteJsonLd } from "@/lib/seo";
import { SiteNav } from "@/components/shared/site-nav";
import { PageTransition } from "@/components/shared/page-transition";
import { AuthProvider } from "@/components/shared/auth-provider";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "c7xai — The Truth About Your Money",
  description: "Old rules of money are broken. Here are the real ones. Inflation-adjusted, tax-aware financial clarity for India.",
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const siteSchemas = generateSiteJsonLd();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        {siteSchemas.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            // JSON-LD schemas are static server-generated data, not user input
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body className="min-h-full flex flex-col bg-ink text-text-primary">
        <AuthProvider>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <SiteNav />
            <PageTransition>{children}</PageTransition>
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}