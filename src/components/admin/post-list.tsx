"use client";

import { useState, useEffect } from "react";
import { PostEditor } from "./post-editor";
import type { BlogPost } from "@/lib/blog";

export function PostList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await fetch("/api/admin/posts");
        const data = await res.json();
        setPosts(data.posts ?? []);
      } catch {
        // Blog API not available
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  function refreshPosts() {
    setEditing(null);
    setCreating(false);
    setLoading(true);
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => setPosts(data.posts ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  async function handleDelete(slug: string) {
    if (!confirm(`Delete "${slug}"? This cannot be undone.`)) return;
    setDeleting(slug);
    try {
      const res = await fetch(`/api/admin/delete?path=src/content/blog/${slug}.mdx`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        refreshPosts();
      } else {
        alert(`Failed to delete: ${data.error ?? "Unknown error"}`);
      }
    } catch {
      alert("Failed to delete. Make sure GITHUB_TOKEN is configured.");
    } finally {
      setDeleting(null);
    }
  }

  if (creating) {
    return <PostEditor onSaved={refreshPosts} />;
  }

  if (editing) {
    return <PostEditor slug={editing} onSaved={refreshPosts} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-mono text-gain">Blog Posts</h2>
        <button
          onClick={() => setCreating(true)}
          className="px-3 py-1.5 text-xs rounded-md bg-gain text-ink font-semibold hover:bg-gain/90 transition-colors"
        >
          + New Post
        </button>
      </div>

      {loading ? (
        <p className="text-text-secondary text-sm font-mono">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-text-secondary text-sm font-mono">No posts found.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-2 text-text-secondary font-mono">Title</th>
              <th className="pb-2 text-text-secondary font-mono">Locale</th>
              <th className="pb-2 text-text-secondary font-mono">Category</th>
              <th className="pb-2 text-text-secondary font-mono">Date</th>
              <th className="pb-2 text-text-secondary font-mono">Status</th>
              <th className="pb-2 text-text-secondary font-mono">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.slug} className="border-b border-border/50">
                <td className="py-2 text-text-primary">{post.title}</td>
                <td className="py-2">
                  <span className={`text-xs px-2 py-0.5 rounded font-mono ${
                    post.locale === "hi"
                      ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                      : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  }`}>
                    {post.locale === "hi" ? "हि" : "EN"}
                  </span>
                </td>
                <td className="py-2 text-text-secondary">{post.category}</td>
                <td className="py-2 text-text-secondary font-mono">{post.date}</td>
                <td className="py-2">
                  <span className={`text-xs px-2 py-0.5 rounded font-mono ${
                    post.status === "published"
                      ? "bg-gain/10 text-gain border border-gain/20"
                      : "bg-warn/10 text-warn border border-warn/20"
                  }`}>
                    {post.status}
                  </span>
                </td>
                <td className="py-2">
                  <button
                    onClick={() => setEditing(post.slug)}
                    className="text-xs text-gain hover:text-gain/80 font-mono mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.slug)}
                    disabled={deleting === post.slug}
                    className="text-xs text-loss hover:text-loss/80 font-mono disabled:opacity-50"
                  >
                    {deleting === post.slug ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}