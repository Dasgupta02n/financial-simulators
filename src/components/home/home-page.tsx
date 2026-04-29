"use client";

import { Link } from "@/i18n/navigation";
import { CalcCard } from "@/components/home/calc-card";
import { BlogCategoryThumb } from "@/components/home/blog-category-thumb";
import { HeroIllustration } from "@/components/home/hero-illustration";
import { InflationIllustration, TaxIllustration, NoProductIllustration } from "@/components/home/method-illustrations";
import { useTranslations } from "next-intl";

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  featured: boolean;
  readTime: number;
}

interface HomePageProps {
  posts: BlogPost[];
}

const CALCULATOR_GROUPS: readonly {
  questionKey: string;
  calculators: readonly { id: string; slug: string; tagKey?: string }[];
}[] = [
  {
    questionKey: "home.questionWillMoneyLast",
    calculators: [
      { id: "swp", slug: "swp-stress-test" },
      { id: "fire", slug: "fire-matrix" },
    ],
  },
  {
    questionKey: "home.questionHowMuchKeep",
    calculators: [
      { id: "tax", slug: "tax-sandbox" },
      { id: "hra", slug: "hra-calculator", tagKey: "tagNew" },
      { id: "ctc", slug: "ctc-optimizer" },
      { id: "salary", slug: "salary-calculator" },
    ],
  },
  {
    questionKey: "home.questionWhenRetire",
    calculators: [
      { id: "fire", slug: "fire-matrix" },
      { id: "nps", slug: "nps-modeler" },
      { id: "ppf", slug: "ppf-calculator", tagKey: "tagNew" },
      { id: "epf", slug: "epf-calculator", tagKey: "tagNew" },
    ],
  },
  {
    questionKey: "home.questionRealReturn",
    calculators: [
      { id: "sip", slug: "sip-simulator", tagKey: "tagPopular" },
      { id: "fd", slug: "fd-comparator" },
      { id: "compound", slug: "compound-interest-calculator", tagKey: "tagNew" },
      { id: "stepUpSip", slug: "step-up-sip-calculator", tagKey: "tagNew" },
      { id: "simpleInterest", slug: "simple-interest-calculator", tagKey: "tagNew" },
    ],
  },
  {
    questionKey: "home.questionHowMuchPay",
    calculators: [
      { id: "emi", slug: "emi-analyzer" },
      { id: "gst", slug: "gst-calculator", tagKey: "tagNew" },
      { id: "realEstate", slug: "real-estate-calculator", tagKey: "tagNew" },
      { id: "depreciation", slug: "depreciation-calculator", tagKey: "tagNew" },
    ],
  },
  {
    questionKey: "home.questionOnTrack",
    calculators: [
      { id: "goal", slug: "goal-planner" },
      { id: "accumulation", slug: "accumulation-calculator" },
      { id: "crypto", slug: "crypto-calculator", tagKey: "tagNew" },
      { id: "forex", slug: "forex-calculator", tagKey: "tagNew" },
    ],
  },
];

