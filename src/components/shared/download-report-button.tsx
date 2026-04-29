"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";

interface DownloadReportButtonProps {
  calculatorTitle: string;
  calculatorData: Record<string, string>;
}

export function DownloadReportButton({ calculatorTitle, calculatorData }: DownloadReportButtonProps) {
  const { data: session, status } = useSession() ?? { data: null, status: "unauthenticated" as const };
  const [eulaAccepted, setEulaAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleDownload = async () => {
    if (status !== "authenticated") {
      signIn();
      return;
    }

    if (!eulaAccepted) {
      setMessage("Please accept the terms to continue.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Capture lead
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: session?.user?.name ?? "",
          email: session?.user?.email ?? "",
          provider: session?.user?.email ? "google" : "github",
          calculator: calculatorTitle,
          eulaAccepted,
        }),
      });

      // Send report email
      const res = await fetch("/api/download-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: session?.user?.name ?? "",
          email: session?.user?.email ?? "",
          calculatorTitle,
          calculatorData,
          eulaAccepted,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("Report sent to your email!");
      } else {
        setMessage(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-3 bg-surface rounded-lg border border-border">
      <button
        onClick={handleDownload}
        disabled={loading}
        className="px-4 py-2 text-sm font-mono rounded-md bg-sienna text-white hover:bg-sienna/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Sending..." : status === "authenticated" ? "Download Report (Email)" : "Sign in to Download Report"}
      </button>

      {status === "authenticated" && (
        <label className="flex items-start gap-2 text-xs text-text-secondary cursor-pointer">
          <input
            type="checkbox"
            checked={eulaAccepted}
            onChange={(e) => setEulaAccepted(e.target.checked)}
            className="mt-0.5 accent-sienna"
          />
          <span>
            I agree to the{" "}
            <a href="/eula" className="text-sienna underline" target="_blank">End User License Agreement</a>
            {" "}and{" "}
            <a href="/privacy" className="text-sienna underline" target="_blank">Privacy Policy</a>.
            My email will be used to send the report and may be stored for analytics.
          </span>
        </label>
      )}

      {message && (
        <p className={`text-xs font-mono ${message.includes("sent") ? "text-gain" : "text-loss"}`}>
          {message}
        </p>
      )}
    </div>
  );
}