import Link from "next/link";
import type { CalculatorConfig } from "@/lib/seo";
import { generateCalculatorJsonLd } from "@/lib/seo";

const SITE_URL = "https://c7xai.in";

interface Props {
  config: CalculatorConfig;
  children: React.ReactNode;
}

export function CalculatorPageShell({ config, children }: Props) {
  const schemas = generateCalculatorJsonLd(config);

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
      <main className="flex-1 flex flex-col h-[calc(100vh-3.5rem-1.75rem)] overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 pt-1 shrink-0">
          <nav className="flex items-center gap-2 text-xs text-text-secondary font-mono mb-1">
            <Link href="/" className="hover:text-gain transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-text-primary">{config.name}</span>
          </nav>
        </div>
        <div className="w-full max-w-7xl mx-auto px-4 py-2 flex-1 min-h-0 overflow-auto">
          {children}
        </div>
      </main>
    </>
  );
}