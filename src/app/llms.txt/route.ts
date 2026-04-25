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
import { getAllPosts } from "@/lib/blog";

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

export async function GET() {
  const calculatorLines = calculatorConfigs
    .map((c) => `- [${c.name}](/${c.slug}): ${c.shortDescription}`)
    .join("\n");

  const content = `# c7xai

> The truth about your money. Financial clarity for India — inflation-adjusted, tax-aware, zero PII.

## Calculators
${calculatorLines}

## Blog
- [Blog Index](/blog): Financial stories for common Indians
${getAllPosts().map((post) => `- [${post.title}](/blog/${post.slug})`).join("\n")}

## Use Cases
- "How much SIP do I need for ₹1 crore?" → /sip-simulator
- "Is old or new tax regime better?" → /tax-sandbox
- "Will my retirement fund last?" → /swp-stress-test
- "When can I retire?" → /fire-matrix
- "How much of my CTC do I actually keep?" → /ctc-optimizer
- "How much pension will NPS give me?" → /nps-modeler
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}