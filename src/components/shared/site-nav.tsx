import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Calculators" },
  { href: "/blog", label: "Blog" },
];

export function SiteNav() {
  return (
    <nav className="w-full border-b border-border bg-ink/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-11 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight hover:text-gain transition-colors"
        >
          Financial Simulators
        </Link>
        <div className="flex items-center gap-5">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-xs font-mono text-text-secondary hover:text-gain transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}