"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function StickyMobileCta() {
  const t = useTranslations("home");
  const [visible, setVisible] = useState(false);
  const [pulsed, setPulsed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const pastHero = window.scrollY > 400;
      setVisible(pastHero);
      if (pastHero && !pulsed) setPulsed(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pulsed]);

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-navy border-t border-white/10 ${
        pulsed ? "animate-[pulse-cta_2s_ease-in-out_1]" : ""
      }`}
    >
      <div className="flex items-center justify-center px-4 h-14">
        <Link
          href="/sip-simulator"
          aria-label={t("heroCta")}
          className="flex-1 h-10 flex items-center justify-center bg-sienna text-white text-base font-semibold rounded hover:bg-sienna/90 transition-colors"
        >
          {t("heroCta")}
        </Link>
      </div>
      <style>{`
        @keyframes pulse-cta {
          0%, 100% { box-shadow: 0 -2px 0 rgba(216,64,14,0); }
          50% { box-shadow: 0 -4px 16px rgba(216,64,14,0.35); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[pulse-cta_2s_ease-in-out_1\\] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}