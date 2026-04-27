# Pending Tasks — Financial Simulators

> **Last updated:** 2026-04-23
> **Status:** Live calculators = 13 | Total target = 120+

---

## 1. Remaining Calculators

### P0 — Must-Have (High Search Volume)

| # | Calculator | Est. Monthly Searches | Status | Slug |
|---|-----------|----------------------|--------|------|
| 1 | Step-up SIP Calculator | 6K | **Not built** | `step-up-sip-calculator` |

### P1 — Important (Medium-High Search Volume)

| # | Calculator | Est. Monthly Searches | Status | Slug |
|---|-----------|----------------------|--------|------|
| 2 | GST Calculator | 90K | **Not built** | `gst-calculator` |
| 3 | Salary / In-Hand Calculator | 110K | **Not built** | `salary-calculator` |
| 4 | Simple Interest Calculator | 33K | **Not built** | `simple-interest-calculator` |
| 5 | EPF Calculator | 27K | **Not built** | `epf-calculator` |
| 6 | Term Insurance Calculator | 22K | **Not built** | `term-insurance-calculator` |

### P2 — Nice-to-Have (Lower Volume but Good Coverage)

| # | Calculator | Est. Monthly Searches | Status | Slug |
|---|-----------|----------------------|--------|------|
| 7 | Gratuity Calculator | 18K | **Not built** | `gratuity-calculator` |
| 8 | Capital Gains Tax Calculator | 15K | **Not built** | `capital-gains-tax-calculator` |
| 9 | Inflation Calculator | 12K | **Not built** | `inflation-calculator` |
| 10 | Mutual Fund Return Calculator | 40K | **Not built** | `mutual-fund-return-calculator` |

### Already Built (13 calculators)

| Calculator | Slug |
|-----------|------|
| SIP Simulator | `/sip-simulator` |
| EMI Analyzer | `/emi-analyzer` |
| Tax Sandbox | `/tax-sandbox` |
| Accumulator | `/accumulation-calculator` |
| FD Comparator | `/fd-comparator` |
| SWP Stress Test | `/swp-stress-test` |
| FIRE Matrix | `/fire-matrix` |
| CTC Optimizer | `/ctc-optimizer` |
| NPS Modeler | `/nps-modeler` |
| Goal Planner | `/goal-planner` |
| PPF Calculator | `/ppf-calculator` |
| Compound Interest | `/compound-interest-calculator` |
| HRA Calculator | `/hra-calculator` |

---

## 2. Technical SEO Tasks (Week 1 — SEM Plan)

| # | Task | Status | Details |
|---|------|--------|---------|
| 1 | Submit sitemap to Google Search Console | **Pending** | Register `financialsimulators.in`, verify via DNS TXT, submit `sitemap.xml` |
| 2 | Submit sitemap to Bing Webmaster Tools | **Pending** | Register, verify, submit sitemap URL |
| 3 | Request indexing for all pages in GSC | **Pending** | ~55 URLs — paste each in URL Inspection → "Request Indexing" |
| 4 | Add Organization schema to root layout | **Pending** | JSON-LD in `src/app/layout.tsx` with name, url, description |
| 5 | Set up Google Analytics 4 | **Pending** | Create GA4 property, get Measurement ID, add `@next/third-parties` or script, set up custom events |
| 6 | Add hreflang tags | **Pending** | `alternates.languages` with `en-IN` in page metadata |
| 7 | Add Cache-Control headers for SSG/ISR | **Pending** | Configure in `next.config.ts`: SSG `s-maxage=86400`, ISR `s-maxage=3600` |
| 8 | Add Article schema to blog posts | **Pending** | JSON-LD in `src/app/blog/[slug]/page.tsx` with datePublished, dateModified, author |

---

## 3. Content Tasks

| # | Task | Status | Target |
|---|------|--------|--------|
| 1 | Write blog posts — Cluster 1 (SIP & Mutual Funds) | **Not started** | 25 posts |
| 2 | Write blog posts — Cluster 2 (Tax & Salary) | **Not started** | 25 posts |
| 3 | Write blog posts — Clusters 3–5 (Loans, Retirement, FD) | **Not started** | 57 posts |
| 4 | Total blog target: Month 1 | **Not started** | 150 posts |
| 5 | Total blog target: Month 2 | **Not started** | 300 posts |
| 6 | Total blog target: Month 6 | **Not started** | 1,500 posts |

