"use client";

import { useState } from "react";
import { BLOG_CATEGORIES } from "@/lib/blog-categories";

interface PostEditorProps {
  slug?: string;
  onSaved?: () => void;
}

const EMPTY_FRONTMATTER = {
  title: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
  category: "personal-finance" as const,
  tags: [] as string[],
  calculators: [] as string[],
  featured: false,
  status: "draft" as "draft" | "published",
  locale: "en" as "en" | "hi",
};

export function PostEditor({ slug: initialSlug, onSaved }: PostEditorProps) {
  const [slug, setSlug] = useState(initialSlug ?? "");
  const [frontmatter, setFrontmatter] = useState(EMPTY_FRONTMATTER);
  const [body, setBody] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [mode] = useState<"create" | "edit">(initialSlug ? "edit" : "create");

  function escapeYaml(str: string): string {
    return str
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t");
  }

  function buildMdx(): string {
    const lines = ["---"];
    lines.push(`title: "${escapeYaml(frontmatter.title)}"`);
    lines.push(`description: "${escapeYaml(frontmatter.description)}"`);
    lines.push(`date: "${frontmatter.date}"`);
    lines.push(`category: ${frontmatter.category}`);
    if (frontmatter.tags.length > 0) {
      lines.push(`tags:\n${frontmatter.tags.map((t) => `  - ${t}`).join("\n")}`);
    }
    if (frontmatter.calculators.length > 0) {
      lines.push(`calculators:\n${frontmatter.calculators.map((c) => `  - ${c}`).join("\n")}`);
    }
    lines.push(`featured: ${frontmatter.featured}`);
    lines.push(`status: ${frontmatter.status}`);
    lines.push(`locale: ${frontmatter.locale}`);
    lines.push("---");
    lines.push("");
    lines.push(body);
    return lines.join("\n");
  }

  async function handleSave() {
    if (!slug.trim()) {
      alert("Slug is required");
      return;
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      alert("Slug must contain only lowercase letters, numbers, and hyphens");
      return;
    }
    if (!frontmatter.title.trim()) {
      alert("Title is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: `src/content/blog/${slug}.mdx`,
          content: buildMdx(),
          message: `feat(blog): ${mode === "create" ? "create" : "update"} ${slug}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onSaved?.();
        alert("Post saved! It may take a minute to appear on the site.");
      } else {
        alert(`Failed to save: ${data.error ?? "Unknown error"}`);
      }
    } catch {
      alert("Failed to save. Make sure GITHUB_TOKEN is configured.");
    } finally {
      setSaving(false);
    }
  }

  function addTag(tag: string) {
    const trimmed = tag.trim();
    if (trimmed && !frontmatter.tags.includes(trimmed)) {
      setFrontmatter({ ...frontmatter, tags: [...frontmatter.tags, trimmed] });
    }
    setTagInput("");
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-mono text-text-secondary mb-1">Slug</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          disabled={mode === "edit"}
          placeholder="budget-2026-analysis"
          className="w-full px-3 py-2 rounded-md bg-ink border border-border text-text-primary text-sm font-mono focus:outline-none focus:border-gain disabled:opacity-50"
        />
      </div>

      <div>
        <label className="block text-xs font-mono text-text-secondary mb-1">Title</label>
        <input
          type="text"
          value={frontmatter.title}
          onChange={(e) => setFrontmatter({ ...frontmatter, title: e.target.value })}
          placeholder="Budget 2026: What It Means for Your SIP"
          className="w-full px-3 py-2 rounded-md bg-ink border border-border text-text-primary text-sm font-mono focus:outline-none focus:border-gain"
        />
      </div>

      <div>
        <label className="block text-xs font-mono text-text-secondary mb-1">Description</label>
        <textarea
          value={frontmatter.description}
          onChange={(e) => setFrontmatter({ ...frontmatter, description: e.target.value })}
          placeholder="A breakdown of Budget 2026 changes and how they affect your investments."
          className="w-full px-3 py-2 rounded-md bg-ink border border-border text-text-primary text-sm font-mono focus:outline-none focus:border-gain resize-y"
          rows={2}
        />
        <span className="text-xs text-text-secondary">{frontmatter.description.length}/160</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-mono text-text-secondary mb-1">Date</label>
          <input
            type="date"
            value={frontmatter.date}
            onChange={(e) => setFrontmatter({ ...frontmatter, date: e.target.value })}
            className="w-full px-3 py-2 rounded-md bg-ink border border-border text-text-primary text-sm font-mono focus:outline-none focus:border-gain"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-text-secondary mb-1">Category</label>
          <select
            value={frontmatter.category}
            onChange={(e) => setFrontmatter({ ...frontmatter, category: e.target.value as typeof frontmatter.category })}
            className="w-full px-3 py-2 rounded-md bg-ink border border-border text-text-primary text-sm font-mono focus:outline-none focus:border-gain"
          >
            {BLOG_CATEGORIES.map((cat) => (
              <option key={cat.slug} value={cat.slug}>{cat.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-mono text-text-secondary mb-1">Locale</label>
          <select
            value={frontmatter.locale}
            onChange={(e) => setFrontmatter({ ...frontmatter, locale: e.target.value as "en" | "hi" })}
            className="w-full px-3 py-2 rounded-md bg-ink border border-border text-text-primary text-sm font-mono focus:outline-none focus:border-gain"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी (Hindi)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono text-text-secondary mb-1">Tags</label>
        <div className="flex gap-2 flex-wrap mb-2">
          {frontmatter.tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded bg-gain/10 text-gain font-mono">
              {tag}
              <button
                onClick={() => setFrontmatter({ ...frontmatter, tags: frontmatter.tags.filter((t) => t !== tag) })}
                className="ml-1 text-gain/60 hover:text-loss"
              >
                x
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(tagInput); } }}
            placeholder="Add tag, press Enter"
            className="flex-1 px-3 py-1.5 rounded-md bg-ink border border-border text-text-primary text-sm font-mono focus:outline-none focus:border-gain"
          />
          <button
            onClick={() => addTag(tagInput)}
            className="px-3 py-1.5 text-xs rounded-md bg-border text-text-secondary font-mono hover:bg-border/80"
          >
            Add
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono text-text-secondary mb-1">Status</label>
        <div className="flex gap-3">
          <label className="flex items-center gap-1.5 text-sm text-text-secondary cursor-pointer">
            <input
              type="radio"
              name="status"
              value="draft"
              checked={frontmatter.status === "draft"}
              onChange={() => setFrontmatter({ ...frontmatter, status: "draft" })}
            />
            Draft
          </label>
          <label className="flex items-center gap-1.5 text-sm text-text-secondary cursor-pointer">
            <input
              type="radio"
              name="status"
              value="published"
              checked={frontmatter.status === "published"}
              onChange={() => setFrontmatter({ ...frontmatter, status: "published" })}
            />
            Published
          </label>
          <label className="flex items-center gap-1.5 text-sm text-text-secondary cursor-pointer ml-4">
            <input
              type="checkbox"
              checked={frontmatter.featured}
              onChange={(e) => setFrontmatter({ ...frontmatter, featured: e.target.checked })}
            />
            Featured
          </label>
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono text-text-secondary mb-1">Content (MDX)</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your MDX content here..."
          className="w-full px-3 py-2 rounded-md bg-ink border border-border text-text-primary text-sm font-mono focus:outline-none focus:border-gain resize-y"
          rows={12}
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-4 py-2 rounded-md bg-gain text-ink text-sm font-semibold hover:bg-gain/90 transition-colors disabled:opacity-50"
      >
        {saving ? "Saving..." : mode === "create" ? "Create Post" : "Update Post"}
      </button>
    </div>
  );
}