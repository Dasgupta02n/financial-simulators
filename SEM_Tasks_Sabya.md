# SEM Tasks — Sabya's Execution Plan

> **Goal:** 100K daily visits → 10M daily visits in 6 months, ₹0 budget
> **Site:** financialsimulators.in
> **Created:** 2026-04-23

---

## WEEK 1: Technical SEO (Days 1–7)

### Task 1: Submit Sitemap to Google Search Console
- **What:** Register the site with GSC and submit `sitemap.xml`
- **How:**
  1. Go to [search.google.com/search-console](https://search.google.com/search-console)
  2. Click "Add property" → enter `financialsimulators.in`
  3. Verify ownership (DNS TXT record or HTML tag in layout)
  4. Once verified, go to Sitemaps → submit `https://financialsimulators.in/sitemap.xml`
  5. Also add `www.financialsimulators.in` as a separate property and set preferred domain to `financialsimulators.in`
- **Timeline:** Day 1
- **Done when:** Sitemap shows "Submitted" and pages start appearing in GSC index coverage report

### Task 2: Submit Sitemap to Bing Webmaster Tools
- **What:** Register with Bing for additional 2–5% search traffic
- **How:**
  1. Go to [bing.com/webmasters](https://www.bing.com/webmasters)
  2. Add site → verify via DNS or HTML tag
  3. Submit sitemap URL
- **Timeline:** Day 1
- **Done when:** Bing starts crawling pages (check crawl stats)

### Task 3: Request Indexing for All Pages
- **What:** Manually request indexing for all current URLs in GSC
- **How:**
  1. Open GSC → URL Inspection
  2. Paste each URL one by one: `/`, `/sip-simulator`, `/emi-analyzer`, `/tax-sandbox`, `/ppf-calculator`, `/compound-interest-calculator`, `/hra-calculator`, `/fd-comparator`, `/swp-stress-test`, `/fire-matrix`, `/ctc-optimizer`, `/nps-modeler`, `/goal-planner`, `/accumulation-calculator`, `/blog`, and every blog post URL
  3. Click "Request Indexing" for each
  4. There are ~55 URLs — do them all in one sitting
- **Timeline:** Day 2
- **Done when:** All URLs show "Submitted for indexing" in GSC

### Task 4: Add Organization Schema to Root Layout
- **What:** Add `Organization` structured data to `src/app/layout.tsx`
- **How:**
  1. Open `src/app/layout.tsx`
  2. In the `<head>` section, add a JSON-LD script with Organization schema:
     - `@type`: Organization
     - `name`: Financial Simulators
     - `url`: https://financialsimulators.in
     - `logo`: (add logo URL when available)
     - `sameAs`: (add social profile URLs as they're created)
  3. Keep it minimal — name, url, description for now
- **Timeline:** Day 2
- **Done when:** Organization schema appears in Rich Results Test ([search.google.com/test/rich-results](https://search.google.com/test/rich-results))

### Task 5: Set Up Google Analytics 4
- **What:** Add GA4 tracking to monitor traffic, completions, and user behavior
- **How:**
  1. Go to [analytics.google.com](https://analytics.google.com)
  2. Create a GA4 property for `financialsimulators.in`
  3. Get the Measurement ID (G-XXXXXXXXXX)
  4. Add `@next/third-parties` or the GA4 script to `src/app/layout.tsx`
  5. Set up custom events: `calculator_complete`, `blog_read`, `share_click`
- **Timeline:** Day 2
- **Done when:** Real-time data appears in GA4 dashboard

### Task 6: Add hreflang Tags
- **What:** Add `hreflang="en-IN"` alternate tags for India targeting
- **How:**
  1. In `src/app/layout.tsx` or in each page's metadata, add `alternates.languages` with `en-IN`
  2. Verify with Rich Results Test
- **Timeline:** Day 3
- **Done when:** hreflang tags appear in page source

### Task 7: Add Cache-Control Headers for SSG Pages
- **What:** Set proper cache headers for static pages (SSG) and ISR pages
- **How:**
  1. In `next.config.ts`, add headers configuration:
     - SSG pages: `Cache-Control: public, s-maxage=86400, stale-while-revalidate=3600`
     - ISR pages: `Cache-Control: public, s-maxage=3600, stale-while-revalidate=60`
  2. Deploy and verify with browser dev tools
- **Timeline:** Day 3
- **Done when:** Cache headers appear in network response for calculator pages

### Task 8: Add Article Schema to Blog Posts
- **What:** Add `Article` structured data with `datePublished`, `dateModified`, `author` to blog post pages
- **How:**
  1. Open `src/app/blog/[slug]/page.tsx`
  2. Add JSON-LD with Article schema using blog post metadata (title, description, date, author)
  3. Verify with Rich Results Test
- **Timeline:** Day 4
- **Done when:** Blog posts pass Rich Results Test for Article schema

---

## WEEK 2–3: Calculator Expansion (Days 8–21)

### Task 9: Build Remaining P0 Calculators
- **What:** Build Step-up SIP Calculator (P0 priority, 6K monthly searches)
- **How:**
  1. Create `src/content/calculators/stepup-sip.json` with FAQ, HowTo, metadata
  2. Create `src/lib/calculators/stepup-sip/engine.ts` and `types.ts` — the SIP engine already handles step-up; this calculator focuses the UI on step-up comparisons
  3. Create `src/components/stepup-sip/stepup-sip-calculator.tsx` — slider UI for step-up percentage vs regular SIP
  4. Create `src/app/step-up-sip-calculator/page.tsx`
  5. Add to homepage CALCULATORS array and sitemap.ts
- **Timeline:** Day 8–9
- **Done when:** Calculator works on `/step-up-sip-calculator` with real results and chart

### Task 10: Build P1 Calculators (5 calculators)
- **What:** Build GST, Salary, Simple Interest, EPF, and Term Insurance calculators
- **How:** Follow the same pattern for each:
  1. JSON config → engine/types → React component → page route → homepage + sitemap
  2. Each calculator must have 4+ FAQ questions, HowTo steps, and unique meta title/description
- **Timeline:** Days 10–18 (2 days per calculator)
- **Done when:** All 5 calculators live and functional

### Task 11: Build P2 Calculators (5 calculators)
- **What:** Build Gratuity, Capital Gains Tax, Inflation, Mutual Fund Return calculators
- **How:** Same pattern as above
- **Timeline:** Days 19–21 (faster since pattern is established)
- **Done when:** All 5 calculators live and functional

---

## WEEK 2–4: Blog Content Burst (Days 8–28)

### Task 12: Write Blog Posts — Cluster 1 (SIP & Mutual Funds, 25 posts)
- **What:** Write 25 blog posts targeting SIP-related keywords
- **How:**
  1. Use AI-assisted writing (Claude, ChatGPT) to draft, then edit for accuracy and voice
  2. Each post: 1,500–2,500 words, includes calculator embed, internal links to 2–3 related calculators
  3. Target keywords: "SIP vs lump sum" (27K/mo), "best SIP plans 2026" (90K/mo), etc.
  4. Add to `src/content/blog/` as MDX files
  5. Run `npm run prebuild` to update blog index
- **Timeline:** Days 8–14 (3–4 posts/day)
- **Done when:** 25 posts published and submitted to GSC for indexing

### Task 13: Write Blog Posts — Cluster 2 (Tax & Salary, 25 posts)
- **What:** Write 25 blog posts targeting tax-related keywords
- **How:** Same process as Task 12. Keywords: "old vs new tax regime" (301K/mo), "80C deductions" (110K/mo), etc.
- **Timeline:** Days 15–21
- **Done when:** 25 posts published

### Task 14: Write Blog Posts — Clusters 3–5 (57 posts)
- **What:** Write posts for Loans/EMI (25), Retirement/NPS (20), FD/Savings (12)
- **How:** Same process
- **Timeline:** Days 22–28
- **Done when:** 57 posts published (total: 150 blog posts)

---

## WEEK 4: Distribution Engine (Days 22–28)

### Task 15: Start Quora Campaign
- **What:** Answer financial questions on Quora with calculator links
- **How:**
  1. Create a Quora account (or use existing one)
  2. Follow these topics: SIP, Mutual Funds, Personal Finance India, Tax Planning India, PPF, FD Rates
  3. Set up Quora notifications for new questions in these topics
  4. Answer 10 questions/day. Format:
     - Start with a clear, direct answer (2–3 sentences)
     - Add a detailed explanation with numbers
     - End with: "You can verify these numbers with the [Calculator Name] at financialsimulators.in/xxx"
  5. DO NOT just drop links — provide genuine value first
- **Timeline:** Start Day 22, continue daily
- **Target:** 300 answers by end of Month 1 → 5K–10K referral visits/month

### Task 16: Start Reddit Campaign
- **What:** Post and comment on Indian finance subreddits
- **How:**
  1. Active subreddits: r/IndiaInvestments, r/IndiaFinance, r/personalfinanceindia, r/IndianStockMarket
  2. Post format: "I built a calculator that shows your real SIP returns after inflation and tax. Here's what ₹10K/month actually gets you."
  3. Comment format: Answer questions with specific numbers + calculator link
  4. DO NOT spam — provide value first, link second
  5. 3 posts/day + 10 comments/day
- **Timeline:** Start Day 22, continue daily
- **Target:** 3K–5K referral visits/month

### Task 17: Start Twitter/X Campaign
- **What:** Post financial insights with calculator links
- **How:**
  1. Create @FinSimIndia (or similar) account
  2. Post format: "₹10,000 SIP for 20 years → ₹1.02 Cr nominal, but only ₹30.5 L real value. Check yours → financialsimulators.in/sip-simulator"
  3. Thread format: "🧵 5 things your SIP calculator won't tell you"
  4. Use hashtags: #SIPCalculator #TaxPlanning #PersonalFinance #IndiaInvestments
  5. 5 tweets/day + 1 thread/day
- **Timeline:** Start Day 22
- **Target:** 1K–3K referral visits/month

### Task 18: Create Telegram Channel
- **What:** Create @FinancialSimulators Telegram channel
- **How:**
  1. Create channel with name "Financial Simulators — Real Returns, No Marketing"
  2. Daily post: "Today's number: ₹X SIP for Y years = ₹Z nominal, ₹W real"
  3. Cross-post to 10+ Indian finance Telegram groups (with permission)
  4. Pin a message with link to the site
- **Timeline:** Day 23
- **Target:** 1K–3K visits/month

### Task 19: Join WhatsApp Groups
- **What:** Share calculator results in Indian finance WhatsApp groups
- **How:**
  1. Ask friends/family for invites to finance-related WhatsApp groups
  2. Search WhatsApp group links on Google: "personal finance whatsapp group india"
  3. Join 20+ groups
  4. Share 1 result card per day per group (with context, not spam)
  5. Share "Did you know?" facts with calculator links
- **Timeline:** Day 24–28 (set up), then ongoing
- **Target:** 2K–5K visits/month

---

## MONTH 2: Programmatic SEO Launch (Days 29–56)

### Task 20: Build Programmatic Page Generator
- **What:** Create a Next.js dynamic route system that generates hundreds of calculator result pages
- **How:**
  1. Create route pattern: `/src/app/[calc]/[amount]-[duration]/page.tsx`
  2. Example URLs:
     - `/sip-simulator/10000-rupee-for-10-years`
     - `/ppf-calculator/150000-rupee-for-15-years`
     - `/emi-analyzer/20-lakh-home-loan-for-20-years`
  3. Each page includes:
     - Pre-computed results table
     - Unique meta title with specific numbers
     - Unique meta description with specific numbers
     - FAQPage schema with amount-specific questions
     - HowTo schema
     - "Try the interactive calculator" CTA → main calculator page
     - 500–800 words of contextual content
     - Internal links to related calculators and blog posts
  4. Use `generateStaticParams()` to pre-build all combinations at build time
  5. Add all new URLs to sitemap
- **Timeline:** Days 29–35
- **Done when:** 346 programmatic pages generated and live

### Task 21: Scale Programmatic to 3,000 Pages
- **What:** Expand the generator to cover more amount/duration combinations
- **How:**
  1. Expand SIP combinations: 25 amounts × 8 durations = 200 pages
  2. Expand PPF combinations: 15 × 6 = 90 pages
  3. Add EMI loan type variations: 10 × 5 × 3 = 150 pages
  4. Add FD bank comparisons: 15 × 6 = 90 pages
  5. Add tax regime comparisons: 12 × 2 × 3 = 72 pages
  6. Add HRA city variations: 10 × 8 = 80 pages
  7. Total target: ~3,000 pages (including Month 1 content)
- **Timeline:** Days 36–56
- **Done when:** Sitemap contains 3,000+ URLs and they're submitted to GSC

### Task 22: Continue Blog Content (150 → 300 posts)
- **What:** Write 150 more blog posts in existing + new clusters
- **How:**
  1. Add new cluster: Calculator result pages ("What ₹10,000 SIP becomes in 15 years")
  2. Add new cluster: Newsjack content (react to RBI rate changes, budget announcements)
  3. Continue Quora/Reddit/Twitter distribution
- **Timeline:** Days 29–56
- **Done when:** 300 total blog posts live

### Task 23: Start YouTube Channel
- **What:** Create simple screen-recording calculator tutorials
- **How:**
  1. Install OBS Studio (free)
  2. Record 3 videos/week: calculator walkthroughs with voiceover
  3. Format: "₹10,000 SIP for 10 Years — See Real Returns (After Tax & Inflation)"
  4. Thumbnails: Calculator result screenshots with big numbers
  5. Upload to YouTube with SEO-optimized titles and descriptions
- **Timeline:** Start Day 35
- **Target:** 5K–10K views/month by end of Month 2

---

## MONTH 3: Indexing & Authority (Days 57–84)

### Task 24: Scale to 10,000 Pages
- **What:** Aggressively expand programmatic page count
- **How:**
  1. SIP combinations: 25 × 8 × 3 step-up rates = 600 pages
  2. PPF combinations: expanded
  3. EMI for all loan types: 300 pages
  4. FD comparisons across banks: 450 pages
  5. Tax regime comparisons: 60 pages
  6. HRA city calculations: 240 pages
  7. NPS, SWP, FIRE, Compound Interest, Inflation, GST calculations
  8. Comparison pages (A vs B format): 500 pages
  9. Total new: ~3,000 pages
- **Timeline:** Days 57–70
- **Done when:** Running total reaches 10,000 indexed pages

### Task 25: Scale Blog Content (300 → 500 posts)
- **What:** 200 new posts including 50 "What does ₹X become in Y years?", 50 newsjack, 50 comparisons, 50 deep-dives
- **Timeline:** Days 57–84
- **Done when:** 500 total blog posts

### Task 26: Guest Posting Outreach
- **What:** Pitch guest posts to 30 Indian finance blogs
- **How:**
  1. Target sites: JagoInvestor, StableInvestor, MoneyNamaste, etc.
  2. Pitch angle: unique data from calculators ("We ran 10,000 SIP simulations and found...")
  3. Aim for 10 published guest posts = 10+ quality backlinks
- **Timeline:** Days 57–84
- **Target:** 10 published guest posts with backlinks

---

## MONTH 4: Localization & Compounding (Days 85–112)

### Task 27: Hindi Localization
- **What:** Create Hindi versions of top 25 calculators and 100 blog posts
- **How:**
  1. Set up Next.js i18n routing: `/hi/ppf-calculator` → "पीपीएफ कैलकुलेटर"
  2. Translate calculator UI labels, FAQs, and meta descriptions to Hindi
  3. Translate 100 top-performing blog posts to Hindi
  4. Add `hreflang` alternates for all Hindi pages
  5. Submit Hindi sitemap to GSC
- **Timeline:** Days 85–112
- **Target:** 5x addressable audience (Hindi internet users: 500M+)

### Task 28: Embeddable Widget Program
- **What:** Create embeddable calculator widgets for free backlinks
- **How:**
  1. Build `/embed/sip-calculator`, `/embed/ppf-calculator`, etc. as iframe-able pages
  2. Add a "Embed this calculator" section on each calculator page with copy-paste code
  3. Contact 100+ Indian finance bloggers offering free embed widgets
  4. Each embed includes a backlink to financialsimulators.in
- **Timeline:** Days 85–100
- **Target:** 50 sites embedding within 2 months = 50+ backlinks

### Task 29: Scale Programmatic to 30,000 Pages
- **What:** Add 5,000 Hindi programmatic pages + 5,000 more English combinations + bank-specific pages + city-specific pages
- **Timeline:** Days 85–112
- **Done when:** 30,000 total indexed pages

---

## MONTH 5: Viral & Scale (Days 113–140)

### Task 30: Add WhatsApp/Twitter Share Buttons to All Calculator Results
- **What:** Every calculator result generates a shareable card
- **How:**
  1. Add share buttons to calculator result panels (WhatsApp, Twitter/X, Copy Link)
  2. Generate result card images using Canvas API
  3. Pre-fill WhatsApp message: "My SIP gives ₹X real value after 20 years! Check yours → [link]"
  4. Target: 10% of users share → viral coefficient
- **Timeline:** Days 113–119

### Task 31: Create Linkable Assets
- **What:** Build shareable content that earns backlinks naturally
- **How:**
  1. "India's Most Honest Financial Calculator" — data study with original findings
  2. "What ₹1 Crore Is Actually Worth Over 20 Years" — infographic
  3. "SIP vs FD vs Real Estate: 20-Year Returns Compared" — interactive chart
  4. "How Much Tax Do Indians Actually Pay?" — calculator + data
  5. Promote these on Reddit, Twitter, and to journalists
- **Timeline:** Days 120–140

### Task 32: Start Email Capture (Free Tier)
- **What:** Build email list using free tools
- **How:**
  1. Sign up for Substack or Buttondown (free up to 1,000 subscribers)
  2. Create lead magnet: "Your SIP Is Lying to You — 5 Calculator Truths" (free PDF)
  3. Add email capture pop-up on calculator pages
  4. Weekly email: "This Week's Number" — one striking financial insight + calculator link
- **Timeline:** Days 113–140
- **Target:** 5,000 subscribers by end of Month 5

### Task 33: Scale Programmatic to 50,000 Pages
- **Timeline:** Days 113–140
- **Target:** 50,000 total indexed pages

---

## MONTH 6: Dominance (Days 141–168)

### Task 34: Regional Language Expansion
- **What:** Add Tamil, Telugu, Bengali, Marathi translations
- **How:**
  1. Set up i18n routes for each language: `/ta/`, `/te/`, `/bn/`, `/mr/`
  2. Translate top 25 calculators and 100 blog posts for each language
  3. Generate 5,000 programmatic pages per language (20,000 total)
  4. Submit regional sitemaps to GSC
- **Timeline:** Days 141–168
- **Target:** 220M+ additional addressable internet users

### Task 35: Scale to 100,000 Pages
- **What:** Total page count reaches 100K
- **Breakdown:**
  - English programmatic: 30,000
  - Hindi programmatic: 20,000
  - Regional languages: 20,000
  - Bank-specific comparisons: 10,000
  - Calculators: 120
  - Blog posts: 1,500
  - Embed pages: 50
- **Timeline:** Day 168
- **Target:** 100,000 indexed pages, 10M daily visits

### Task 36: PWA Conversion
- **What:** Convert site to Progressive Web App for mobile home screen installation
- **How:**
  1. Add `manifest.json` with app name, icons, theme color
  2. Add service worker for offline caching of calculator pages
  3. Add "Add to Home Screen" prompt for mobile users
  4. Consider push notifications for "New calculator" or "Tax season reminder"
- **Timeline:** Days 155–168

### Task 37: Partnership Program
- **What:** Get 20+ sites embedding calculator widgets
- **How:**
  1. Outreach to Indian finance bloggers with embed code
  2. Contact 5+ YouTube finance channels about calculator references
  3. Pitch 2+ fintech apps for "Powered by Financial Simulators" links
  4. Partner with 10+ Reddit/Telegram communities
- **Timeline:** Days 141–168
- **Target:** 50+ backlinks from embed widgets

---

## Daily Execution Schedule (Ongoing)

| Time Block | Activity | Output |
|---|---|---|
| Morning (2 hrs) | Blog post writing | 2–3 posts |
| Mid-morning (1 hr) | Quora answers | 15–20 answers |
| Afternoon (30 min) | Reddit posts | 3–5 posts |
| Afternoon (30 min) | Twitter/X threads | 1–2 threads |
| Evening (1 hr) | Programmatic page review | Review 50–100 generated pages |
| **Total** | **6 hours** | **High output** |

### Weekly Schedule

| Day | Focus |
|---|---|
| Monday | New calculator + blog posts |
| Tuesday | Programmatic SEO + technical |
| Wednesday | Blog posts + Quora |
| Thursday | Distribution (Reddit, Twitter, Telegram, WhatsApp) |
| Friday | Link outreach + guest post pitches |
| Saturday | Analytics review + content planning |
| Sunday | Reactive content (newsjacking) |

---

## Key Metrics to Track Weekly

| KPI | Where to Check | Month 1 Target | Month 6 Target |
|---|---|---|---|
| Organic visits/day | GA4 | 5K | 10M |
| Indexed pages | GSC | 500 | 100K |
| Keywords in top 10 | GSC | 20 | 5,000 |
| Backlinks | GSC + Ahrefs free | 20 | 10,000 |
| Calculator completions/day | GA4 events | 500 | 1M |
| Blog posts live | Manual count | 150 | 1,500 |
| Quora answers | Manual | 300 | 3,000+ |
| YouTube subscribers | YouTube Studio | 0 | 5,000 |
| Email subscribers | Substack | 0 | 50,000 |

---

*Plan created: 2026-04-23 | Owner: Sabya | Budget: ₹0 | Review: Weekly strategy review, bi-weekly KPI check*