"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { useState } from "react";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  hi: "हि",
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [switching, setSwitching] = useState<Locale | null>(null);

  const switchLocale = async (newLocale: Locale) => {
    if (switching || locale === newLocale) return;
    setSwitching(newLocale);
    try {
      router.replace(pathname, { locale: newLocale });
    } finally {
      setSwitching(null);
    }
  };

  return (
    <div className="flex items-center gap-0.5">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          disabled={switching !== null}
          className={`px-1.5 py-0.5 text-[10px] font-mono rounded transition-colors ${
            locale === loc
              ? "bg-sienna/10 text-sienna border border-sienna/30"
              : switching === loc
                ? "text-text-muted/50 border border-transparent"
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