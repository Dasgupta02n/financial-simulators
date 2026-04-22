export const BLOG_CATEGORIES = [
  { slug: "markets-policy", label: "Markets & Policy" },
  { slug: "personal-finance", label: "Personal Finance" },
  { slug: "tax-ctc", label: "Tax & CTC" },
  { slug: "retirement", label: "Retirement" },
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number]["slug"];