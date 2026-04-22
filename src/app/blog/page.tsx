import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllPosts } from "@/lib/blog";
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
        <Suspense fallback={null}>
          <CategoryFilter />
        </Suspense>
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