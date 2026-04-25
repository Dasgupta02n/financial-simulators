import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Calculators" },
  { href: "/blog", label: "Blog" },
];

export function SiteNav() {
  return (
    <header className="w-full sticky top-0 z-50">
      <nav className="w-full bg-ink/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-xl font-bold tracking-tight text-white font-serif-display">
              c7<span className="text-sienna">xai</span>
            </span>
          </Link>
          <div className="flex items-center gap-8">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-text-secondary hover:text-sienna transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}