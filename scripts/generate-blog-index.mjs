import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsDir = path.join(__dirname, "..", "src", "content", "blog");
const outFile = path.join(__dirname, "..", "src", "lib", "blog-index.json");

if (!fs.existsSync(postsDir)) {
  console.error("Blog content directory not found:", postsDir);
  process.exit(1);
}

const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx"));

const posts = files
  .map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(postsDir, filename), "utf8");
    const { data, content } = matter(raw);
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
    };
  })
  .filter((post) => post.status === "published" && post.title)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

fs.writeFileSync(outFile, JSON.stringify(posts, null, 2));
console.log(`Generated blog index with ${posts.length} posts → ${outFile}`);