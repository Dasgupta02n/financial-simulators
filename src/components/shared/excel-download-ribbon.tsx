"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ExcelDownloadModal } from "./excel-download-modal";

interface ExcelDownloadRibbonProps {
  calculatorId: string;
}

export function ExcelDownloadRibbon({ calculatorId }: ExcelDownloadRibbonProps) {
  const t = useTranslations("excel");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:bottom-0">
        <div
          className="bg-gradient-to-r from-sienna via-orange-600 to-sienna
            text-white px-4 py-2.5 flex items-center justify-between
            shadow-[0_-2px_12px_rgba(216,64,14,0.3)]"
        >
          <span className="text-sm font-medium truncate pr-3">
            {t("ribbonTitle")}
          </span>
          <button
            onClick={() => setModalOpen(true)}
            className="shrink-0 px-4 py-1.5 bg-white text-sienna text-sm font-semibold rounded-md
              hover:bg-gray-100 active:bg-gray-200 transition-colors shadow-sm"
            aria-label={t("ribbonCta")}
          >
            {t("ribbonCta")}
          </button>
        </div>
      </div>

      <ExcelDownloadModal
        calculatorId={calculatorId}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}