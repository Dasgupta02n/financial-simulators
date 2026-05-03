"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  hi: "हि",
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: Locale) => {
    const prefixPattern = new RegExp(`^/(${routing.locales.join("|")})(/|$)`);
    const strippedPath = pathname.replace(prefixPattern, "/") || "/";
    router.replace(strippedPath, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-0.5">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={`px-1.5 py-0.5 text-[10px] font-mono rounded transition-colors ${
            locale === loc
              ? "bg-sienna/10 text-sienna border border-sienna/30"
              : "text-text-muted hover:text-sienna hover:bg-surface-hover border border-transparent"
          }`}
          title={LOCALE_LABELS[loc]}
        >
          {LOCALE_LABELS[loc]}
        </button>
      ))}
    </div>
  );
}