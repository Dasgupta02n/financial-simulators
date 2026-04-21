# Blog, CMS & SEO/SEM Design Spec

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a blog section, a CMS admin panel, and SEO/SEM/AI-search optimization to the Financial Simulators site — built on the existing anti-marketing philosophy (zero PII, zero tracking, client-side math).

**Architecture:** MDX content layer for blog posts and calculator configs, stored in the git repo. A password-gated admin panel at `/admin` manages content via the GitHub API (commit + push → Vercel auto-rebuilds). SEO infrastructure (llms.txt, JSON-LD, sitemap, per-page metadata) makes every page discoverable by search engines and AI agents.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, MDX (next-mdx-remote), GitHub API (octokit), Ink & Ember dark theme.

---

## Sub-Project Decomposition

This spec covers 3 sub-projects, each deployed independently:

1. **SEO/AI Foundation** — URL restructuring, llms.txt, JSON-LD, sitemap, per-page metadata
2. **Blog Section** — MDX blog posts, category taxonomy, calculator tie-ins
3. **CMS Admin Panel** — Blog manager, calculator config, SEO toolkit, SEM dashboard

Build order: SEO/AI Foundation → Blog Section → CMS Admin Panel. Each produces working, testable software on its own.

---

## 1. Site Architecture & URL Structure

### Current State
- All 10 calculators on a single page (`/`), switched via client-side tabs
- No unique URLs per calculator
- No blog section
- Single title/description for entire site
- No llms.txt, no structured data, no sitemap

### Proposed Structure

Every page gets its own route, metadata, and structured data:

| Route | Content |
|-------|---------|
| `/` | Homepage with calculator overview + featured blog posts |
| `/sip-simulator` | SIP Simulator |
| `/emi-analyzer` | EMI Analyzer |
| `/tax-sandbox` | Tax Sandbox |
| `/accumulation-calculator` | Accumulator |
| `/fd-comparator` | FD Comparator |
| `/swp-stress-test` | SWP Stress Test |
| `/fire-matrix` | FIRE Matrix |
| `/ctc-optimizer` | CTC Optimizer |
| `/nps-modeler` | NPS Modeler |
| `/goal-planner` | Goal Planner |
| `/blog` | Blog index with category filter |
| `/blog/[slug]` | Individual blog post |
| `/admin` | CMS admin panel (password-gated) |
| `/llms.txt` | AI agent ingestion summary |
| `/llms-full.txt` | AI agent full content export |
| `/sitemap.xml` | Search engine sitemap |
| `/robots.txt` | Crawler directives |

### Homepage Changes
- Replace single-page tab-switcher with a card grid linking to each calculator's dedicated page
- Show featured blog posts below the calculator grid
- Hero text maintains the anti-marketing voice: "Real returns. No marketing."

---

## 2. SEO & AI Ingestion Layer

### 2.1 llms.txt

Served at `/llms.txt`. Provides a concise markdown summary of the entire site for AI agents.

Structure:
```markdown
# Financial Simulators

> Real-return financial calculators for Indian investors. Zero PII, zero tracking, all math runs client-side.

## Calculators
- [SIP Simulator](/sip-simulator): See actual returns after inflation and tax
- [EMI Analyzer](/emi-analyzer): Compare loan EMIs with real cost
- [Tax Sandbox](/tax-sandbox): Old vs New regime, side by side
- [Accumulation Calculator](/accumulation-calculator): Lump sum vs SIP comparison
- [FD Comparator](/fd-comparator): Real FD returns after tax and inflation
- [SWP Stress Test](/swp-stress-test): Will your corpus survive a crash?
- [FIRE Matrix](/fire-matrix): When can you retire?
- [CTC Optimizer](/ctc-optimizer): Maximize your in-hand salary
- [NPS Modeler](/nps-modeler): Project your pension and corpus
- [Goal Planner](/goal-planner): Monthly SIP needed per goal

## Blog
- [Blog Index](/blog): Financial stories for common Indians
- (Auto-generated list of blog posts with titles and slugs)

## Use Cases
- "How much SIP do I need for ₹1 crore?" → /sip-simulator
- "Is old or new tax regime better?" → /tax-sandbox
- "Will my retirement fund last?" → /swp-stress-test
- "When can I retire?" → /fire-matrix
- "How much of my CTC do I actually keep?" → /ctc-optimizer
- "How much pension will NPS give me?" → /nps-modeler
```

