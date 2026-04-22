"use client";

import { useState, useEffect } from "react";

interface CalcConfig {
  id: string;
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  shortDescription: string;
  faq: { question: string; answer: string }[];
}

const CALCULATOR_IDS = [
  "sip", "emi", "tax", "accum", "fd", "swp", "fire", "ctc", "nps", "goal",
];

export function CalculatorConfig() {
  const [activeCalc, setActiveCalc] = useState(CALCULATOR_IDS[0]);
  const [config, setConfig] = useState<CalcConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch(`/api/admin/calculator-config/${activeCalc}`);
        const data = await res.json();
        setConfig(data);
      } catch {
        setConfig(null);
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    loadConfig();
  }, [activeCalc]);

  if (loading) {
    return <p className="text-text-secondary text-sm font-mono">Loading calculator config...</p>;
  }

  if (!config) {
    return <p className="text-text-secondary text-sm font-mono">Could not load calculator config.</p>;
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: `src/content/calculators/${activeCalc}.json`,
          content: JSON.stringify(config, null, 2),
          message: `feat(cms): update ${config!.name} config`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Config saved successfully!");
      } else {
        alert(`Failed to save: ${data.error ?? "Unknown error"}`);
      }
    } catch {
      alert("Failed to save config. Make sure GITHUB_TOKEN is configured.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h2 className="text-sm font-mono text-gain mb-4">Calculator Configuration</h2>
      <div className="flex gap-1 flex-wrap mb-4">
        {CALCULATOR_IDS.map((id) => (
          <button
            key={id}
            onClick={() => setActiveCalc(id)}
            className={`px-3 py-1.5 text-xs rounded-md font-mono transition-colors ${
              activeCalc === id
                ? "bg-gain/20 text-gain border border-gain/40"
                : "bg-border text-text-secondary border border-border hover:bg-border/80"
            }`}
          >
            {id}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-text-secondary mb-1">Meta Title</label>
          <input
            type="text"
            value={config.metaTitle}
            onChange={(e) => setConfig({ ...config, metaTitle: e.target.value })}
            className="w-full px-3 py-2 rounded-md bg-ink border border-border text-text-primary text-sm font-mono focus:outline-none focus:border-gain"
          />
          <span className="text-xs text-text-secondary">{config.metaTitle.length}/60</span>
        </div>

        <div>
          <label className="block text-xs font-mono text-text-secondary mb-1">Meta Description</label>
          <textarea
            value={config.metaDescription}
            onChange={(e) => setConfig({ ...config, metaDescription: e.target.value })}
            className="w-full px-3 py-2 rounded-md bg-ink border border-border text-text-primary text-sm font-mono focus:outline-none focus:border-gain resize-y"
            rows={3}
          />
          <span className="text-xs text-text-secondary">{config.metaDescription.length}/160</span>
        </div>

        <div>
          <label className="block text-xs font-mono text-text-secondary mb-1">Short Description</label>
          <textarea
            value={config.shortDescription}
            onChange={(e) => setConfig({ ...config, shortDescription: e.target.value })}
            className="w-full px-3 py-2 rounded-md bg-ink border border-border text-text-primary text-sm font-mono focus:outline-none focus:border-gain resize-y"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-text-secondary mb-1">FAQs</label>
          {config.faq.map((item, i) => (
            <div key={i} className="mb-3 p-3 rounded-md border border-border bg-ink">
              <input
                type="text"
                value={item.question}
                onChange={(e) => {
                  const newFaq = [...config.faq];
                  newFaq[i] = { ...newFaq[i], question: e.target.value };
                  setConfig({ ...config, faq: newFaq });
                }}
                placeholder="Question"
                className="w-full px-2 py-1 rounded bg-ink border border-border text-text-primary text-sm font-mono mb-1 focus:outline-none focus:border-gain"
              />
              <textarea
                value={item.answer}
                onChange={(e) => {
                  const newFaq = [...config.faq];
                  newFaq[i] = { ...newFaq[i], answer: e.target.value };
                  setConfig({ ...config, faq: newFaq });
                }}
                placeholder="Answer"
                className="w-full px-2 py-1 rounded bg-ink border border-border text-text-primary text-sm font-mono focus:outline-none focus:border-gain resize-y"
                rows={2}
              />
              <button
                onClick={() => setConfig({ ...config, faq: config.faq.filter((_, j) => j !== i) })}
                className="text-loss text-xs font-mono mt-1"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() => setConfig({ ...config, faq: [...config.faq, { question: "", answer: "" }] })}
            className="text-gain text-xs font-mono"
          >
            + Add FAQ
          </button>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-md bg-gain text-ink text-sm font-semibold hover:bg-gain/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Config"}
        </button>
      </div>
    </div>
  );
}