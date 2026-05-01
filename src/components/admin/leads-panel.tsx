"use client";

import { useState, useEffect } from "react";

interface Lead {
  timestamp: string;
  name: string;
  email: string;
  provider: string;
  calculator: string;
  eulaAccepted: boolean;
}

export function LeadsPanel() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/leads", { credentials: "include" });
        if (cancelled) return;
        if (!res.ok) {
          setError("Failed to fetch leads");
          setLeads([]);
          return;
        }
        const data = await res.json();
        if (cancelled) return;
        setLeads(data.leads ?? []);
      } catch {
        if (cancelled) return;
        setError("Network error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [retryKey]);

  function exportCSV() {
    if (leads.length === 0) return;

    const headers = ["Timestamp", "Name", "Email", "Provider", "Calculator", "EULA Accepted"];
    const rows = leads.map((l) => [
      l.timestamp,
      `"${l.name}"`,
      l.email,
      l.provider,
      `"${l.calculator}"`,
      l.eulaAccepted ? "Yes" : "No",
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `c7xai-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return <p className="text-text-secondary text-sm font-mono">Loading leads...</p>;
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-loss text-sm font-mono">{error}</p>
        <button onClick={() => { setLoading(true); setError(""); setRetryKey((k) => k + 1); }} className="text-xs text-gain underline">Retry</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary font-mono">{leads.length} lead{leads.length !== 1 ? "s" : ""} captured</p>
        <button
          onClick={exportCSV}
          disabled={leads.length === 0}
          className="px-3 py-1.5 text-xs font-mono rounded-md bg-gain text-ink hover:bg-gain/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Export CSV
        </button>
      </div>

      {leads.length === 0 ? (
        <p className="text-text-muted text-sm">No leads yet. Leads appear when users download reports.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="bg-surface text-text-secondary text-left">
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Source</th>
                <th className="px-3 py-2">Calculator</th>
                <th className="px-3 py-2">EULA</th>
              </tr>
            </thead>
            <tbody>
              {[...leads].reverse().map((lead, i) => (
                <tr key={i} className="border-t border-border hover:bg-surface-hover">
                  <td className="px-3 py-2 text-text-secondary whitespace-nowrap">
                    {new Date(lead.timestamp).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-3 py-2 text-text-primary">{lead.name}</td>
                  <td className="px-3 py-2 text-text-primary">{lead.email}</td>
                  <td className="px-3 py-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider bg-surface text-text-secondary">
                      {lead.provider}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-text-primary">{lead.calculator}</td>
                  <td className="px-3 py-2">{lead.eulaAccepted ? "✓" : "✗"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}