### 2.2 llms-full.txt

Served at `/llms-full.txt`. Complete text content of every calculator description and blog post. Auto-generated at build time from MDX frontmatter + content.

### 2.3 JSON-LD Structured Data

Per calculator page:
- **FAQPage** schema — 3-5 common questions with answers about the calculator's topic
- **HowTo** schema — step-by-step instructions for using the calculator
- **WebApplication** schema — marks the page as an interactive tool

Per blog post:
- **Article** schema — title, description, datePublished, author, image
- **FAQPage** schema — if the post contains Q&A content

JSON-LD is rendered via Next.js `<script type="application/ld+json">` tags in each page's layout.

### 2.4 Next.js Metadata API

Each page uses `generateMetadata` to produce unique:
- `title` — e.g., "SIP Simulator — Real Returns Calculator | Financial Simulators"
- `description` — e.g., "See what your SIP actually earns after inflation and tax. Client-side, no PII, no signup."
- `openGraph` — title, description, image, url
- `alternates.canonical` — canonical URL for the page
- `robots` — index/follow directives

### 2.5 sitemap.xml

Auto-generated via Next.js `sitemap.ts` in `src/app/`. Includes:
- All 10 calculator routes
- `/blog` index
- All published blog posts
- `lastmod` dates from MDX frontmatter
- `changefreq` and `priority` hints

### 2.6 robots.txt

```
User-agent: *
Allow: /
Disallow: /admin

Sitemap: https://financialsimulators.in/sitemap.xml
```

---

## 3. Blog Section

### 3.1 Blog Index (`/blog`)

- Category filter tabs: All | Markets & Policy | Personal Finance | Tax & CTC | Retirement
- 2-column card grid on desktop, 1-column on mobile
- Each card shows: category badge, title, excerpt, date, calculator tie-in badges
- Posts sorted by date (newest first)
- Featured posts shown larger at the top

### 3.2 Blog Post (`/blog/[slug]`)

- Full MDX content rendered with the Ink & Ember dark theme
- Embedded `<CalculatorCard id="calculator-id" />` components render green-bordered callout cards with:
  - Calculator name
  - Brief description of what the reader can do
  - "Open →" button linking to the calculator page
- Tags and related calculators shown at the bottom
- SEO: Article JSON-LD, unique meta title/description, Open Graph image
- Reading time displayed (auto-calculated from word count)

### 3.3 MDX Content Architecture

Blog posts stored in `src/content/blog/` as `.mdx` files.

Frontmatter schema:
```yaml
---
title: "Budget 2026: What the new tax slabs mean for your take-home pay"
description: "The new regime just got more attractive. Here's exactly how much more you'll keep each month."
date: "2026-03-15"
category: "markets-policy"    # markets-policy | personal-finance | tax-ctc | retirement
tags: ["budget-2026", "tax-regime", "take-home-pay"]
calculators: ["tax-sandbox", "ctc-optimizer"]
readTime: 6                     # auto-calculated if omitted
featured: true
status: "published"             # published | draft (drafts excluded from blog index and sitemap)
---
```

Categories:
- `markets-policy` — RBI rate changes, budget impacts, regulatory shifts, market crashes
- `personal-finance` — SIP, FD, EMI, savings strategies, inflation education
- `tax-ctc` — regime comparison, salary optimization, deduction strategies
- `retirement` — FIRE, NPS, SWP, pension planning, corpus management

### 3.4 CalculatorCard MDX Component

A reusable component rendered inside blog posts:
```tsx
<CalculatorCard id="tax-sandbox" />
```

Renders as:
- Green-bordered card (`border-gain/40`, `bg-gain/10`)
- Calculator name as heading
- One-line description from calculator config
- "Open →" button linking to the calculator's dedicated page

### 3.5 Anti-Marketing Voice

