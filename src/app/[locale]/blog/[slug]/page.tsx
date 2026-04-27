import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { BLOG_CATEGORIES } from "@/lib/blog-categories";
import { CalculatorCard as CalculatorCardEmbed } from "@/components/blog/calculator-card-embed";
import { ShareBar } from "@/components/shared/share-bar";

interface LocaleBlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: LocaleBlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | c7xai`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

const mdxComponents = {
  CalculatorCard: CalculatorCardEmbed,
};

function ArticleJsonLd({ post }: { post: NonNullable<ReturnType<typeof getPostBySlug>> }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: "c7xai",
    },
    publisher: {
      "@type": "Organization",
      name: "c7xai",
    },
    keywords: post.tags.join(", "),
  };

  // Server-generated structured data from our own MDX content files — not user input.
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function LocaleBlogPostPage({ params }: LocaleBlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || post.status !== "published") {
    notFound();
  }

  const categoryLabel =
    BLOG_CATEGORIES.find((c) => c.slug === post.category)?.label ?? post.category;

  return (
    <>
      <ArticleJsonLd post={post} />
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 pt-8 pb-12">
        <a
          href="/blog"
          className="text-sm text-text-secondary hover:text-gain transition-colors font-mono"
        >
          &larr; Back to blog
        </a>

        <article className="mt-6">
          <header className="mb-8">
            <div className="text-xs uppercase font-mono text-amber-400 mb-2">
              {categoryLabel} &middot; {post.readTime} min read
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
              {post.title}
            </h1>
            <time className="text-sm text-text-secondary mt-2 block">
              Published{" "}
              {new Date(post.date).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </header>

          <div className="prose prose-invert prose-sm max-w-none text-text-secondary [&_h2]:text-text-primary [&_h3]:text-text-primary [&_strong]:text-text-primary [&_a]:text-gain [&_a:hover]:text-gain/80 [&_code]:text-gain [&_code]:bg-border/50 [&_code]:px-1 [&_code]:rounded">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>

          <footer className="mt-10 pt-6 border-t border-border">
            <div className="flex gap-2 flex-wrap text-xs">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 rounded bg-border text-text-secondary font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>
            {post.calculators.length > 0 && (
              <div className="mt-4 flex gap-2 flex-wrap items-center">
                <span className="text-xs text-text-secondary">Related calculators:</span>
                {post.calculators.map((calcId) => (
                  <a
                    key={calcId}
                    href={`/${calcId}`}
                    className="text-xs px-2 py-1 rounded bg-gain/10 text-gain border border-gain/20 hover:bg-gain/20 transition-colors font-mono"
                  >
                    {calcId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} &rarr;
                  </a>
                ))}
              </div>
            )}
          </footer>
        </article>

        <div className="flex items-center gap-2 mt-6">
          <span className="text-xs text-text-muted font-mono">Share:</span>
          <ShareBar title={post.title + " — c7xai"} />
        </div>
      </main>
    </>
  );
}