import { NextResponse } from "next/server";
import sipConfig from "@/content/calculators/sip.json";
import emiConfig from "@/content/calculators/emi.json";
import taxConfig from "@/content/calculators/tax.json";
import accumConfig from "@/content/calculators/accum.json";
import fdConfig from "@/content/calculators/fd.json";
import swpConfig from "@/content/calculators/swp.json";
import fireConfig from "@/content/calculators/fire.json";
import ctcConfig from "@/content/calculators/ctc.json";
import npsConfig from "@/content/calculators/nps.json";
import goalConfig from "@/content/calculators/goal.json";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

const calculatorConfigs = [
  sipConfig,
  emiConfig,
  taxConfig,
  accumConfig,
  fdConfig,
  swpConfig,
  fireConfig,
  ctcConfig,
  npsConfig,
  goalConfig,
];

function formatCalculatorFaqs(
  config: (typeof calculatorConfigs)[number]
): string {
  return config.faq
    .map((item) => `**Q: ${item.question}**\n${item.answer}`)
    .join("\n\n");
}

export async function GET() {
  const calculatorSections = calculatorConfigs
    .map(
      (c) => `## ${c.name}

URL: /${c.slug}
Description: ${c.metaDescription}

### Frequently Asked Questions
${formatCalculatorFaqs(c)}`
    )
    .join("\n\n---\n\n");

  const content = `# c7xai — Full Content

> The truth about your money. Financial clarity for India — inflation-adjusted, tax-aware, zero PII.

${calculatorSections}

---

## Blog
- [Blog Index](/blog): Financial stories for common Indians
- Individual blog posts with full content are available at /blog/[slug]

${getAllPosts().map((summary) => { const post = getPostBySlug(summary.slug); return post ? `### ${post.title}\n\n${post.description}\n\n${post.content}` : null; }).filter(Boolean).join("\n\n---\n\n")}
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}