All blog content follows these rules:
- Start with a question the reader actually has
- Answer with real numbers, not vague advice
- Use plain language, no financial jargon (or explain it immediately)
- Link directly to calculators so readers can verify with their own numbers
- No product recommendations, no affiliate links, no fear-of-missing-out framing

---

## 4. CMS Admin Panel

### 4.1 Authentication

- Password-gated route at `/admin`
- Single password stored as `NEXT_PUBLIC_ADMIN_PASSWORD` environment variable (or `ADMIN_PASSWORD` for server-side)
- No user accounts, no PII, stays zero-tracking
- Password check on page load; session stored in localStorage for convenience
- On Vercel: set the env var in the Vercel dashboard

### 4.2 Blog Manager Tab

**Post list view:**
- Table of all posts (title, category, date, status badge: Published/Draft)
- "+ New Post" button
- Click "Edit" on any post to open the editor

**Post editor:**
- Title field (text input)
- Description field (textarea, used for meta description)
- Category dropdown (4 categories)
- Tags editor (add/remove tags)
- Related calculators selector (multi-select from 10 calculators)
- Status toggle (Draft / Published)
- MDX content editor (textarea with monospace font, raw MDX)
- "Save Draft" button (commits with draft status, excludes from blog index/sitemap)
- "Publish" button (commits with published status, triggers git push → Vercel rebuild)

### 4.3 Calculator Config Tab

Per calculator (selectable via tab bar):
- Meta title (with character count indicator: Good/Too Long)
- Meta description (with character count indicator)
- CalcExplainer text (editable rich text for the "How to read this" explainer panel)
- FAQ entries for JSON-LD (question + answer pairs, add/remove)
- Default values (editable — changes the slider defaults on the calculator page)

Config stored in `src/content/calculators/[id].json` files.

### 4.4 SEO Toolkit Tab

**Per-page SEO overview:**
- List of all pages (calculators + blog posts) with SEO status indicators
- Click any page to edit: meta title, meta description, Open Graph image, canonical URL
- JSON-LD schema preview (read-only, auto-generated from FAQ entries + calculator config)

**Sitemap controls:**
- View current sitemap structure
- Exclude/include specific pages from sitemap

### 4.5 SEM Dashboard Tab

**Keyword suggestions:**
- Pre-seeded list of high-value financial calculator keywords for the Indian market
- Mapped to the calculator page that should rank for each keyword
- Shows which pages have content gaps for their target keywords

**Internal link opportunities:**
- Scans blog posts for mentions of calculator topics without links
- Suggests adding `<CalculatorCard>` embeds or text links
- Shows missing connections in the internal link graph

**Social share previews:**
- Open Graph preview for each page (Facebook/LinkedIn style card)
- Twitter/X card preview
- Edit OG title/description/image

**Performance hints:**
- Core Web Vitals checklist (LCP, CLS, INP)
- Page weight indicator
- Mobile responsiveness check

### 4.6 Publishing Flow

When "Publish" or "Save Draft" is clicked:

1. Admin panel generates the MDX file with updated frontmatter
2. Admin panel calls the GitHub API (via `octokit`) to:
   a. Get the current file content (for SHA)
   b. Create or update the file in the repository
3. GitHub webhook triggers Vercel rebuild
4. Site is live with updated content in ~30 seconds

Required environment variables:
- `GITHUB_TOKEN` — GitHub Personal Access Token with repo write access
- `GITHUB_REPO_OWNER` — Repository owner (e.g., "username")
- `GITHUB_REPO_NAME` — Repository name (e.g., "calculator")
- `GITHUB_BRANCH` — Branch to commit to (e.g., "main")

For calculator config changes, the same flow writes to `src/content/calculators/[id].json`.
For SEO metadata changes, the flow writes to `src/content/calculators/[id].json` — the calculator page's `generateMetadata` function reads from this JSON file at build time. This avoids modifying TypeScript source files via the GitHub API, which is fragile.

---

## 5. File Structure

### New files to create:

