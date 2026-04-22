# Blog Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an MDX-based blog section to the Financial Simulators site, with category-filtered index page, individual post pages with CalculatorCard embeds, and static generation at build time.

**Architecture:** Blog posts stored as `.mdx` files in `src/content/blog/` with frontmatter for metadata. A `lib/blog.ts` utility reads and parses MDX at build time using `next-mdx-remote`. Blog index page at `/blog` with category filter tabs. Individual posts at `/blog/[slug]` with CalculatorCard components that link to calculator pages. All posts follow the anti-marketing voice and are statically generated.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, next-mdx-remote, gray-matter (frontmatter parsing)

**Build Order:** This is Sub-Project 2 of 3. Depends on Sub-Project 1 (SEO/AI Foundation) being complete, specifically the calculator config JSON files and CalculatorPageShell.

---

## File Structure

### New files to create:

```
src/
├── content/
│   └── blog/
│       ├── budget-2026-tax-slabs.mdx
│       ├── sip-real-returns.mdx
│       └── retirement-crash-test.mdx
├── lib/
│   └── blog.ts
├── components/
│   └── blog/
│       ├── blog-card.tsx
│       ├── calculator-card-embed.tsx
│       └── category-filter.tsx
├── app/
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
```

### Existing files to modify:

- `src/app/sitemap.ts` — Add blog routes
- `src/app/llms.txt/route.ts` — Add blog section
- `src/app/llms-full.txt/route.ts` — Add blog post content

---

### Task 1: Install MDX Dependencies

**Files:**
- Modify: `package.json` (via npm install)

- [ ] **Step 1: Install next-mdx-remote and gray-matter**

```bash
npm install next-mdx-remote gray-matter
npm install -D @types/gray-matter
```

- [ ] **Step 2: Verify installation**

```bash
npm ls next-mdx-remote gray-matter
```

Expected: Both packages listed with versions.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat(blog): add MDX dependencies"
```

---

### Task 2: Blog Post Frontmatter Types and Utility Library

**Files:**
- Create: `src/lib/blog.ts`

This file provides the data layer for the blog: a `BlogPost` type, `getAllPosts()` to list published posts sorted by date, `getPostBySlug()` to read and parse a single post, and category constants used by the filter and index pages.

- [ ] **Step 1: Create `src/lib/blog.ts`**

```typescript
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const BLOG_CATEGORIES = [
  { slug: "markets-policy", label: "Markets & Policy" },
  { slug: "personal-finance", label: "Personal Finance" },
  { slug: "tax-ctc", label: "Tax & CTC" },
  { slug: "retirement", label: "Retirement" },
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number]["slug"];

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: BlogCategory;
  tags: string[];
  calculators: string[];
  readTime: number;
  featured: boolean;
  status: "published" | "draft";
  content: string;
}

const postsDirectory = path.join(process.cwd(), "src/content/blog");

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".mdx"));

  const posts = files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      return getPostBySlug(slug);
    })
    .filter((post): post is BlogPost => post !== null && post.status === "published");

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const wordCount = content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return {
    slug,
    title: data.title ?? "",
    description: data.description ?? "",
    date: data.date ?? "",
    category: data.category ?? "personal-finance",
    tags: data.tags ?? [],
    calculators: data.calculators ?? [],
    readTime: data.readTime ?? readTime,
    featured: data.featured ?? false,
    status: data.status ?? "draft",
    content,
  };
}

export function getFeaturedPosts(): BlogPost[] {
  return getAllPosts().filter((post) => post.featured);
}

