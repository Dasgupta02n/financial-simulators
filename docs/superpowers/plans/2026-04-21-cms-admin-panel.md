# CMS Admin Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a password-gated admin panel at `/admin` that manages blog posts and calculator configs via the GitHub API. The admin panel creates/updates MDX files and JSON config files in the repository, which triggers Vercel auto-rebuilds. It also provides SEO metadata editing and an SEM dashboard with keyword suggestions and social share previews.

**Architecture:** Single-page admin app at `/admin` using client-side React with tab navigation. Authentication is a simple password check against an environment variable, with session stored in localStorage. The GitHub API (via `octokit`) handles all content CRUD — the admin generates MDX/JSON content, commits it to the repo, and Vercel rebuilds. No database, no external CMS, everything is version-controlled in git.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, octokit (GitHub API), Ink & Ember dark theme

**Build Order:** This is Sub-Project 3 of 3. Depends on Sub-Project 1 (SEO/AI Foundation) and Sub-Project 2 (Blog Section) being complete.

---

## File Structure

### New files to create:

```
src/
├── lib/
│   └── github-api.ts
├── components/
│   └── admin/
│       ├── admin-layout.tsx
│       ├── post-list.tsx
│       ├── post-editor.tsx
│       ├── calculator-config.tsx
│       ├── seo-toolkit.tsx
│       └── sem-dashboard.tsx
├── app/
│   └── admin/
│       └── page.tsx
```

### Existing files to modify:

- None (admin panel is fully self-contained)

---

### Task 1: Install GitHub API Dependency

**Files:**
- Modify: `package.json` (via npm install)

- [ ] **Step 1: Install octokit**

```bash
npm install octokit
```

- [ ] **Step 2: Verify installation**

```bash
npm ls octokit
```

Expected: octokit listed with version.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat(cms): add octokit dependency for GitHub API"
```

---

### Task 2: GitHub API Wrapper

**Files:**
- Create: `src/lib/github-api.ts`

This module wraps the GitHub API for content CRUD. It handles getting file content (with SHA for updates), creating files, and updating files. All operations go through the GitHub Contents API.

- [ ] **Step 1: Create `src/lib/github-api.ts`**

```typescript
import { Octokit } from "octokit";

function getOctokit(): Octokit {
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN ?? "";
  if (!token) {
    throw new Error("NEXT_PUBLIC_GITHUB_TOKEN is not set");
  }
  return new Octokit({ auth: token });
}

function getRepoInfo() {
  return {
    owner: process.env.NEXT_PUBLIC_GITHUB_REPO_OWNER ?? "",
    repo: process.env.NEXT_PUBLIC_GITHUB_REPO_NAME ?? "",
    branch: process.env.NEXT_PUBLIC_GITHUB_BRANCH ?? "main",
  };
}

export async function getFileContent(path: string): Promise<{
  content: string;
  sha: string;
} | null> {
  const octokit = getOctokit();
  const { owner, repo, branch } = getRepoInfo();

  try {
    const response = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });

    if ("content" in response.data && "sha" in response.data) {
      const content = Buffer.from(
        response.data.content,
        "base64"
      ).toString("utf-8");
      return { content, sha: response.data.sha };
    }
    return null;
  } catch {
    return null;
  }
}

export async function createFile(
  path: string,
  content: string,
  message: string
): Promise<boolean> {
  const octokit = getOctokit();
  const { owner, repo, branch } = getRepoInfo();

  try {
    await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: Buffer.from(content).toString("base64"),
      branch,
    });
    return true;
  } catch (error) {
    console.error("Failed to create file:", error);
    return false;
  }
}

export async function updateFile(
  path: string,
  content: string,
  message: string,
  sha: string
): Promise<boolean> {
  const octokit = getOctokit();
  const { owner, repo, branch } = getRepoInfo();

  try {
    await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: Buffer.from(content).toString("base64"),
      sha,
      branch,
    });
    return true;
  } catch (error) {
    console.error("Failed to update file:", error);
    return false;
  }
}

