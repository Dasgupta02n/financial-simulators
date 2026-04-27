import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Paths that should skip i18n middleware entirely
  const skipPrefixes = ["/api", "/auth", "/_next", "/_vercel"];
  if (skipPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Static files
  if (pathname.includes(".")) {
    return NextResponse.next();
  }

  // Let next-intl handle all locale routing
  // With localePrefix: "as-needed", English stays at root, others get prefixes
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|auth|_next|_vercel|.*\\..*).*)"],
};