import { Link } from "@/i18n/navigation";
import type { CalculatorConfig } from "@/lib/seo";
import { generateCalculatorJsonLd } from "@/lib/seo";
import { ExcelDownloadRibbon } from "./excel-download-ribbon";

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

  // JSON-LD content is server-generated from static config files — not user input
  const jsonLdHtml = (obj: object) => ({ __html: JSON.stringify(obj) });

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdHtml(schema)}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdHtml(breadcrumbSchema)}
      />
      <main className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 pt-1 shrink-0">
          <nav className="flex items-center gap-2 text-xs text-text-secondary font-mono mb-1">
            <Link href="/" className="hover:text-sienna transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-text-primary">{config.name}</span>
          </nav>
        </div>
        <div className="w-full max-w-7xl mx-auto px-4 py-2 flex-1 min-h-0 overflow-auto pb-12">
          {children}
        </div>
      </main>
      <ExcelDownloadRibbon calculatorId={config.id} />
    </>
  );
}