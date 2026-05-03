import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { BlogCategory } from "./blog-categories";
import blogIndex from "./blog-index.json";

export { BLOG_CATEGORIES } from "./blog-categories";
export type { BlogCategory } from "./blog-categories";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: BlogCategory;
  tags: string[];
  calculators: string[];
  readTime: number;
  featured: boolean;
  status: "published" | "draft";
  locale: "en" | "hi";
  content: string;
}

export type BlogPostSummary = Omit<BlogPost, "content">;

const postsDirectory = path.join(process.cwd(), "src/content/blog");

// Blog listing uses the pre-generated JSON index (works at runtime without filesystem)
export function getAllPosts(): BlogPostSummary[] {
  return blogIndex as BlogPostSummary[];
}

export function getAllPostsByLocale(locale: string): BlogPostSummary[] {
  return getAllPosts().filter((post) => post.locale === locale || (!post.locale && locale === "en"));
}

export function getPostBySlug(slug: string): BlogPost | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  if (!fullPath.startsWith(postsDirectory)) return null;

  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const wordCount = content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return {
    slug,
    title: data.title ?? "",
    description: data.description ?? "",
    date: data.date ?? "",
    category: data.category ?? "personal-finance",
    tags: data.tags ?? [],
    calculators: data.calculators ?? [],
    readTime: data.readTime ?? readTime,
    featured: data.featured ?? false,
    status: data.status ?? "draft",
    locale: data.locale ?? "en",
    content,
  };
}

export function getFeaturedPosts(): BlogPostSummary[] {
  return getAllPosts().filter((post) => post.featured);
}

export function getPostsByCategory(category: BlogCategory): BlogPostSummary[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = new Set<string>();
  posts.forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}