"use client";

import { useState } from "react";
import { PostList } from "./post-list";
import { CalculatorConfig } from "./calculator-config";
import { SeoToolkit } from "./seo-toolkit";
import { SemDashboard } from "./sem-dashboard";
import { LeadsPanel } from "./leads-panel";

type Tab = "posts" | "calculators" | "seo" | "sem" | "leads";

const TABS: { id: Tab; label: string }[] = [
  { id: "posts", label: "Posts" },
  { id: "calculators", label: "Calculators" },
  { id: "seo", label: "SEO" },
  { id: "sem", label: "SEM" },
  { id: "leads", label: "Leads" },
];

export function AdminLayout() {
  const [activeTab, setActiveTab] = useState<Tab>("posts");

  return (
    <div className="min-h-screen bg-ink">
      <div className="w-full max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-text-primary">Admin Dashboard</h1>
          <button
            onClick={() => {
              localStorage.removeItem("admin_auth");
              localStorage.removeItem("admin_password");
              window.location.reload();
            }}
            className="text-xs text-text-secondary hover:text-loss font-mono px-3 py-1 rounded border border-border"
          >
            Sign out
          </button>
        </div>

        <div className="flex gap-1 border-b border-border mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-mono transition-colors ${
                activeTab === tab.id
                  ? "text-gain border-b-2 border-gain bg-gain/10"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div>
          {activeTab === "posts" && <PostList />}
          {activeTab === "calculators" && <CalculatorConfig />}
          {activeTab === "seo" && <SeoToolkit />}
          {activeTab === "sem" && <SemDashboard />}
          {activeTab === "leads" && <LeadsPanel />}
        </div>
      </div>
    </div>
  );
}