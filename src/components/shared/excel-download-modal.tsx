"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

interface ExcelDownloadModalProps {
  calculatorId: string;
  open: boolean;
  onClose: () => void;
}

export function ExcelDownloadModal({ calculatorId, open, onClose }: ExcelDownloadModalProps) {
  const t = useTranslations("excel");
  const [form, setForm] = useState({
    firstName: "",
    surname: "",
    email: "",
    city: "",
    country: "",
  });
  const [eulaAccepted, setEulaAccepted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    else if (!open && el.open) el.close();
  }, [open]);

  const handleClose = () => {
    setStatus("idle");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/excel-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, calculatorId, eulaAccepted }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const fieldClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-sienna focus:outline-none focus:ring-1 focus:ring-sienna";
  const labelClass = "block text-xs font-medium text-gray-600 mb-1";

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      className="backdrop:bg-black/50 bg-transparent p-0 m-auto max-w-md w-full"
      aria-label={t("modalTitle")}
    >
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-sienna to-orange-600 px-6 py-4">
          <h2 className="text-white text-lg font-semibold">{t("modalTitle")}</h2>
          <p className="text-white/80 text-sm mt-0.5">{t("modalSubtitle")}</p>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {status === "success" ? (
            <div className="text-center py-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-900 font-medium">{t("successMessage")}</p>
              <button
                onClick={handleClose}
                className="mt-4 px-5 py-2 bg-sienna text-white text-sm font-medium rounded-lg hover:bg-sienna/90 transition-colors"
              >
                {t("close")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>{t("fieldFirstName")}</label>
                  <input
                    type="text"
                    required
                    className={fieldClass}
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t("fieldSurname")}</label>
                  <input
                    type="text"
                    required
                    className={fieldClass}
                    value={form.surname}
                    onChange={(e) => setForm({ ...form, surname: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>{t("fieldEmail")}</label>
                <input
                  type="email"
                  required
                  className={fieldClass}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>{t("fieldCity")}</label>
                  <input
                    type="text"
                    className={fieldClass}
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t("fieldCountry")}</label>
                  <input
                    type="text"
                    className={fieldClass}
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                  />
                </div>
              </div>

              {/* EULA */}
              <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={eulaAccepted}
                  onChange={(e) => setEulaAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-sienna focus:ring-sienna"
                />
                <span>
                  {t("eulaLabel")}{" "}
                  <Link
                    href="/eula"
                    target="_blank"
                    className="text-sienna underline hover:text-sienna/80"
                  >
                    {t("eulaLink")}
                  </Link>
                </span>
              </label>

              {status === "error" && (
                <p className="text-red-600 text-xs">{t("errorMessage")}</p>
              )}

              <button
                type="submit"
                disabled={!eulaAccepted || status === "sending"}
                className="w-full py-2.5 bg-gradient-to-r from-sienna to-orange-600 text-white text-sm font-semibold rounded-lg hover:from-sienna/90 hover:to-orange-600/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "sending" ? t("sending") : t("submitCta")}
              </button>
            </form>
          )}
        </div>
      </div>
    </dialog>
  );
}