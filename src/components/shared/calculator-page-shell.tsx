import Link from "next/link";
import type { CalculatorConfig } from "@/lib/seo";
import { generateCalculatorJsonLd } from "@/lib/seo";

const SITE_URL = "https://financialsimulators.in";

interface Props {
  config: CalculatorConfig;
  children: React.ReactNode;
}

export function CalculatorPageShell({ config, children }: Props) {
  const schemas = generateCalculatorJsonLd(config);

  // BreadcrumbList schema for search engine rich results
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: config.name,
        item: `${SITE_URL}/${config.slug}`,
      },
    ],
  };

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Content is server-generated from our own config files — not user input.
          // This is the standard Next.js pattern for injecting structured data.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <script
        type="application/ld+json"
        // Server-generated breadcrumb from config — not user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-7xl mx-auto px-4 pt-4">
          <nav className="flex items-center gap-2 text-xs text-text-secondary font-mono mb-2">
            <Link href="/" className="hover:text-gain transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-text-primary">{config.name}</span>
          </nav>
        </div>
        <div className="w-full max-w-7xl mx-auto px-4 py-4">{children}</div>
        <footer className="w-full max-w-7xl mx-auto px-4 py-6 text-xs text-text-secondary border-t border-border mt-auto">
          <div className="flex items-center justify-between">
            <span>Zero PII. Zero tracking. Computed entirely client-side.</span>
            <Link href="/" className="hover:text-gain transition-colors font-mono">
              ← All calculators
            </Link>
          </div>
        </footer>
      </main>
    </>
  );
}
