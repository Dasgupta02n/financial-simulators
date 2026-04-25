import type { Metadata } from "next";

const SITE_URL = "https://c7xai.in";
const SITE_NAME = "Financial Simulators";

export interface CalculatorConfig {
  id: string;
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  shortDescription: string;
  faq: { question: string; answer: string }[];
  howToSteps: { name: string; text: string }[];
}

export function generateCalculatorMetadata(config: CalculatorConfig): Metadata {
  return {
    title: config.metaTitle,
    description: config.metaDescription,
    openGraph: {
      title: config.metaTitle,
      description: config.metaDescription,
      url: `${SITE_URL}/${config.slug}`,
      siteName: SITE_NAME,
      type: "website",
    },
    alternates: {
      canonical: `/${config.slug}`,
      languages: {
        "en-IN": `/${config.slug}`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function generateCalculatorJsonLd(config: CalculatorConfig) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: config.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use ${config.name}`,
    step: config.howToSteps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: config.name,
    description: config.metaDescription,
    url: `${SITE_URL}/${config.slug}`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
  };

  return [faqSchema, howToSchema, webAppSchema];
}

export function generateSiteJsonLd() {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      "Real-return financial calculators for Indian investors. Zero PII, zero tracking, all math runs client-side.",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@financialsimulators.in",
      contactType: "customer support",
      availableLanguage: "English",
    },
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    description:
      "Real-return financial calculators for Indian investors. Zero PII, zero tracking, all math runs client-side.",
    url: SITE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
  };

  return [orgSchema, webAppSchema];
}