export function getPostsByCategory(category: BlogCategory): BlogPost[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = new Set<string>();
  posts.forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors (or only errors from files not yet created).

- [ ] **Step 3: Commit**

```bash
git add src/lib/blog.ts
git commit -m "feat(blog): add blog utility library with MDX parsing"
```

---

### Task 3: Sample Blog Posts

**Files:**
- Create: `src/content/blog/budget-2026-tax-slabs.mdx`
- Create: `src/content/blog/sip-real-returns.mdx`
- Create: `src/content/blog/retirement-crash-test.mdx`

Three seed posts covering the four blog categories, each with CalculatorCard embeds demonstrating the tie-in pattern.

- [ ] **Step 1: Create `src/content/blog/budget-2026-tax-slabs.mdx`**

```mdx
---
title: "Budget 2026: What the new tax slabs mean for your take-home pay"
description: "The new regime just got more attractive. Here's exactly how much more you'll keep each month — and when the old regime still wins."
date: "2026-03-15"
category: "markets-policy"
tags: ["budget-2026", "tax-regime", "take-home-pay"]
calculators: ["tax-sandbox", "ctc-optimizer"]
readTime: 6
featured: true
status: "published"
---

The Union Budget 2026 raised the basic exemption limit to ₹4L and widened the 5% slab. On paper, that sounds like a win. But the real question is: how much more money actually lands in your bank account each month?

## The new slabs

Under the new regime, the first ₹4L is tax-free. The 5% slab now covers ₹4–8L instead of ₹3–7L. The 10% slab starts at ₹8L. These changes save most salaried people between ₹10,000–₹25,000 per year.

## But the old regime still wins sometimes

If you claim significant deductions — HRA, 80C (₹1.5L), 80D (health insurance), home loan interest — the old regime can still save you more. The break-even point is roughly ₹3–5L in deductions, depending on your income.

<CalculatorCard id="tax-sandbox" />

For someone earning ₹15L CTC, the difference is about ₹1,400/month. Not life-changing, but not nothing.

<CalculatorCard id="ctc-optimizer" />

## The bottom line

Don't just compare tax amounts. Look at what you actually take home after all deductions. The answer depends on your specific salary structure and deductions — and that's exactly what the calculators above show you.
```

- [ ] **Step 2: Create `src/content/blog/sip-real-returns.mdx`**

```mdx
---
title: "Your ₹10K SIP is not really worth ₹1 crore — here's why"
description: "Inflation eats 75% of your nominal returns. The number on the brochure is a lie. Let us show you the real math."
date: "2026-03-10"
category: "personal-finance"
tags: ["sip", "inflation", "real-returns", "ltcg-tax"]
calculators: ["sip-simulator"]
readTime: 5
featured: true
status: "published"
---

Mutual fund ads love showing you the ₹1 crore number. "Invest ₹10,000/month for 20 years and become a crorepati!" What they don't tell you is what that ₹1 crore actually buys in 20 years.

## The inflation problem

At 6% inflation, ₹1 crore in 20 years has the purchasing power of about ₹31 lakh today. That's the real value of your "crore" — enough for a mid-range car, not a house.

## Then there's tax

LTCG tax at 12.5% applies to equity gains above ₹1.25L/year. On a ₹1 crore corpus built from ₹24L invested, you owe tax on ₹76L of gains. That's roughly ₹9.5L in taxes if you withdraw everything.

## So what's your actual return?

<CalculatorCard id="sip-simulator" />

The SIP Simulator shows you the real number — your corpus after inflation adjustment and tax. For most people, a 12% nominal return becomes roughly 4–5% real return after inflation.

## What you can do

- Step up your SIP by 10% every year — it compounds significantly
- Use the Accumulator to compare lump sum vs SIP
- Don't chase returns above 12% — the risk isn't worth it for most goals
```

- [ ] **Step 3: Create `src/content/blog/retirement-crash-test.mdx`**

```mdx
---
title: "Will your retirement corpus survive a market crash in year 1?"
description: "Sequence-of-returns risk can wipe out 40% of your retirement fund. The stress test shows you exactly how bad it can get."
date: "2026-03-05"
category: "retirement"
tags: ["retirement", "swp", "fire", "sequence-risk", "stress-test"]
calculators: ["swp-stress-test", "fire-matrix"]
readTime: 7
featured: false
status: "published"
---

Here's a scenario most retirement calculators ignore: you retire with ₹5 crore, and the market crashes 30% in your first year. You're still withdrawing ₹2L/month because your expenses don't care about the market.

## The math is brutal

Starting corpus: ₹5 crore. Market drops 30% in year 1. You withdraw ₹2.4L (₹24L/year). By end of year 1, your corpus is roughly ₹3.26 crore instead of the expected ₹3.5 crore (if markets had stayed flat).

That ₹24L difference compounds. Within 5 years, your corpus could be 40% lower than the smooth-projection scenario.

<CalculatorCard id="swp-stress-test" />

## When can you actually retire?

The FIRE number isn't just "25x expenses." It depends on your withdrawal strategy, asset allocation, and how much buffer you build for bad years.

<CalculatorCard id="fire-matrix" />

## Practical safeguards

- Keep 3–5 years of expenses in fixed income (FD, bonds)
- Don't withdraw from equity in a down year if possible
- Use the SWP Stress Test to see how your specific corpus handles crashes of different severity
```

- [ ] **Step 4: Commit**

```bash
git add src/content/blog/
git commit -m "feat(blog): add 3 seed blog posts"
```

---

### Task 4: CalculatorCard Embed Component

**Files:**
- Create: `src/components/blog/calculator-card-embed.tsx`

This component is rendered inside blog MDX posts via `<CalculatorCard id="..." />`. It shows a green-bordered callout card with the calculator name, description (from a built-in map), and a link to the calculator page.

- [ ] **Step 1: Create `src/components/blog/calculator-card-embed.tsx`**

```typescript
import Link from "next/link";

const CALCULATOR_INFO: Record<string, { name: string; slug: string; shortDescription: string }> = {
  sip: { name: "SIP Simulator", slug: "sip-simulator", shortDescription: "See actual returns after inflation and tax" },
  emi: { name: "EMI Analyzer", slug: "emi-analyzer", shortDescription: "Compare loan EMIs with real cost after inflation" },
  tax: { name: "Tax Sandbox", slug: "tax-sandbox", shortDescription: "Old vs New regime, side by side comparison" },
  accum: { name: "Accumulation Calculator", slug: "accumulation-calculator", shortDescription: "Lump sum vs SIP comparison over time" },
  fd: { name: "FD Comparator", slug: "fd-comparator", shortDescription: "Real FD returns after tax and inflation" },
  swp: { name: "SWP Stress Test", slug: "swp-stress-test", shortDescription: "Will your corpus survive a market crash?" },
  fire: { name: "FIRE Matrix", slug: "fire-matrix", shortDescription: "When can you retire? Calculate your FIRE number" },
  ctc: { name: "CTC Optimizer", slug: "ctc-optimizer", shortDescription: "Maximize your in-hand salary" },
  nps: { name: "NPS Modeler", slug: "nps-modeler", shortDescription: "Project your pension and retirement corpus" },
  goal: { name: "Goal Planner", slug: "goal-planner", shortDescription: "Monthly SIP needed per financial goal" },
};

interface CalculatorCardProps {
  id: string;
}

export function CalculatorCardEmbed({ id }: CalculatorCardProps) {
  const calc = CALCULATOR_INFO[id];

  if (!calc) {
    return (
      <div className="my-4 p-4 rounded-lg border border-border bg-surface/50 text-text-secondary text-sm">
        Calculator &quot;{id}&quot; not found.
      </div>
    );
  }

  return (
    <div className="my-6 p-5 rounded-lg border border-gain/40 bg-gain/10">
      <div className="text-gain font-semibold text-sm mb-2">Try it yourself →</div>
      <p className="text-text-primary text-sm mb-3">{calc.shortDescription}</p>
      <Link
        href={`/${calc.slug}`}
        className="inline-flex items-center gap-1 px-4 py-2 rounded-md text-sm font-mono bg-gain/20 text-gain border border-gain/40 hover:bg-gain/30 transition-colors"
      >
        Open {calc.name} →
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/blog/calculator-card-embed.tsx
git commit -m "feat(blog): add CalculatorCard embed component"
```

---

### Task 5: Blog Card Component

**Files:**
- Create: `src/components/blog/blog-card.tsx`

A card component for the blog index page showing category badge, title, excerpt, date, and calculator tie-in badges.

- [ ] **Step 1: Create `src/components/blog/blog-card.tsx`**

```typescript
import Link from "next/link";
import type { BlogPost, BlogCategory } from "@/lib/blog";
import { BLOG_CATEGORIES } from "@/lib/blog";

interface BlogCardProps {
  post: BlogPost;
}

function categoryLabel(slug: BlogCategory): string {
  return BLOG_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

const categoryColors: Record<BlogCategory, string> = {
  "markets-policy": "text-amber-400",
  "personal-finance": "text-red-400",
  "tax-ctc": "text-amber-400",
  retirement: "text-emerald-400",
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article className="h-full p-5 rounded-lg border border-border bg-surface/50 hover:border-gain/30 transition-colors">
        <div className={`text-xs uppercase font-mono mb-2 ${categoryColors[post.category] ?? "text-text-secondary"}`}>
          {categoryLabel(post.category)} · {post.readTime} min read
        </div>
        <h3 className="text-base font-semibold text-text-primary group-hover:text-gain transition-colors mb-2">
          {post.title}
        </h3>
        <p className="text-sm text-text-secondary line-clamp-2 mb-3">
          {post.description}
        </p>
        <div className="flex gap-2 flex-wrap">
          {post.calculators.map((calcId) => (
            <span
              key={calcId}
              className="text-xs px-2 py-0.5 rounded bg-gain/10 text-gain border border-gain/20"
            >
              → {calcId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </span>
          ))}
        </div>
      </article>
    </Link>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/blog/blog-card.tsx
git commit -m "feat(blog): add blog card component"
```

---

### Task 6: Category Filter Component

**Files:**
- Create: `src/components/blog/category-filter.tsx`

Client component for filtering blog posts by category. Uses URL search params for shareable filter state.

- [ ] **Step 1: Create `src/components/blog/category-filter.tsx`**

```typescript
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { BLOG_CATEGORIES } from "@/lib/blog";
import type { BlogCategory } from "@/lib/blog";

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") ?? "all";

  function setCategory(category: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`/blog?${params.toString()}`);
  }

  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => setCategory("all")}
        className={`px-3 py-1.5 text-xs rounded-md font-mono transition-colors ${
          activeCategory === "all"
            ? "bg-gain/20 text-gain border border-gain/40"
            : "bg-border text-text-secondary border border-border hover:bg-border/80"
        }`}
      >
        All
      </button>
      {BLOG_CATEGORIES.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => setCategory(cat.slug)}
          className={`px-3 py-1.5 text-xs rounded-md font-mono transition-colors ${
            activeCategory === cat.slug
              ? "bg-gain/20 text-gain border border-gain/40"
              : "bg-border text-text-secondary border border-border hover:bg-border/80"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/blog/category-filter.tsx
git commit -m "feat(blog): add category filter component"
```

---

### Task 7: Blog Index Page

**Files:**
- Create: `src/app/blog/page.tsx`

The main blog listing page with category filter and card grid. Fetches all published posts at build time.

- [ ] **Step 1: Create `src/app/blog/page.tsx`**

```typescript
import type { Metadata } from "next";
import { getAllPosts, getFeaturedPosts } from "@/lib/blog";
import { BlogCard } from "@/components/blog/blog-card";
import { CategoryFilter } from "@/components/blog/category-filter";

export const metadata: Metadata = {
  title: "Blog — Financial Stories for Common Indians | Financial Simulators",
  description:
    "Plain-language financial stories for Indian investors. No jargon, no product pitches — just real numbers you can verify with our calculators.",
  openGraph: {
    title: "Blog — Financial Stories for Common Indians",
    description:
      "Plain-language financial stories for Indian investors. No jargon, no product pitches.",
    type: "website",
  },
};

export default function BlogPage() {
  const allPosts = getAllPosts();
  const featured = allPosts.filter((p) => p.featured);
  const rest = allPosts.filter((p) => !p.featured);

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 pt-8 pb-12">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Blog</h1>
        <p className="text-sm text-text-secondary mt-1">
          Financial stories for common Indians. No jargon, no product pitches.
        </p>
      </header>

      <div className="mb-6">
        <CategoryFilter />
      </div>

      {featured.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-mono text-gain mb-4">Featured</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featured.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      <section>
        {featured.length > 0 && (
          <h2 className="text-sm font-mono text-text-secondary mb-4">All posts</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rest.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/blog/page.tsx
git commit -m "feat(blog): add blog index page"
```

---

### Task 8: Blog Post Page

**Files:**
- Create: `src/app/blog/[slug]/page.tsx`

Individual blog post page. Renders MDX content with CalculatorCard embeds, shows metadata, reading time, and Article JSON-LD structured data.

- [ ] **Step 1: Create `src/app/blog/[slug]/page.tsx`**

```typescript
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { BLOG_CATEGORIES } from "@/lib/blog";
import { CalculatorCardEmbed } from "@/components/blog/calculator-card-embed";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | Financial Simulators`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

const mdxComponents = {
  CalculatorCard: CalculatorCardEmbed,
};

function ArticleJsonLd({ post }: { post: NonNullable<ReturnType<typeof getPostBySlug>> }) {
  // Server-generated structured data from our own content files — not user input.
  // This is the standard Next.js pattern for injecting JSON-LD.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: "Financial Simulators",
    },
    publisher: {
      "@type": "Organization",
      name: "Financial Simulators",
    },
    keywords: post.tags.join(", "),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || post.status !== "published") {
    notFound();
  }

  const categoryLabel =
    BLOG_CATEGORIES.find((c) => c.slug === post.category)?.label ?? post.category;

  return (
    <>
      <ArticleJsonLd post={post} />
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 pt-8 pb-12">
        <a
          href="/blog"
          className="text-sm text-text-secondary hover:text-gain transition-colors font-mono"
        >
          ← Back to blog
        </a>

        <article className="mt-6">
          <header className="mb-8">
            <div className="text-xs uppercase font-mono text-amber-400 mb-2">
              {categoryLabel} · {post.readTime} min read
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
              {post.title}
            </h1>
            <time className="text-sm text-text-secondary mt-2 block">
              Published{" "}
              {new Date(post.date).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </header>

          <div className="prose prose-invert prose-sm max-w-none text-text-secondary [&_h2]:text-text-primary [&_h3]:text-text-primary [&_strong]:text-text-primary [&_a]:text-gain [&_a:hover]:text-gain/80 [&_code]:text-gain [&_code]:bg-border/50 [&_code]:px-1 [&_code]:rounded">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>

          <footer className="mt-10 pt-6 border-t border-border">
            <div className="flex gap-2 flex-wrap text-xs">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 rounded bg-border text-text-secondary font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>
            {post.calculators.length > 0 && (
              <div className="mt-4 flex gap-2 flex-wrap items-center">
                <span className="text-xs text-text-secondary">Related calculators:</span>
                {post.calculators.map((calcId) => (
                  <a
                    key={calcId}
                    href={`/${calcId}`}
                    className="text-xs px-2 py-1 rounded bg-gain/10 text-gain border border-gain/20 hover:bg-gain/20 transition-colors font-mono"
                  >
                    {calcId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} →
                  </a>
                ))}
              </div>
            )}
          </footer>
        </article>
      </main>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/blog/[slug]/page.tsx
git commit -m "feat(blog): add individual blog post page with MDX rendering"
```

---

### Task 9: Update Sitemap and llms.txt with Blog Routes

**Files:**
- Modify: `src/app/sitemap.ts` — Add blog index and blog post URLs
- Modify: `src/app/llms.txt/route.ts` — Add blog section
- Modify: `src/app/llms-full.txt/route.ts` — Add blog post content

These files were created in Sub-Project 1. We now add blog routes to them.

- [ ] **Step 1: Update `src/app/sitemap.ts` to include blog routes**

Add these imports at the top:

```typescript
import { getAllPosts } from "@/lib/blog";
```

Add these entries to the returned array (after calculator entries):

```typescript
{
  url: "https://financialsimulators.in/blog",
  lastModified: new Date(),
  changeFrequency: "weekly" as const,
  priority: 0.8,
},
...getAllPosts().map((post) => ({
  url: `https://financialsimulators.in/blog/${post.slug}`,
  lastModified: new Date(post.date),
  changeFrequency: "monthly" as const,
  priority: 0.7,
})),
```

- [ ] **Step 2: Update `src/app/llms.txt/route.ts` to include blog section**

Add this import:

```typescript
import { getAllPosts } from "@/lib/blog";
```

Add a `## Blog` section after the calculators section:

```typescript
body += "\n## Blog\n\n";
body += "- [Blog Index](/blog): Financial stories for common Indians\n";
for (const post of getAllPosts()) {
  body += `- [${post.title}](/blog/${post.slug})\n`;
}
```

- [ ] **Step 3: Update `src/app/llms-full.txt/route.ts` to include blog content**

Add this import:

```typescript
import { getAllPosts } from "@/lib/blog";
```

Add blog post content after calculator descriptions:

```typescript
body += "\n## Blog Posts\n\n";
for (const post of getAllPosts()) {
  body += `### ${post.title}\n\n`;
  body += `${post.description}\n\n`;
  body += `${post.content}\n\n`;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/sitemap.ts src/app/llms.txt/route.ts src/app/llms-full.txt/route.ts
git commit -m "feat(blog): add blog routes to sitemap and llms.txt"
```

---

### Task 10: Build Verification

- [ ] **Step 1: Run a full build**

```bash
npm run build
```

Expected: Build succeeds with all blog routes statically generated.

- [ ] **Step 2: Run dev server and verify**

```bash
npm run dev
```

Verify:
- `/blog` shows the blog index with category filter
- `/blog/budget-2026-tax-slabs` renders the full blog post
- CalculatorCard embeds render with correct links
- Blog post has Article JSON-LD in the page source (view source)
- `/sitemap.xml` includes blog routes
- `/llms.txt` includes blog section

- [ ] **Step 3: Commit any fixes**

If any fixes were needed:

```bash
git add -A
git commit -m "fix(blog): build verification fixes"
```