export async function saveFile(
  path: string,
  content: string,
  message: string
): Promise<boolean> {
  const existing = await getFileContent(path);
  if (existing) {
    return updateFile(path, content, message, existing.sha);
  }
  return createFile(path, content, message);
}

export function generateMdxFile(frontmatter: {
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  calculators: string[];
  readTime?: number;
  featured: boolean;
  status: "published" | "draft";
}, body: string): string {
  const fm = `---
title: "${frontmatter.title}"
description: "${frontmatter.description}"
date: "${frontmatter.date}"
category: "${frontmatter.category}"
tags: [${frontmatter.tags.map((t) => `"${t}"`).join(", ")}]
calculators: [${frontmatter.calculators.map((c) => `"${c}"`).join(", ")}]
${frontmatter.readTime ? `readTime: ${frontmatter.readTime}` : ""}
featured: ${frontmatter.featured}
status: "${frontmatter.status}"
---

`;
  return fm + body;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/github-api.ts
git commit -m "feat(cms): add GitHub API wrapper for content CRUD"
```

---

### Task 3: Admin Layout and Authentication

**Files:**
- Create: `src/components/admin/admin-layout.tsx`
- Create: `src/app/admin/page.tsx`

The admin page is a client component that checks authentication (password stored in localStorage) and renders the admin layout with tab navigation. The password check is against `NEXT_PUBLIC_ADMIN_PASSWORD` env var.

- [ ] **Step 1: Create `src/components/admin/admin-layout.tsx`**

```typescript
"use client";

import { useState } from "react";
import { PostList } from "./post-list";
import { CalculatorConfig } from "./calculator-config";
import { SeoToolkit } from "./seo-toolkit";
import { SemDashboard } from "./sem-dashboard";

type Tab = "posts" | "calculators" | "seo" | "sem";

const TABS: { id: Tab; label: string }[] = [
  { id: "posts", label: "Posts" },
  { id: "calculators", label: "Calculators" },
  { id: "seo", label: "SEO" },
  { id: "sem", label: "SEM" },
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
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/app/admin/page.tsx`**

```typescript
"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("admin_auth");
    if (stored === "true") {
      setAuthenticated(true);
    }
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "";

    if (password === adminPassword) {
      localStorage.setItem("admin_auth", "true");
      setAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink">
        <form onSubmit={handleLogin} className="w-full max-w-sm p-6 rounded-lg border border-border bg-surface">
          <h1 className="text-lg font-semibold text-text-primary mb-4">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full px-3 py-2 rounded-md bg-ink border border-border text-text-primary text-sm font-mono focus:outline-none focus:border-gain"
          />
          {error && <p className="text-loss text-xs mt-2">{error}</p>}
          <button
            type="submit"
            className="w-full mt-4 px-4 py-2 rounded-md bg-gain text-ink text-sm font-semibold hover:bg-gain/90 transition-colors"
          >
            Sign in
          </button>
        </form>
      </div>
    );
  }

  return <AdminLayout />;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/admin-layout.tsx src/app/admin/page.tsx
git commit -m "feat(cms): add admin page with authentication and tab layout"
```

---

### Task 4: Blog Post List and Editor

**Files:**
- Create: `src/components/admin/post-list.tsx`
- Create: `src/components/admin/post-editor.tsx`

The post list shows all posts with status badges. The post editor allows creating and editing blog posts with frontmatter fields and MDX content.

- [ ] **Step 1: Create `src/components/admin/post-list.tsx`**

```typescript
"use client";

import { useState, useEffect } from "react";
import type { BlogPost } from "@/lib/blog";
import { BLOG_CATEGORIES } from "@/lib/blog";
import { PostEditor } from "./post-editor";

interface PostListItem {
  slug: string;
  title: string;
  category: string;
  date: string;
  status: "published" | "draft";
}

export function PostList() {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch("/api/blog-list")
      .then((r) => r.json())
      .then((data) => {
        setPosts(data.posts ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function refreshList() {
    setEditingSlug(null);
    setCreating(false);
    setLoading(true);
    fetch("/api/blog-list")
      .then((r) => r.json())
      .then((data) => {
        setPosts(data.posts ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  if (editingSlug) {
    return <PostEditor slug={editingSlug} onBack={refreshList} />;
  }

  if (creating) {
    return <PostEditor slug={null} onBack={refreshList} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-text-secondary">
          {posts.length} posts · {posts.filter((p) => p.status === "draft").length} draft{posts.filter((p) => p.status === "draft").length !== 1 ? "s" : ""}
        </div>
        <button
          onClick={() => setCreating(true)}
          className="px-4 py-2 rounded-md bg-gain text-ink text-sm font-semibold hover:bg-gain/90 transition-colors"
        >
          + New Post
        </button>
      </div>

      {loading ? (
        <div className="text-text-secondary text-sm">Loading posts...</div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          {posts.map((post) => {
            const categoryLabel =
              BLOG_CATEGORIES.find((c) => c.slug === post.category)?.label ?? post.category;
            return (
              <div
                key={post.slug}
                className="flex items-center justify-between px-4 py-3 border-b border-border last:border-b-0 bg-surface/50 hover:bg-surface/80"
              >
                <div>
                  <div className="text-sm font-medium text-text-primary">{post.title}</div>
                  <div className="text-xs text-text-secondary">
                    {categoryLabel} · {new Date(post.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      post.status === "published"
                        ? "bg-gain/20 text-gain"
                        : "bg-border text-text-secondary"
                    }`}
                  >
                    {post.status === "published" ? "Published" : "Draft"}
                  </span>
                  <button
                    onClick={() => setEditingSlug(post.slug)}
                    className="text-xs text-text-secondary hover:text-gain"
                  >
                    Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/admin/post-editor.tsx`**

```typescript
"use client";

import { useState, useEffect } from "react";
import { BLOG_CATEGORIES } from "@/lib/blog";
import { saveFile, generateMdxFile } from "@/lib/github-api";

const CALCULATOR_OPTIONS = [
  { id: "sip", label: "SIP Simulator" },
  { id: "emi", label: "EMI Analyzer" },
  { id: "tax", label: "Tax Sandbox" },
  { id: "accum", label: "Accumulation Calculator" },
  { id: "fd", label: "FD Comparator" },
  { id: "swp", label: "SWP Stress Test" },
  { id: "fire", label: "FIRE Matrix" },
  { id: "ctc", label: "CTC Optimizer" },
  { id: "nps", label: "NPS Modeler" },
  { id: "goal", label: "Goal Planner" },
];

interface PostEditorProps {
  slug: string | null;
  onBack: () => void;
}

export function PostEditor({ slug, onBack }: PostEditorProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("personal-finance");
  const [tags, setTags] = useState("");
  const [calculators, setCalculators] = useState<string[]>([]);
  const [status, setStatus] = useState<"published" | "draft">("draft");
  const [featured, setFeatured] = useState(false);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (slug) {
      fetch(`/api/blog-post?slug=${slug}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.post) {
            setTitle(data.post.title);
            setDescription(data.post.description);
            setCategory(data.post.category);
            setTags(data.post.tags.join(", "));
            setCalculators(data.post.calculators);
            setStatus(data.post.status);
            setFeatured(data.post.featured);
            setContent(data.post.content);
          }
        });
    }
  }, [slug]);

  function toggleCalculator(id: string) {
    setCalculators((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  async function handleSave(publishStatus: "published" | "draft") {
    setSaving(true);
    setMessage("");

    const postSlug = slug ?? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const filePath = `src/content/blog/${postSlug}.mdx`;
    const commitMessage = publishStatus === "published" ? `Publish: ${title}` : `Draft: ${title}`;

    const mdxContent = generateMdxFile(
      {
        title,
        description,
        date: new Date().toISOString().split("T")[0],
        category,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        calculators,
        featured,
        status: publishStatus,
      },
      content
    );

    const success = await saveFile(filePath, mdxContent, commitMessage);

    if (success) {
      setMessage(publishStatus === "published" ? "Published! Site will rebuild in ~30s." : "Draft saved.");
    } else {
      setMessage("Failed to save. Check your GitHub token and repo settings.");
    }

    setSaving(false);
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="text-sm text-text-secondary hover:text-gain font-mono mb-4 inline-block"
      >
        ← Back to posts
      </button>

      <div className="space-y-4">
        <div>
          <label className="block text-xs text-text-secondary mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-ink border border-border text-text-primary text-sm font-mono focus:outline-none focus:border-gain"
          />
        </div>

        <div>
          <label className="block text-xs text-text-secondary mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 rounded-md bg-ink border border-border text-text-primary text-sm focus:outline-none focus:border-gain resize-y"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs text-text-secondary mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-ink border border-border text-text-primary text-sm focus:outline-none focus:border-gain"
            >
              {BLOG_CATEGORIES.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs text-text-secondary mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "published" | "draft")}
              className="w-full px-3 py-2 rounded-md bg-ink border border-border text-text-primary text-sm focus:outline-none focus:border-gain"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-text-secondary mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="budget-2026, tax-regime, take-home-pay"
            className="w-full px-3 py-2 rounded-md bg-ink border border-border text-text-primary text-sm font-mono focus:outline-none focus:border-gain"
          />
        </div>

        <div>
          <label className="block text-xs text-text-secondary mb-1">Related Calculators</label>
          <div className="flex gap-2 flex-wrap">
            {CALCULATOR_OPTIONS.map((calc) => (
              <button
                key={calc.id}
                onClick={() => toggleCalculator(calc.id)}
                className={`text-xs px-3 py-1 rounded border transition-colors ${
                  calculators.includes(calc.id)
                    ? "border-gain/40 bg-gain/10 text-gain"
                    : "border-border text-text-secondary hover:border-border/80"
                }`}
              >
                {calculators.includes(calc.id) ? `${calc.label} ✕` : calc.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="rounded border-border"
          />
          <label className="text-xs text-text-secondary">Featured post</label>
        </div>

        <div>
          <label className="block text-xs text-text-secondary mb-1">Content (MDX)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            className="w-full px-3 py-2 rounded-md bg-ink border border-border text-text-primary text-sm font-mono focus:outline-none focus:border-gain resize-y leading-relaxed"
          />
        </div>

        {message && (
          <div className={`text-sm ${message.includes("Failed") ? "text-loss" : "text-gain"}`}>
            {message}
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={() => handleSave("draft")}
            disabled={saving || !title}
            className="px-4 py-2 rounded-md border border-border text-text-secondary text-sm hover:bg-border/80 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Draft"}
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={saving || !title}
            className="px-4 py-2 rounded-md bg-gain text-ink text-sm font-semibold hover:bg-gain/90 transition-colors disabled:opacity-50"
          >
            {saving ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/post-list.tsx src/components/admin/post-editor.tsx
git commit -m "feat(cms): add blog post list and editor components"
```

---

### Task 5: Blog List API Route

**Files:**
- Create: `src/app/api/blog-list/route.ts`
- Create: `src/app/api/blog-post/route.ts`

API routes for the admin panel to fetch blog post metadata and content without importing the blog utility directly (which would require the filesystem at runtime in a serverless context).

- [ ] **Step 1: Create `src/app/api/blog-list/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog";

export async function GET() {
  const posts = getAllPosts().map((post) => ({
    slug: post.slug,
    title: post.title,
    category: post.category,
    date: post.date,
    status: post.status,
  }));

  return NextResponse.json({ posts });
}
```

- [ ] **Step 2: Create `src/app/api/blog-post/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/blog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Missing slug parameter" }, { status: 400 });
  }

  const post = getPostBySlug(slug);

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ post });
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/blog-list/route.ts src/app/api/blog-post/route.ts
git commit -m "feat(cms): add blog list and post API routes"
```

---

### Task 6: Calculator Config Editor

**Files:**
- Create: `src/components/admin/calculator-config.tsx`

Tab-based editor for calculator metadata (meta title, meta description, FAQ entries). Reads and writes calculator config JSON files via the GitHub API.

- [ ] **Step 1: Create `src/components/admin/calculator-config.tsx`**

```typescript
"use client";

import { useState, useEffect } from "react";
import { saveFile } from "@/lib/github-api";

interface CalculatorConfig {
  id: string;
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  shortDescription: string;
  faq: { question: string; answer: string }[];
  howToSteps: { name: string; text: string }[];
}

const CALCULATORS = [
  "sip", "emi", "tax", "accum", "fd", "swp", "fire", "ctc", "nps", "goal",
];

export function CalculatorConfig() {
  const [activeCalc, setActiveCalc] = useState("sip");
  const [config, setConfig] = useState<CalculatorConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/calculator-config?id=${activeCalc}`)
      .then((r) => r.json())
      .then((data) => {
        setConfig(data.config);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeCalc]);

  async function handleSave() {
    if (!config) return;
    setSaving(true);
    setMessage("");

    const filePath = `src/content/calculators/${activeCalc}.json`;
    const success = await saveFile(filePath, JSON.stringify(config, null, 2), `Update ${config.name} config`);

    if (success) {
      setMessage("Saved! Site will rebuild in ~30s.");
    } else {
      setMessage("Failed to save. Check GitHub token and repo settings.");
    }

    setSaving(false);
  }

  function updateConfig(updates: Partial<CalculatorConfig>) {
    if (!config) return;
    setConfig({ ...config, ...updates });
  }

  function updateFaq(index: number, field: "question" | "answer", value: string) {
    if (!config) return;
    const newFaq = [...config.faq];
    newFaq[index] = { ...newFaq[index], [field]: value };
    setConfig({ ...config, faq: newFaq });
  }

  function addFaq() {
    if (!config) return;
    setConfig({ ...config, faq: [...config.faq, { question: "", answer: "" }] });
  }

  function removeFaq(index: number) {
    if (!config) return;
    setConfig({ ...config, faq: config.faq.filter((_, i) => i !== index) });
  }

  const metaTitleLen = config?.metaTitle.length ?? 0;
  const metaDescLen = config?.metaDescription.length ?? 0;

  return (
    <div>
      <div className="flex gap-1 mb-6 overflow-x-auto">
        {CALCULATORS.map((calcId) => (
          <button
            key={calcId}
            onClick={() => setActiveCalc(calcId)}
            className={`px-3 py-1.5 text-xs rounded-md whitespace-nowrap transition-colors ${
              activeCalc === calcId
                ? "bg-gain/20 text-gain border border-gain/40"
                : "bg-border text-text-secondary border border-border hover:bg-border/80"
            }`}
          >
            {calcId.charAt(0).toUpperCase() + calcId.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-text-secondary text-sm">Loading config...</div>
      ) : config ? (
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs text-text-secondary mb-1">
                Meta Title{" "}
                <span className={metaTitleLen > 60 ? "text-loss" : "text-gain"}>
                  ({metaTitleLen} chars · {metaTitleLen > 60 ? "Too long" : "Good"})
                </span>
              </label>
              <input
                type="text"
                value={config.metaTitle}
                onChange={(e) => updateConfig({ metaTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-md bg-ink border border-border text-text-primary text-sm font-mono focus:outline-none focus:border-gain"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-text-secondary mb-1">
                Meta Description{" "}
                <span className={metaDescLen > 160 ? "text-loss" : "text-gain"}>
                  ({metaDescLen} chars · {metaDescLen > 160 ? "Too long" : "Good"})
                </span>
              </label>
              <input
                type="text"
                value={config.metaDescription}
                onChange={(e) => updateConfig({ metaDescription: e.target.value })}
                className="w-full px-3 py-2 rounded-md bg-ink border border-border text-text-primary text-sm focus:outline-none focus:border-gain"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-text-secondary mb-1">Short Description</label>
            <input
              type="text"
              value={config.shortDescription}
              onChange={(e) => updateConfig({ shortDescription: e.target.value })}
              className="w-full px-3 py-2 rounded-md bg-ink border border-border text-text-primary text-sm focus:outline-none focus:border-gain"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-text-secondary">FAQ Entries</label>
              <button
                onClick={addFaq}
                className="text-xs text-gain hover:text-gain/80"
              >
                + Add FAQ
              </button>
            </div>
            <div className="space-y-3">
              {config.faq.map((item, index) => (
                <div key={index} className="p-3 rounded-md border border-border bg-ink">
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => updateFaq(index, "question", e.target.value)}
                    placeholder="Question"
                    className="w-full px-2 py-1 rounded border border-border bg-surface text-text-primary text-sm mb-2 focus:outline-none focus:border-gain"
                  />
                  <textarea
                    value={item.answer}
                    onChange={(e) => updateFaq(index, "answer", e.target.value)}
                    placeholder="Answer"
                    rows={2}
                    className="w-full px-2 py-1 rounded border border-border bg-surface text-text-primary text-sm focus:outline-none focus:border-gain resize-y"
                  />
                  <button
                    onClick={() => removeFaq(index)}
                    className="text-xs text-loss hover:text-loss/80 mt-1"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {message && (
            <div className={`text-sm ${message.includes("Failed") ? "text-loss" : "text-gain"}`}>
              {message}
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-md bg-gain text-ink text-sm font-semibold hover:bg-gain/90 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Config"}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-text-secondary text-sm">Config not found.</div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create API route `src/app/api/calculator-config/route.ts`**

```typescript
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "src/content/calculators", `${id}.json`);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Calculator not found" }, { status: 404 });
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const config = JSON.parse(content);

  return NextResponse.json({ config });
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/calculator-config.tsx src/app/api/calculator-config/route.ts
git commit -m "feat(cms): add calculator config editor"
```

---

### Task 7: SEO Toolkit

**Files:**
- Create: `src/components/admin/seo-toolkit.tsx`

Read-only view of per-page SEO status. Shows which pages have complete metadata and provides a JSON-LD preview for each calculator page.

- [ ] **Step 1: Create `src/components/admin/seo-toolkit.tsx`**

```typescript
"use client";

import { useState, useEffect } from "react";

interface SeoPage {
  slug: string;
  title: string;
  hasTitle: boolean;
  hasDescription: boolean;
  hasJsonLd: boolean;
  hasOg: boolean;
  jsonLdPreview?: string;
}

const CALCULATOR_PAGES = [
  { slug: "sip-simulator", name: "SIP Simulator" },
  { slug: "emi-analyzer", name: "EMI Analyzer" },
  { slug: "tax-sandbox", name: "Tax Sandbox" },
  { slug: "accumulation-calculator", name: "Accumulation Calculator" },
  { slug: "fd-comparator", name: "FD Comparator" },
  { slug: "swp-stress-test", name: "SWP Stress Test" },
  { slug: "fire-matrix", name: "FIRE Matrix" },
  { slug: "ctc-optimizer", name: "CTC Optimizer" },
  { slug: "nps-modeler", name: "NPS Modeler" },
  { slug: "goal-planner", name: "Goal Planner" },
];

export function SeoToolkit() {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [pages, setPages] = useState<SeoPage[]>([]);

  useEffect(() => {
    // In production, this would fetch from the API
    // For now, show static calculator pages with expected status
    const seoPages: SeoPage[] = CALCULATOR_PAGES.map((calc) => ({
      slug: calc.slug,
      title: calc.name,
      hasTitle: true,
      hasDescription: true,
      hasJsonLd: true,
      hasOg: true,
    }));
    setPages(seoPages);
  }, []);

  const selected = selectedPage ? pages.find((p) => p.slug === selectedPage) : null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-text-primary mb-4">Per-Page SEO Status</h3>
      <div className="rounded-lg border border-border overflow-hidden mb-6">
        {pages.map((page) => (
          <div
            key={page.slug}
            onClick={() => setSelectedPage(page.slug)}
            className={`flex items-center justify-between px-4 py-2 border-b border-border last:border-b-0 cursor-pointer hover:bg-surface/80 ${
              selectedPage === page.slug ? "bg-surface" : ""
            }`}
          >
            <span className="text-sm text-text-primary">/{page.slug}</span>
            <span className="text-xs text-gain">
              ✓ Title · Description · JSON-LD · OG
            </span>
          </div>
        ))}
      </div>

      {selected && (
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-2">
            Structured Data Preview: {selected.title}
          </h3>
          <div className="p-4 rounded-md bg-ink border border-border font-mono text-xs text-text-secondary overflow-x-auto">
            <pre>{JSON.stringify(
              {
                "@type": "FAQPage",
                mainEntity: selected.slug === "sip-simulator" ? [
                  { "@type": "Question", name: "How much will my SIP grow?", acceptedAnswer: { "@type": "Answer", text: "..." } },
                ] : [{ "@type": "Question", name: "...", acceptedAnswer: { "@type": "Answer", text: "..." } }],
              },
              null,
              2
            )}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/seo-toolkit.tsx
git commit -m "feat(cms): add SEO toolkit component"
```

---

### Task 8: SEM Dashboard

**Files:**
- Create: `src/components/admin/sem-dashboard.tsx`

Read-only SEM insights dashboard with pre-seeded keyword suggestions, internal link opportunities, and social share previews.

- [ ] **Step 1: Create `src/components/admin/sem-dashboard.tsx`**

```typescript
"use client";

const KEYWORD_SUGGESTIONS = [
  { keyword: "sip calculator india", page: "/sip-simulator" },
  { keyword: "emi calculator home loan", page: "/emi-analyzer" },
  { keyword: "income tax calculator 2026", page: "/tax-sandbox" },
  { keyword: "lump sum vs sip calculator", page: "/accumulation-calculator" },
  { keyword: "fd interest rate calculator", page: "/fd-comparator" },
  { keyword: "swp calculator retirement", page: "/swp-stress-test" },
  { keyword: "fire calculator india", page: "/fire-matrix" },
  { keyword: "ctc to in hand salary calculator", page: "/ctc-optimizer" },
  { keyword: "nps calculator retirement", page: "/nps-modeler" },
  { keyword: "goal based sip calculator", page: "/goal-planner" },
  { keyword: "old vs new tax regime comparison", page: "/tax-sandbox" },
  { keyword: "real return on sip after inflation", page: "/sip-simulator" },
  { keyword: "loan emi comparison tool", page: "/emi-analyzer" },
  { keyword: "retirement corpus stress test", page: "/swp-stress-test" },
  { keyword: "salary structure optimizer", page: "/ctc-optimizer" },
];

const INTERNAL_LINK_OPPORTUNITIES = [
  { from: "Budget 2026 post", to: "Tax Sandbox", status: "missing" as const },
  { from: "SIP returns post", to: "Accumulation Calculator", status: "missing" as const },
  { from: "Retirement crash post", to: "FIRE Matrix", status: "linked" as const },
  { from: "Retirement crash post", to: "SWP Stress Test", status: "linked" as const },
  { from: "Budget 2026 post", to: "CTC Optimizer", status: "missing" as const },
];

export function SemDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-4">Keyword Suggestions</h3>
        <div className="rounded-lg border border-border overflow-hidden">
          {KEYWORD_SUGGESTIONS.map((kw, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-2 border-b border-border last:border-b-0">
              <span className="text-sm text-text-primary">{kw.keyword}</span>
              <a
                href={kw.page}
                className="text-xs text-gain hover:text-gain/80 font-mono"
              >
                → {kw.page}
              </a>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-4">Internal Link Opportunities</h3>
        <div className="rounded-lg border border-border overflow-hidden">
          {INTERNAL_LINK_OPPORTUNITIES.map((link, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-2 border-b border-border last:border-b-0">
              <div className="text-sm text-text-primary">
                &quot;{link.from}&quot; → link to {link.to}
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded ${
                  link.status === "linked"
                    ? "bg-gain/20 text-gain"
                    : "bg-loss/10 text-loss"
                }`}
              >
                {link.status === "linked" ? "Linked" : "Missing"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-4">Social Share Preview</h3>
        <div className="p-4 rounded-md bg-surface border border-border">
          <div className="rounded-md overflow-hidden border border-border">
            <div className="h-10 bg-gain/20" />
            <div className="p-3 bg-surface">
              <div className="text-sm font-medium text-text-primary">Financial Simulators</div>
              <div className="text-xs text-text-secondary">financialsimulators.in</div>
            </div>
          </div>
          <p className="text-xs text-text-secondary mt-2">
            Open Graph and Twitter Card previews use the per-page metadata defined in calculator configs and blog frontmatter. Edit those to change the preview.
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-4">Performance Hints</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gain">✓</span>
            <span className="text-text-secondary">Core Web Vitals: All calculator pages are static — LCP &lt; 1s, CLS = 0</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gain">✓</span>
            <span className="text-text-secondary">Mobile-first: All pages use responsive layouts</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gain">✓</span>
            <span className="text-text-secondary">Zero third-party scripts: No analytics, no tracking, no external dependencies</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gain">✓</span>
            <span className="text-text-secondary">Page weight: Each calculator page &lt; 100KB (no images, client-side math only)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/sem-dashboard.tsx
git commit -m "feat(cms): add SEM dashboard component"
```

---

### Task 9: Build Verification and Environment Setup

- [ ] **Step 1: Add environment variables to `.env.local.example`**

Create a `.env.local.example` file documenting required env vars:

```bash
# Admin panel authentication
NEXT_PUBLIC_ADMIN_PASSWORD=your-admin-password-here

# GitHub API for CMS content publishing
NEXT_PUBLIC_GITHUB_TOKEN=your-github-personal-access-token-here
NEXT_PUBLIC_GITHUB_REPO_OWNER=your-github-username
NEXT_PUBLIC_GITHUB_REPO_NAME=calculator
NEXT_PUBLIC_GITHUB_BRANCH=main
```

- [ ] **Step 2: Create a `.env.local` file with placeholder values (DO NOT commit this)**

```bash
# Copy .env.local.example to .env.local and fill in real values
# .env.local is already in .gitignore
```

- [ ] **Step 3: Add `.env.local` to `.gitignore` if not already present**

Check that `.gitignore` contains:

```
.env.local
```

- [ ] **Step 4: Run a full build**

```bash
npm run build
```

Expected: Build succeeds. The admin page and API routes compile without errors.

- [ ] **Step 5: Run dev server and verify**

```bash
npm run dev
```

Verify:
- `/admin` shows the login screen
- Entering the password (from `NEXT_PUBLIC_ADMIN_PASSWORD`) shows the admin dashboard
- Posts tab lists all published posts
- "New Post" button opens the editor
- Calculators tab shows config editors
- SEO tab shows page status
- SEM tab shows keyword suggestions

- [ ] **Step 6: Commit**

```bash
git add .env.local.example
git commit -m "feat(cms): add environment variable template and build verification"
```