"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  hi: "हि",
  mr: "मर",
  ta: "தம",
  te: "తె",
  pa: "ਪੰ",
  gu: "ગુ",
  bn: "বাং",
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: Locale) => {
    const segments = pathname.split("/");
    const currentLocale = segments[1];

    if (routing.locales.includes(currentLocale as Locale)) {
      segments[1] = newLocale;
    } else if (newLocale === "en") {
      // English is at root, no prefix needed
      router.push(pathname);
      return;
    } else {
      segments.splice(1, 0, newLocale);
    }

    router.push(segments.join("/"));
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