---

## 4. Distribution & Marketing Tasks

| # | Task | Status | Details |
|---|------|--------|---------|
| 1 | Quora campaign | **Not started** | 10 answers/day targeting SIP, mutual fund, tax topics |
| 2 | Reddit campaign | **Not started** | r/IndiaInvestments, r/IndiaFinance, r/personalfinanceindia |
| 3 | Twitter/X campaign | **Not started** | @FinSimIndia account, 5 tweets/day + 1 thread/day |
| 4 | Telegram channel | **Not started** | @FinancialSimulators channel, daily financial insight posts |
| 5 | WhatsApp groups | **Not started** | Join 20+ finance groups, share 1 result card/day/group |
| 6 | YouTube channel | **Not started** | 3 screen-recording videos/week (Month 2+) |
| 7 | Guest posting outreach | **Not started** | 30 Indian finance blogs, target 10 published posts (Month 3+) |

---

## 5. Feature & Code Tasks

| # | Task | Status | Priority | Details |
|---|------|--------|----------|---------|
| 1 | Programmatic SEO page generator | **Not started** | P0 (Month 2) | Dynamic route `[calc]/[amount]-[duration]/page.tsx` generating 346+ pages |
| 2 | Scale programmatic to 3,000 pages | **Not started** | P1 (Month 2) | SIP × amount × duration, PPF, EMI, FD, tax, HRA combos |
| 3 | Scale programmatic to 10,000 pages | **Not started** | P1 (Month 3) | Expanded combos + comparison pages |
| 4 | Scale to 30,000+ pages | **Not started** | P2 (Month 4–5) | Hindi + English + regional language pages |
| 5 | WhatsApp/Twitter share buttons | **Not started** | P1 (Month 5) | Share result cards from every calculator |
| 6 | Embeddable widget program | **Not started** | P2 (Month 4) | `/embed/sip-calculator`, iframe-able pages, "Embed this" UI |
| 7 | Email capture (Substack/Buttondown) | **Not started** | P2 (Month 5) | Lead magnet PDF + weekly "This Week's Number" email |
| 8 | Hindi localization | **Not started** | P1 (Month 4) | Next.js i18n routing `/hi/`, translate top 25 calculators + 100 posts |
| 9 | Regional language expansion | **Not started** | P2 (Month 6) | Tamil, Telugu, Bengali, Marathi — `/ta/`, `/te/`, `/bn/`, `/mr/` |
| 10 | PWA conversion | **Not started** | P2 (Month 6) | `manifest.json`, service worker, "Add to Home Screen" prompt |
| 11 | Linkable assets | **Not started** | P2 (Month 5) | Data studies, infographics, interactive comparisons |

---

## 6. Infrastructure & Deployment

| # | Task | Status | Details |
|---|------|--------|---------|
| 1 | Switch Railway to GitHub auto-deploy | **Pending** | Currently using manual `railway up` — need to switch in Railway dashboard to connect GitHub repo |
| 2 | Production domain verification | **Check** | Confirm `financialsimulators.in` is live and all routes work |
| 3 | SSL/HTTPS verification | **Check** | Confirm HTTPS is active on all pages |
| 4 | 404 page | **Built** | Custom 404 page exists at `src/app/not-found.tsx` |

---

## Priority Order (What to Do Next)

1. **Step-up SIP Calculator** — P0, only remaining high-priority calculator
2. **Organization schema** — Quick win, 15-min task
3. **Article schema for blog** — Quick win, 30-min task
4. **hreflang tags** — Quick win, 15-min task
5. **Cache-Control headers** — Quick win, 15-min task
6. **GSC sitemap submission** — Operational, do immediately
7. **P1 calculators** (GST, Salary, Simple Interest, EPF, Term Insurance)
8. **Blog content Cluster 1** — Start writing, 3–4 posts/day
9. **Programmatic SEO system** — Month 2 priority
10. **Distribution campaigns** — Start once 20+ blog posts are live

---

*File auto-generated: 2026-04-23 | Cross-reference: SEM_Tasks_Sabya.md*