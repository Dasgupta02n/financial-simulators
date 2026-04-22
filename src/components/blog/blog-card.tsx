import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import type { BlogCategory } from "@/lib/blog-categories";
import { BLOG_CATEGORIES } from "@/lib/blog-categories";

interface BlogCardProps {
  post: BlogPost;
}

function categoryLabel(slug: BlogCategory): string {
  return BLOG_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

const categoryColors: Record<string, string> = {
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