export default function HomePage({ posts }: HomePageProps) {
  const t = useTranslations("home");
  const tc = useTranslations("calculators");
  const tn = useTranslations("nav");

  return (
    <main className="flex-1 flex flex-col">
      <section className="w-full gradient-hero relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 pt-28 pb-24">
          <p className="text-sm font-mono uppercase tracking-[0.25em] text-sienna mb-6">
            {t("heroTag")}
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] max-w-4xl font-serif-display text-white">
            {t("heroTitle")}{" "}
            <span className="text-sienna">{t("heroHighlight")}</span>.
          </h1>
          <p className="text-xl md:text-2xl text-white/70 font-serif-display mt-6 max-w-2xl">
            {t("heroSubtitle")}
          </p>
          <p className="text-base text-white/50 mt-4 max-w-xl leading-relaxed">
            {t("heroBody")}
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link
              href="/sip-simulator"
              className="inline-flex items-center gap-2 px-6 py-3 bg-sienna text-white text-sm font-semibold hover:bg-sienna/90 transition-colors rounded"
            >
              {t("heroCta")} &rarr;
            </Link>
            <Link
              href="#calculators"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white text-sm font-medium hover:border-sienna/50 hover:text-sienna transition-colors rounded"
            >
              {t("heroCtaAll")}
            </Link>
          </div>
        </div>
        <HeroIllustration />
      </section>

      <section className="w-full section-navy bg-grid-pattern">
        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
          <div className="truth-reveal text-center">
            <div className="text-4xl font-bold font-serif-display text-sienna">3.8%</div>
            <div className="text-sm text-white/50 font-mono mt-1">{t("statRealSip")}</div>
            <div className="text-xs text-white/30 font-mono line-through">12% {t("statAdvertised")}</div>
          </div>
          <div className="truth-reveal text-center">
            <div className="text-4xl font-bold font-serif-display text-sienna">5.6%</div>
            <div className="text-sm text-white/50 font-mono mt-1">{t("statPostTaxFd")}</div>
            <div className="text-xs text-white/30 font-mono line-through">7% {t("statAdvertised")}</div>
          </div>
          <div className="truth-reveal text-center">
            <div className="text-4xl font-bold font-serif-display text-sienna">0%</div>
            <div className="text-sm text-white/50 font-mono mt-1">{t("statDataCollected")}</div>
            <div className="text-xs text-white/30 font-mono">{t("statNoSignup")}</div>
          </div>
        </div>
      </section>

      <section id="calculators" className="w-full section-gray bg-dots-pattern">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary mb-4 font-serif-display">
            {t("sectionTitle")}
          </h2>
          <p className="text-sm text-text-secondary mb-12 max-w-lg">
            {t("sectionSubtitle")}
          </p>
          <div className="space-y-16">
            {CALCULATOR_GROUPS.map((group) => (
              <div key={group.questionKey}>
                <h3 className="text-lg font-semibold text-sienna font-serif-display mb-6">
                  {t(group.questionKey.replace("home.", ""))}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
                  {group.calculators.map((calc, i) => (
                    <CalcCard
                      key={calc.id + i}
                      id={calc.id}
                      name={tc(calc.id)}
                      slug={calc.slug}
                      description={tc(`${calc.id}Desc`)}
                      tag={calc.tagKey ? tc(calc.tagKey) : undefined}
                      index={i}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full section-white">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary font-serif-display">
            {t("methodTitle")}
          </h2>
          <p className="text-sm text-text-secondary mt-2 mb-12 max-w-lg">
            {t("methodSubtitle")}
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-shadow relative overflow-hidden">
              <InflationIllustration />
              <div className="text-2xl font-bold font-serif-display text-sienna mb-3">{t("methodInflationTitle")}</div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {t("methodInflationBody")}
              </p>
            </div>
            <div className="card-shadow relative overflow-hidden">
              <TaxIllustration />
              <div className="text-2xl font-bold font-serif-display text-sienna mb-3">{t("methodTaxTitle")}</div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {t("methodTaxBody")}
              </p>
            </div>
            <div className="card-shadow relative overflow-hidden">
              <NoProductIllustration />
              <div className="text-2xl font-bold font-serif-display text-sienna mb-3">{t("methodNoProductTitle")}</div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {t("methodNoProductBody")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {posts.length > 0 && (
        <section className="w-full section-gray">
          <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary font-serif-display">
                {t("blogTitle")}
              </h2>
              <Link
                href="/blog"
                className="text-sm font-semibold text-sienna hover:text-sienna/80 transition-colors"
              >
                {t("blogAllLink")} &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block"
                >
                  <div className="aspect-[4/3] bg-ink-light border border-border mb-4 overflow-hidden group-hover:border-sienna/30 transition-colors rounded-lg relative">
                    <BlogCategoryThumb category={post.category} />
                  </div>
                  <div className="text-xs uppercase font-mono text-text-muted mb-2">
                    {post.category} &middot; {post.readTime} {t("blogMinRead")}
                  </div>
                  <h3 className="text-lg font-bold text-text-primary group-hover:text-sienna transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-text-secondary mt-2 line-clamp-2">
                    {post.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="w-full section-white bg-dots-pattern border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="text-4xl font-bold font-serif-display text-text-primary mb-6">
            {t("privacyTitle")}
          </div>
          <p className="text-lg text-text-secondary max-w-xl mx-auto leading-relaxed">
            {t("privacyBody")}
          </p>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm font-mono text-text-muted">
            <span>{t("privacyNoSignups")}</span>
            <span className="text-border">&middot;</span>
            <span>{t("privacyNoPii")}</span>
            <span className="text-border">&middot;</span>
            <span>{t("privacyNoCookies")}</span>
            <span className="text-border">&middot;</span>
            <span>{t("privacyNoServer")}</span>
          </div>
        </div>
      </section>

      <footer className="w-full section-navy bg-grid-pattern">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <span className="text-xl font-bold text-white">c7<span className="text-sienna">xai</span></span>
            <p className="text-xs text-white/40 mt-3 leading-relaxed">
              {t("footerDescription")}
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase font-mono tracking-[0.15em] text-white/40 mb-4">{t("footerCalculators")}</h4>
            <div className="flex flex-col gap-2">
              <Link href="/sip-simulator" className="text-sm text-white/60 hover:text-sienna transition-colors">{tc("sip")}</Link>
              <Link href="/emi-analyzer" className="text-sm text-white/60 hover:text-sienna transition-colors">{tc("emi")}</Link>
              <Link href="/tax-sandbox" className="text-sm text-white/60 hover:text-sienna transition-colors">{tc("tax")}</Link>
              <Link href="/fire-matrix" className="text-sm text-white/60 hover:text-sienna transition-colors">{tc("fire")}</Link>
              <Link href="/real-estate-calculator" className="text-sm text-white/60 hover:text-sienna transition-colors">{tc("realEstate")}</Link>
              <Link href="/crypto-calculator" className="text-sm text-white/60 hover:text-sienna transition-colors">{tc("crypto")}</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs uppercase font-mono tracking-[0.15em] text-white/40 mb-4">{t("footerMore")}</h4>
            <div className="flex flex-col gap-2">
              <Link href="/methodology" className="text-sm text-white/60 hover:text-sienna transition-colors">{tn("methodology")}</Link>
              <Link href="/truth-index" className="text-sm text-white/60 hover:text-sienna transition-colors">{tn("truthIndex")}</Link>
              <Link href="/compare" className="text-sm text-white/60 hover:text-sienna transition-colors">{tn("compare")}</Link>
              <Link href="/forex-calculator" className="text-sm text-white/60 hover:text-sienna transition-colors">{tn("forex-calculator")}</Link>
              <Link href="/depreciation-calculator" className="text-sm text-white/60 hover:text-sienna transition-colors">{tn("depreciation-calculator")}</Link>
              <Link href="/blog" className="text-sm text-white/60 hover:text-sienna transition-colors">{tn("blog")}</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs uppercase font-mono tracking-[0.15em] text-white/40 mb-4">{t("footerLegal")}</h4>
            <div className="flex flex-col gap-2">
              <Link href="/privacy" className="text-sm text-white/60 hover:text-sienna transition-colors">{t("footerPrivacy")}</Link>
              <Link href="/terms" className="text-sm text-white/60 hover:text-sienna transition-colors">{t("footerTerms")}</Link>
              <Link href="/eula" className="text-sm text-white/60 hover:text-sienna transition-colors">{t("footerEula")}</Link>
              <Link href="/refund" className="text-sm text-white/60 hover:text-sienna transition-colors">{t("footerRefund")}</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
            <span className="text-xs text-white/30">
              &copy; {new Date().getFullYear()} by c7xai. Computed entirely client-side.
            </span>
            <span className="text-xs text-white/30">
              NIFTY 12% &mu; / 18% &sigma; &middot; 6% inflation &middot; LTCG 12.5% above &rsquo;1.25L
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}