import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog";

export async function GET() {
  const posts = getAllPosts().filter((post) => post.status === "published");
  return NextResponse.json({ posts });
}