"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { BLOG_CATEGORIES } from "@/lib/blog-categories";
import type { BlogCategory } from "@/lib/blog-categories";

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") ?? "all";

  function setCategory(category: string) {
    const params = new URLSearchParams();
    if (category !== "all") {
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