```
src/
├── app/
│   ├── page.tsx                          # Modified: homepage with calculator grid + featured posts
│   ├── layout.tsx                        # Modified: add site-wide structured data
│   ├── sip-simulator/page.tsx            # New: dedicated SIP page
│   ├── emi-analyzer/page.tsx             # New: dedicated EMI page
│   ├── tax-sandbox/page.tsx              # New: dedicated Tax page
│   ├── accumulation-calculator/page.tsx  # New
│   ├── fd-comparator/page.tsx            # New
│   ├── swp-stress-test/page.tsx          # New
│   ├── fire-matrix/page.tsx              # New
│   ├── ctc-optimizer/page.tsx            # New
│   ├── nps-modeler/page.tsx             # New
│   ├── goal-planner/page.tsx            # New
│   ├── blog/
│   │   ├── page.tsx                      # New: blog index
│   │   └── [slug]/
│   │       └── page.tsx                  # New: individual blog post
│   ├── admin/
│   │   └── page.tsx                      # New: CMS admin panel
│   ├── llms.txt/
│   │   └── route.ts                      # New: AI agent summary
│   ├── llms-full.txt/
│   │   └── route.ts                      # New: AI agent full content
│   ├── sitemap.ts                        # New: auto-generated sitemap
│   └── robots.ts                         # New: robots.txt
├── content/
│   ├── blog/
│   │   ├── budget-2026-tax-slabs.mdx     # New: sample blog post
│   │   ├── sip-real-returns.mdx          # New: sample blog post
│   │   └── ...                           # More blog posts
│   └── calculators/
│       ├── sip.json                      # New: SIP calculator config
│       ├── emi.json                      # New: EMI calculator config
│       └── ...                           # Config for each calculator
├── lib/
│   ├── blog.ts                           # New: MDX loading, frontmatter parsing
│   ├── seo.ts                            # New: structured data generators
│   └── github-api.ts                     # New: GitHub API wrapper for CMS
└── components/
    ├── blog/
    │   ├── blog-card.tsx                 # New: blog post card for index
    │   ├── calculator-card-embed.tsx     # New: CalculatorCard MDX component
    │   └── category-filter.tsx           # New: category filter tabs
    ├── admin/
    │   ├── admin-layout.tsx              # New: admin shell with tabs
    │   ├── post-editor.tsx              # New: blog post editor
    │   ├── calculator-config.tsx        # New: calculator config editor
    │   ├── seo-toolkit.tsx              # New: SEO metadata manager
    │   └── sem-dashboard.tsx            # New: SEM insights dashboard
    └── shared/
        └── calculator-page-shell.tsx    # New: shared layout for calculator pages
```

### Existing files to modify:

- `src/app/page.tsx` — Replace tab-switcher with calculator grid + blog highlights
- `src/app/layout.tsx` — Add site-wide WebApplication JSON-LD
- Each calculator component — No changes needed (imported by new dedicated pages)

---

## 6. Calculator Page Shell

Each calculator page (`/sip-simulator/page.tsx`, etc.) uses a shared `CalculatorPageShell` component that provides:
- `generateMetadata` — unique title, description, OG tags per calculator
- JSON-LD script injection (FAQ + HowTo + WebApplication schemas)
- Breadcrumb navigation (Home > Calculator Name)
- "Back to all calculators" link
- Footer with calculator-specific tags

The calculator component itself (e.g., `<SIPCalculator />`) is rendered inside this shell unchanged.

---

## 7. Design Constraints

- **Zero PII**: Admin panel uses password only, no user accounts, no analytics tracking users
- **Zero tracking**: No Google Analytics, no Facebook Pixel, no third-party scripts. SEM dashboard uses server-side data only (keyword lists, internal link analysis)
- **Client-side math**: All calculator computation remains in the browser. CMS only manages content, not computation
- **Anti-marketing voice**: All copy (meta descriptions, blog posts, UI text) uses plain language, no jargon, no fear-based framing
- **Ink & Ember theme**: All new components (blog cards, admin panel, calculator shell) use the existing dark theme tokens
- **Mobile-first**: Blog index, calculator grid, and admin panel all responsive
- **Performance**: Blog posts are statically generated at build time. Admin panel is client-side only. No runtime database queries